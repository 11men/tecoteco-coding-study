# 버스 파업 크롤링 시스템 요약

## 📋 핵심 요구사항

### 크롤링 주기
- **Tier 1 (공식 소스)**: 30분마다 실행
- **Tier 2 (뉴스/SNS)**: 2시간마다 실행

### 알림 조건
✅ **신규 파업 등록 시**: 즉시 알림 발송
✅ **기존 파업 업데이트 시**: 변경 알림 발송
- 날짜/시간 변경
- 상태 변경 (예고 → 파업중 → 파업중단)
- 지역/버스타입 범위 변경

## 📊 파업 정보 구조

### 필수 정보 항목

| 항목 | 값 | 설명 |
|------|-----|------|
| **지역** | 서울, 경기 | 파업 발생 지역 |
| **버스 타입** | 시내버스, 시외버스 | 영향받는 버스 종류 |
| **날짜** | YYYY-MM-DD | 파업 시작 날짜 |
| **시간** | HH:MM | 파업 시작 시간 |
| **상태** | 예고, 파업중, 파업중단, 종료 | 파업 진행 상태 |

### 상태 전환 흐름

```mermaid
stateDiagram-v2
    [*] --> scheduled: 파업 예고
    scheduled --> ongoing: 파업 시작
    scheduled --> cancelled: 파업 철회
    ongoing --> cancelled: 파업 중단
    ongoing --> ended: 파업 종료
    cancelled --> [*]
    ended --> [*]
```

## 🗄️ 데이터베이스 스키마

### strike_events 테이블

```sql
CREATE TABLE strike_events (
    id VARCHAR(50) PRIMARY KEY,
    raw_notice_id VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    description TEXT,

    -- 상태
    status VARCHAR(20) DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'ongoing', 'cancelled', 'ended')),

    -- 날짜/시간
    strike_date DATE,
    strike_time TIME,
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,

    -- 범위
    affected_regions TEXT[],      -- ['seoul', 'gyeonggi']
    bus_types TEXT[],              -- ['city', 'intercity']
    affected_companies TEXT[],
    affected_route_count INT,

    -- 메타데이터
    source VARCHAR(50) NOT NULL,
    source_url TEXT,
    detected_at TIMESTAMP DEFAULT NOW(),
    last_updated_at TIMESTAMP DEFAULT NOW()
);
```

### strike_event_changes 테이블 (변경 이력)

```sql
CREATE TABLE strike_event_changes (
    id VARCHAR(50) PRIMARY KEY,
    strike_event_id VARCHAR(50) NOT NULL,
    change_type VARCHAR(50) NOT NULL
        CHECK (change_type IN ('status_change', 'datetime_change', 'region_change', 'created')),
    old_value JSONB,
    new_value JSONB,
    changed_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 처리 흐름

### 시퀀스 다이어그램 (간략)

```mermaid
sequenceDiagram
    participant Scheduler as 스케줄러<br/>(30분마다)
    participant Crawler as 크롤러
    participant Web as 웹사이트
    participant Service as StrikeService
    participant DB as 데이터베이스
    participant FCM as 알림

    Scheduler->>Crawler: 크롤링 시작
    Crawler->>Web: 공지사항 수집
    Web-->>Crawler: HTML 응답
    Crawler->>Service: 파업 정보 처리

    alt 신규 파업
        Service->>DB: 저장
        Service->>FCM: 신규 알림 발송
        Note over FCM: "[서울] 버스 파업 예고"
    else 기존 파업 업데이트
        Service->>DB: 업데이트
        Service->>FCM: 변경 알림 발송
        Note over FCM: "파업 정보 업데이트"
    end
```

### 1. 크롤링 (30분마다)

```
TOPIS/GBIS 웹사이트
    ↓
공지사항 수집
    ↓
키워드 필터링 ("파업", "운행중단")
    ↓
파업 정보 추출
```

### 2. 정보 추출

```typescript
extractStrikeInfo() {
  // 1. 지역: "서울", "경기" 키워드
  // 2. 버스타입: "시내버스", "시외버스" 키워드
  // 3. 날짜: "X월 X일" 패턴
  // 4. 시간: "오전/오후 X시" 패턴
  // 5. 상태: "파업 예정", "파업 돌입", "파업 중단" 키워드
}
```

### 3. 변경 감지

```typescript
// 기존 파업 찾기 (같은 날짜 + 같은 지역)
const existing = await findSimilarStrikeEvent();

if (existing) {
  // 비교: 상태, 시간, 지역, 버스타입
  if (hasChanges) {
    await updateStrikeEvent();
    await sendNotification('update', changes); // ✅ 업데이트 알림
  }
} else {
  await createStrikeEvent();
  await sendNotification('new'); // ✅ 신규 알림
}
```

## 🔔 알림 시스템

### 신규 파업 알림

```json
{
  "notification": {
    "title": "[서울/경기] 버스 파업 예고",
    "body": "2026-01-15 04:00 - 시내버스"
  },
  "data": {
    "type": "strike_created",
    "strikeId": "strike_123",
    "status": "scheduled",
    "regions": ["seoul", "gyeonggi"],
    "busTypes": ["city"],
    "strikeDate": "2026-01-15",
    "strikeTime": "04:00:00"
  }
}
```

### 업데이트 알림

```json
{
  "notification": {
    "title": "[서울] 파업 정보 업데이트",
    "body": "변경사항: status: scheduled → ongoing"
  },
  "data": {
    "type": "strike_updated",
    "strikeId": "strike_123",
    "changes": [
      "status: scheduled → ongoing"
    ]
  }
}
```

## 📁 프로젝트 구조

```
src/
├── crawlers/
│   ├── base.ts              # 크롤러 베이스 클래스
│   ├── topis.ts             # TOPIS 크롤러
│   └── gbis.ts              # GBIS 크롤러
├── services/
│   ├── strike.ts            # 파업 정보 처리 (핵심!)
│   └── notification.ts      # FCM 알림 발송
├── models/
│   ├── database.ts          # PostgreSQL 연결
│   ├── raw-notice.ts        # 원본 공지사항 모델
│   └── strike-event.ts      # 파업 이벤트 모델
├── utils/
│   ├── logger.ts            # Winston 로거
│   ├── redis.ts             # Redis 클라이언트
│   └── hash.ts              # 해시/ID 생성
└── scheduler.ts             # 30분마다 실행
```

## 🚀 실행 방법

### 1. 환경 설정

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/busstrike
REDIS_URL=redis://localhost:6379
CRAWLER_INTERVAL_TIER1=30  # 30분
CRAWLER_INTERVAL_TIER2=120 # 2시간
```

### 2. 데이터베이스 초기화

```bash
# PostgreSQL 테이블 생성
npm run init-db

# 초기 소스 데이터 입력
npm run seed
```

### 3. 크롤러 시작

```bash
# 개발 모드
npm run dev

# 프로덕션
npm run build
npm start
```

## 📈 모니터링

### 크롤링 통계

```sql
-- 최근 24시간 크롤링 현황
SELECT
    cs.name,
    COUNT(*) as total_crawls,
    SUM(CASE WHEN cl.status = 'success' THEN 1 ELSE 0 END) as success_count,
    SUM(cl.items_found) as total_items
FROM crawl_logs cl
JOIN crawl_sources cs ON cl.source_id = cs.id
WHERE cl.crawled_at >= NOW() - INTERVAL '24 hours'
GROUP BY cs.name;
```

### 파업 이벤트 현황

```sql
-- 활성 파업 이벤트
SELECT
    id,
    title,
    status,
    strike_date,
    strike_time,
    affected_regions,
    bus_types
FROM strike_events
WHERE status IN ('scheduled', 'ongoing')
ORDER BY strike_date, strike_time;
```

### 변경 이력 조회

```sql
-- 특정 파업의 변경 이력
SELECT
    change_type,
    old_value,
    new_value,
    changed_at
FROM strike_event_changes
WHERE strike_event_id = 'strike_123'
ORDER BY changed_at DESC;
```

## ⚠️ 주의사항

### 1. Rate Limiting
- 공공기관 사이트는 과도한 요청 시 차단 가능
- 30분 주기로 충분히 안전

### 2. 데이터 정확도
- 자동 추출 정보는 100% 정확하지 않을 수 있음
- 관리자 확인 프로세스 권장

### 3. 알림 중복 방지
- 같은 파업 이벤트는 1회만 신규 알림
- 실제 변경사항 있을 때만 업데이트 알림

### 4. 상태 관리
- 파업 종료 시 자동으로 `ended` 상태로 변경하는 배치 작업 필요
- `strike_date + 1day < NOW() AND status = 'ongoing'` → `ended`

## 📚 참고 문서

- [README.md](./README.md) - 전체 시스템 개요
- [database-schema.md](./database-schema.md) - DB 스키마 상세
- [api-spec.md](./api-spec.md) - Admin API 명세
- [implementation-guide.md](./implementation-guide.md) - 구현 가이드 (Step-by-Step)

## 🎯 다음 단계

### Phase 1: MVP ✅
- [x] 30분 주기 크롤링
- [x] 파업 정보 추출 (지역, 버스타입, 날짜, 시간, 상태)
- [x] 변경 감지 및 추적
- [x] 알림 시스템 (신규/업데이트)

### Phase 2: 고도화
- [ ] 뉴스 크롤러 추가 (Tier 2)
- [ ] 관리자 확인 워크플로우
- [ ] 대시보드 UI
- [ ] 모니터링 (Prometheus/Grafana)

### Phase 3: 스케일업
- [ ] ML 기반 정보 추출 (정확도 향상)
- [ ] 분산 크롤링 (다중 서버)
- [ ] 실시간 알림 (WebSocket)
- [ ] 노선별 상세 영향도 분석