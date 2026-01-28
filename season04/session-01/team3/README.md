# 서울/경기 버스 파업 알림 앱

> 버스 파업 정보를 실시간으로 제공하고, 대체 교통수단을 안내하여 시민들의 출퇴근 불편을 최소화하는 모바일 앱

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)

</div>

---

## 📌 프로젝트 정보

| 항목 | 내용 |
|------|------|
| **회차** | Season 4, Session 01 (2025-01-27) |
| **팀원** | 김지연, 박현두, 차승민 (3명) |
| **개발 기간** | 약 2시간 (기획 + 설계) |
| **해결 문제** | 서울/경기 버스 파업 시 실시간 알림 및 대체 교통 안내 |

---

## 🎯 프로젝트 비전

### 핵심 가치
- 🚨 **실시간 파업 알림**: 30분마다 자동 크롤링으로 최신 정보 제공
- 📍 **영향 노선 조회**: 내가 타는 버스가 영향받는지 즉시 확인
- 🚇 **대체 교통 안내**: 지하철, 택시 등 대체 수단 추천
- 🗺️ **지도 시각화**: 파업 지역 및 대체 경로 시각적 표시

### 타겟 사용자
- 서울/경기 지역 버스 이용 출퇴근자
- 파업 정보에 민감한 시민
- 대체 교통수단이 필요한 사람들

---

## 💡 접근 방식

### 엔터프라이즈급 설계
- **완전한 시스템 아키텍처**: Backend + Frontend + Infra
- **단계별 개발 로드맵**: MVP → 2단계 → 3단계 (8주 계획)
- **확장 가능한 구조**: 10개 기능 모듈화
- **프로덕션 레디**: AWS 인프라, 모니터링, CI/CD

---

## 🏗️ 시스템 아키텍처

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│   Database   │
│  React 18    │     │ Spring Boot  │     │ PostgreSQL   │
│  TypeScript  │     │   Java 21    │     │   Redis      │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Crawlers   │
                     │  TOPIS/GBIS  │
                     │  (30분 주기)  │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │     FCM      │
                     │  Push 알림   │
                     └──────────────┘
```

---

## 🚀 핵심 기능

### MVP (P0 - 필수)
1. **파업 알림 푸시** - FCM 기반 실시간 알림
2. **영향 노선 조회** - 지역/버스 타입별 조회
3. **대체 교통 안내** - 지하철, 택시 등 추천
4. **사용자 인증** - JWT 기반 인증/인가

### 2단계 (P1 - 중요)
5. **즐겨찾기 노선 관리** - 자주 타는 노선 저장
6. **실시간 혼잡도** - 대체 교통 혼잡도 정보
7. **출퇴근 경로 설정** - 출발/도착지 기반 맞춤 알림
8. **지도 기반 시각화** - 카카오맵 연동

### 3단계 (P2 - 선택)
9. **커뮤니티** - 실시간 제보, 정보 공유
10. **파업 히스토리/통계** - 과거 파업 분석

---

## 🛠️ 기술 스택

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| **Java** | 21 (LTS) | 프로그래밍 언어 |
| **Spring Boot** | 3.4.x | 프레임워크 |
| **PostgreSQL** | 16 | 메인 DB |
| **Redis** | 7 | 캐싱, 세션 |
| **JWT** | 0.12.x | 인증 토큰 |
| **Firebase** | 9.x | 푸시 알림 |

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| **React** | 18.3.x | UI 라이브러리 |
| **TypeScript** | 5.7.x | 타입 안전성 |
| **Vite** | 6.x | 빌드 도구 |
| **Tailwind CSS** | 3.4.x | 스타일링 |
| **React Query** | 5.x | 서버 상태 관리 |

### Infra
- **AWS**: EC2, RDS, ElastiCache, S3, CloudFront
- **Docker**: 컨테이너화
- **Terraform**: IaC (Infrastructure as Code)

---

## 📊 크롤링 시스템

### 데이터 소스
| 소스 | Tier | 주기 | 내용 |
|------|------|------|------|
| **TOPIS** (서울시) | Tier 1 | 30분 | 공식 파업 공지 |
| **GBIS** (경기도) | Tier 1 | 30분 | 공식 파업 공지 |
| **뉴스/SNS** | Tier 2 | 2시간 | 보조 정보 |

### 처리 흐름
```
1. 크롤링 (30분마다)
   ↓
2. 키워드 필터링 ("파업", "운행중단")
   ↓
3. 정보 추출 (지역, 버스타입, 날짜, 시간, 상태)
   ↓
4. 변경 감지 (신규 vs 업데이트)
   ↓
5. 알림 발송 (FCM)
```

### 파업 상태 관리
```
scheduled (예고) → ongoing (진행중) → ended (종료)
                 → cancelled (중단)
```

---

## 🗄️ 데이터베이스 스키마

### strike_events (파업 이벤트)
```sql
- id, title, description
- status (scheduled/ongoing/cancelled/ended)
- strike_date, strike_time
- affected_regions[] (서울, 경기)
- bus_types[] (시내버스, 시외버스)
- source, source_url
- detected_at, last_updated_at
```

### strike_event_changes (변경 이력)
```sql
- strike_event_id
- change_type (status_change, datetime_change, region_change)
- old_value, new_value
- changed_at
```

---

## 📂 프로젝트 구조

```
team3/
├── docs/                           # 문서
│   ├── features/                   # 10개 기능 상세 명세
│   │   ├── README.md              # 기능 로드맵
│   │   ├── feature-01-push-notification.md
│   │   ├── feature-02-affected-routes.md
│   │   └── ...
│   ├── crawling/                   # 크롤링 시스템 설계
│   │   ├── SUMMARY.md             # 크롤링 요약
│   │   ├── database-schema.md
│   │   ├── api-spec.md
│   │   └── implementation-guide.md
│   └── backend-notification-sequence.md
│
├── product/                        # 실제 코드
│   ├── backend/                    # Spring Boot
│   │   └── src/main/java/...
│   ├── frontend/                   # React + TypeScript
│   │   └── src/...
│   ├── terraform/                  # AWS 인프라
│   └── docker-compose.yml
│
└── README.md
```

---

## 📈 타임라인 (8주 계획)

| 단계 | 기간 | 내용 |
|------|------|------|
| **MVP** | 1-4주 | 인증, 파업 알림, 노선 조회, 대체 교통 |
| **2단계** | 5-6주 | 즐겨찾기, 혼잡도, 경로 설정, 지도 |
| **3단계** | 7-8주 | 커뮤니티, 히스토리/통계, 출시 |

---

## 💰 수익화 전략

| 전략 | 내용 | 예상 수익 |
|------|------|-----------|
| **프리미엄 구독** | 광고 제거, 상세 통계 | 월 2,900원 |
| **광고** | 배너/네이티브 광고 | CPM 기반 |
| **API 제공** | 기업/기관용 API | 월정액 |
| **제휴** | 택시, 킥보드 업체 | 수수료 |

---

## 🏆 성과 & 특징

### 프로젝트 성과
- ✅ **완전한 시스템 설계**: Backend + Frontend + Infra
- ✅ **10개 기능 로드맵**: P0/P1/P2 우선순위 구분
- ✅ **상세 문서화**: 20개 이상 마크다운 문서
- ✅ **실제 코드 구현**: Spring Boot + React 프로젝트 생성

### 차별화 포인트
- 🎯 **엔터프라이즈급 설계**: 프로덕션 레디 아키텍처
- 📝 **체계적 문서화**: 기능 명세, API 스펙, DB 스키마
- 🤖 **자동화**: 30분 주기 크롤링, 변경 감지, 푸시 알림
- 📊 **모니터링**: 크롤링 통계, 파업 이력 추적

---

## 🤔 한계점 & 배운 점

### 한계점
- **시간 부족**: 2시간 안에 코드 완성도 부족
- **UI 미구현**: 백엔드 중심, 프론트엔드는 기본 틀만
- **테스트 부재**: 실제 크롤링 동작 미검증

### 배운 점
- **설계의 중요성**: 탄탄한 설계가 개발 속도를 높인다
- **우선순위 설정**: P0/P1/P2 구분으로 집중도 향상
- **AI 활용**: 문서 생성, 코드 스캐폴딩에서 큰 도움
- **팀 협업**: 역할 분담 (기획/백엔드/프론트엔드)

---

## 🔗 관련 문서

### 기능 명세
- [기능 로드맵](./docs/features/README.md)
- [학습 로드맵](./docs/features/LEARNING_ROADMAP.md)

### 크롤링 시스템
- [크롤링 요약](./docs/crawling/SUMMARY.md)
- [DB 스키마](./docs/crawling/database-schema.md)
- [API 명세](./docs/crawling/api-spec.md)
- [구현 가이드](./docs/crawling/implementation-guide.md)

### 기술 스택
- [기술 스펙](./product/claude.md)

---

## 🎯 향후 계획

### 즉시 실행 가능한 개선
1. 크롤링 자동화 배치 작업 구현
2. 프론트엔드 UI/UX 완성
3. 실제 API 연동 테스트

### 장기 개선 사항
1. ML 기반 정보 추출 (정확도 향상)
2. 분산 크롤링 (다중 서버)
3. 실시간 알림 (WebSocket)
4. 노선별 상세 영향도 분석

---

<div align="center">

**테코테코 4기 3팀** | 2025-01-27

*"버스 파업, 이제는 미리 대비한다"*

</div>