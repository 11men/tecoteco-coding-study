# Matchmaking Server

Redis 기반 지역별 매칭 서버입니다. 최소 N명이 모이면 즉시 매칭이 생성됩니다.

## 주요 특징

- **지역 기반 매칭**: 지역별 대기열 관리
- **즉시 매칭**: minN명 충족 시 즉시 매칭 생성
- **동시성 안전**: Lua 스크립트로 원자적 매칭 처리
- **Soft Cancel**: 취소 시 상태만 변경하여 성능 최적화
- **이벤트 기반 워커**: Pub/Sub으로 매칭 신호 전달

## 아키텍처

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │──────│   Server    │──────│    Redis    │
└─────────────┘      └─────────────┘      └─────────────┘
                            │                    │
                            │   Lua Script       │
                            │   (atomic match)   │
                            │                    │
                     ┌──────┴──────┐             │
                     │   Worker    │◄────────────┘
                     │  (Pub/Sub)  │   SUBSCRIBE mm:signal
                     └─────────────┘
```

## Redis 데이터 모델

| 키 패턴 | 타입 | 설명 |
|---------|------|------|
| `mm:q:{region}` | List | 지역별 대기열 (FIFO) |
| `mm:u:{userId}` | Hash | 유저 상태 (WAITING/MATCHED/CANCELLED) |
| `mm:m:{matchId}` | Hash | 매치 정보 |
| `mm:signal` | Pub/Sub | 매칭 신호 채널 |

## 빠른 시작

### Docker Compose (권장)

```bash
docker-compose up -d
```

### 수동 실행

```bash
# Redis 실행
docker run -d -p 6379:6379 redis:7-alpine

# 의존성 설치
npm install

# 서버 시작
npm start
```

## API 엔드포인트

### 대기열 등록
```http
POST /matchmaking/enqueue
Content-Type: application/json

{
  "userId": "user-123",
  "region": "SEOUL-01"
}
```

**응답 (대기 중)**
```json
{
  "success": true,
  "status": "WAITING",
  "region": "SEOUL-01"
}
```

**응답 (즉시 매칭)**
```json
{
  "success": true,
  "status": "MATCHED",
  "matchId": "abc-123",
  "members": ["user-1", "user-2", "user-3", "user-123"],
  "region": "SEOUL-01"
}
```

### 대기 취소
```http
DELETE /matchmaking/enqueue
Content-Type: application/json

{
  "userId": "user-123"
}
```

### 상태 조회
```http
GET /matchmaking/status?userId=user-123
```

### 매치 정보 조회
```http
GET /matchmaking/match/{matchId}
```

### 대기열 상태 (관리용)
```http
GET /matchmaking/queue/{region}
```

## 설정

### 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `PORT` | 3000 | 서버 포트 |
| `REDIS_HOST` | localhost | Redis 호스트 |
| `REDIS_PORT` | 6379 | Redis 포트 |

### 지역별 minN 설정

`src/services/matchmaking-service.js`의 `regionConfig` 수정:

```javascript
const regionConfig = {
  'SEOUL-01': { minN: 4 },
  'SEOUL-02': { minN: 4 },
  'BUSAN-01': { minN: 3 },
  default: { minN: 4 },
};
```

## 테스트

```bash
# 서버 실행 후
npm test
```

테스트 항목:
- 기본 매칭 (4명 순차 등록)
- 동시 등록 (20명 동시)
- 취소 처리
- 중복 등록 방지
- 폭주 테스트 (100명 동시)

## 동시성 처리

### Lua 스크립트 원자화

`tryMatch` 작업을 Lua 스크립트로 원자화하여 경쟁 조건 방지:

1. 큐 길이 확인 (`LLEN`)
2. minN명 pop (CANCELLED 스킵)
3. 매치 생성 (`HSET`)
4. 유저 상태 업데이트
5. 결과 반환

### 취소와 매칭 경합

- 취소는 상태만 `CANCELLED`로 변경 (Soft Cancel)
- Lua에서 pop 후 상태 확인하여 CANCELLED는 제외
- 경합 상황에서 "취소 직전 pop"은 매칭될 수 있음 (정책적 허용)

## 확장 고려사항

### maxN 지원
현재는 minN 고정으로 매칭하지만, maxN을 추가하여 "minN 이상, maxN까지" 채우는 방식으로 확장 가능

### 다중 서버
- 현재 구조는 다중 서버에서도 동작
- Lua 스크립트가 원자적으로 실행되어 경합 없음
- 워커도 여러 인스턴스 실행 가능 (동일 region 동시 처리는 Lua가 보장)

### 매칭 조건 확장
- 유저별 속성 (레벨, 랭크 등) 매칭
- 가중치 기반 매칭
- 대기 시간 기반 매칭 범위 확장
