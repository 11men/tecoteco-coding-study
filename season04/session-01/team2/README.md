# 지역별 카풀 매칭 서버

> Redis 기반 지역별 매칭 서버 - 최소 N명이 모이면 즉시 매칭 생성

<div align="center">

![Tech](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)

</div>

---

## 📌 프로젝트 정보

| 항목 | 내용 |
|------|------|
| **회차** | Season 4, Session 01 (2025-01-27) |
| **팀원** | 강한규, 이연호, 표혜인 (3명) |
| **개발 기간** | 약 2시간 (기획 + 개발) |
| **해결 문제** | 파업 시 실시간 카풀 매칭 |

---

## 🎯 문제 정의

버스 파업 시 **즉시 카풀을 구할 수 있는 매칭 시스템** 필요
- 같은 지역의 사용자들을 자동으로 그룹화
- 최소 인원 충족 시 즉시 매칭 생성
- 동시 요청에도 안전한 처리

---

## 💡 핵심 기능

### 1. 지역 기반 매칭
- 지역별 대기열 관리 (`mm:q:{region}`)
- 지역별 최소 인원 설정 (minN)

### 2. 즉시 매칭
- minN명 충족 시 자동 매칭 생성
- Pub/Sub으로 실시간 알림

### 3. 동시성 안전
- **Lua 스크립트로 원자적 매칭 처리**
- 경쟁 조건(Race Condition) 방지
- 다중 서버 환경에서도 안전

### 4. Soft Cancel
- 취소 시 상태만 변경 (성능 최적화)
- Lua에서 CANCELLED 유저 자동 스킵

---

## 🏗️ 아키텍처

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

---

## 🗄️ Redis 데이터 모델

| 키 패턴 | 타입 | 설명 |
|---------|------|------|
| `mm:q:{region}` | List | 지역별 대기열 (FIFO) |
| `mm:u:{userId}` | Hash | 유저 상태 (WAITING/MATCHED/CANCELLED) |
| `mm:m:{matchId}` | Hash | 매치 정보 (멤버 목록, 지역) |
| `mm:signal` | Pub/Sub | 매칭 신호 채널 |

---

## 🚀 API 엔드포인트

### 대기열 등록
```http
POST /matchmaking/enqueue
Content-Type: application/json

{
  "userId": "user-123",
  "region": "SEOUL-01"
}
```

### 대기 취소
```http
DELETE /matchmaking/enqueue
{
  "userId": "user-123"
}
```

### 상태 조회
```http
GET /matchmaking/status?userId=user-123
```

---

## 🛠️ 기술 스택

- **Runtime**: Node.js
- **Database**: Redis 7
- **Language**: JavaScript
- **주요 기술**: Lua Script, Pub/Sub

---

## 💡 핵심 기술 포인트

### Lua 스크립트 원자화

```lua
-- tryMatch 작업을 Lua 스크립트로 원자화
1. 큐 길이 확인 (LLEN)
2. minN명 pop (CANCELLED 스킵)
3. 매치 생성 (HSET)
4. 유저 상태 업데이트
5. 결과 반환
```

**장점**
- 경쟁 조건 방지
- 다중 서버에서도 안전
- 네트워크 RTT 최소화

---

## 📂 프로젝트 구조

```
matchmaking-server/
├── src/
│   ├── services/
│   │   └── matchmaking-service.js    # 매칭 로직 (Lua 스크립트)
│   ├── routes/
│   │   └── matchmaking.js            # API 라우트
│   ├── worker.js                     # Pub/Sub 워커
│   └── server.js                     # Express 서버
├── tests/
│   └── matchmaking.test.js           # 동시성 테스트
├── docker-compose.yml
└── package.json
```

---

## 🧪 테스트 항목

- ✅ 기본 매칭 (4명 순차 등록)
- ✅ 동시 등록 (20명 동시)
- ✅ 취소 처리
- ✅ 중복 등록 방지
- ✅ 폭주 테스트 (100명 동시)

---

## 🎯 확장 고려사항

### maxN 지원
현재는 minN 고정, maxN 추가 가능 (minN ~ maxN 범위)

### 매칭 조건 확장
- 유저 속성 매칭 (레벨, 랭크)
- 가중치 기반 매칭
- 대기 시간 기반 범위 확장

### 다중 서버
- 현재 구조는 다중 서버 지원
- Lua 스크립트가 원자성 보장
- 워커도 여러 인스턴스 실행 가능

---

## 🏆 성과

- ✅ 동시성 안전한 매칭 시스템 완성
- ✅ Lua 스크립트로 원자적 처리
- ✅ 실제 동작하는 코드 + 테스트

---

## 🤔 한계점 & 배운 점

**한계점**
- UI 없음 (API만 구현)
- 실제 지도/위치 연동 부재
- 매칭 조건 단순 (지역만)

**배운 점**
- Redis를 활용한 실시간 매칭 시스템 설계
- Lua 스크립트로 동시성 문제 해결
- 경쟁 조건을 고려한 설계의 중요성

---

## 🔗 관련 문서

- [상세 README](./matchmaking-server/README.md)
- [Session 01 전체 회고](../README.md)

---

<div align="center">

**테코테코 4기 2팀** | 2025-01-27

*"파업 시 즉시 매칭되는 카풀 시스템"*

</div>