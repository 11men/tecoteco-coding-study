# 크롤링 시스템 API 명세

## 개요

이 문서는 버스 파업 크롤링 시스템의 API 명세를 정의합니다.

### API 종류

1. **Internal Crawler API**: 크롤러가 수집한 데이터를 백엔드로 전송하는 내부 API
2. **Admin API**: 크롤링 시스템을 관리하고 모니터링하는 관리자 API

## Base URL

```
Development:
  - Internal: http://localhost:3000/api/internal/crawler
  - Admin: http://localhost:3000/api/admin/crawling

Production:
  - Internal: https://api.busstrike.com/api/internal/crawler
  - Admin: https://api.busstrike.com/api/admin/crawling
```

## 인증

### Internal Crawler API
크롤러 전용 API Key 인증:
```http
X-Crawler-Api-Key: {crawler_api_key}
```

### Admin API
JWT 토큰 기반 인증:
```http
Authorization: Bearer {access_token}
```

---

# Part 1: Internal Crawler API

크롤러가 수집한 데이터를 백엔드로 전송하는 내부 API입니다.

## 1. 크롤링 결과 제출

### 1.1 공지사항 일괄 제출

```http
POST /api/internal/crawler/notices/batch
```

**Headers**
```http
X-Crawler-Api-Key: {api_key}
Content-Type: application/json
```

**Request Body**
```json
{
  "crawlJobId": "job_20260127_103000_topis",
  "sourceId": "topis",
  "sourceName": "TOPIS",
  "sourceUrl": "https://topis.seoul.go.kr/notice/openNoticeList.do",
  "crawledAt": "2026-01-27T10:30:00+09:00",
  "durationMs": 3500,
  "notices": [
    {
      "externalId": "topis_12345",
      "title": "서울 시내버스 파업 예고 안내",
      "content": "오는 1월 30일 오전 4시부터 서울 시내버스가 파업에 들어갑니다...",
      "url": "https://topis.seoul.go.kr/notice/view.do?id=12345",
      "category": "버스안내",
      "publishedAt": "2026-01-27T09:00:00+09:00",
      "views": 1523,
      "hasAttachment": false,
      "contentHash": "sha256:a1b2c3d4e5f6...",
      "metadata": {
        "author": "교통정보담당",
        "department": "서울시 교통정보과"
      },
      "strikeInfo": {
        "isStrike": true,
        "title": "서울 시내버스 파업 예고 안내",
        "regions": ["seoul"],
        "busTypes": ["city"],
        "strikeDate": "2026-01-30",
        "strikeTime": "04:00:00",
        "status": "scheduled",
        "extractedKeywords": ["파업", "시내버스", "서울"]
      }
    },
    {
      "externalId": "topis_12346",
      "title": "버스 운행 안내",
      "content": "정상 운행 안내입니다...",
      "url": "https://topis.seoul.go.kr/notice/view.do?id=12346",
      "category": "일반공지",
      "publishedAt": "2026-01-27T08:00:00+09:00",
      "views": 523,
      "hasAttachment": false,
      "contentHash": "sha256:b2c3d4e5f6g7...",
      "strikeInfo": {
        "isStrike": false
      }
    }
  ],
  "stats": {
    "totalNotices": 20,
    "strikeRelated": 1,
    "newNotices": 2,
    "updatedNotices": 0
  }
}
```

**Response 200** - 성공
```json
{
  "success": true,
  "crawlJobId": "job_20260127_103000_topis",
  "result": {
    "received": 2,
    "created": 1,
    "updated": 0,
    "duplicates": 1,
    "strikeEventsCreated": 1,
    "strikeEventsUpdated": 0,
    "notificationsSent": 1
  },
  "processedNotices": [
    {
      "externalId": "topis_12345",
      "internalId": "notice_001",
      "status": "created",
      "strikeEventId": "strike_001",
      "notificationSent": true
    },
    {
      "externalId": "topis_12346",
      "internalId": "notice_002",
      "status": "duplicate",
      "strikeEventId": null,
      "notificationSent": false
    }
  ],
  "processingTime": 156
}
```

**Response 400** - 검증 실패
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      {
        "field": "notices[0].publishedAt",
        "message": "Invalid date format"
      }
    ]
  }
}
```

**Response 401** - 인증 실패
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

---

### 1.2 파업 정보 업데이트 제출

```http
POST /api/internal/crawler/strikes/update
```

**Headers**
```http
X-Crawler-Api-Key: {api_key}
Content-Type: application/json
```

**Request Body**
```json
{
  "crawlJobId": "job_20260127_110000_topis",
  "sourceId": "topis",
  "crawledAt": "2026-01-27T11:00:00+09:00",
  "updates": [
    {
      "externalId": "topis_12345",
      "originalNoticeId": "notice_001",
      "strikeEventId": "strike_001",
      "changes": {
        "status": {
          "old": "scheduled",
          "new": "cancelled"
        },
        "strikeTime": {
          "old": "04:00:00",
          "new": null
        }
      },
      "updatedStrikeInfo": {
        "isStrike": true,
        "title": "서울 시내버스 파업 중단 안내",
        "regions": ["seoul"],
        "busTypes": ["city"],
        "strikeDate": null,
        "strikeTime": null,
        "status": "cancelled"
      },
      "reason": "파업 중단 공지 확인"
    }
  ]
}
```

**Response 200**
```json
{
  "success": true,
  "crawlJobId": "job_20260127_110000_topis",
  "result": {
    "received": 1,
    "updated": 1,
    "failed": 0,
    "notificationsSent": 1
  },
  "processedUpdates": [
    {
      "externalId": "topis_12345",
      "strikeEventId": "strike_001",
      "status": "updated",
      "changesDetected": ["status", "strikeTime"],
      "notificationSent": true
    }
  ]
}
```

---

### 1.3 크롤링 작업 시작 알림

```http
POST /api/internal/crawler/jobs/start
```

**Request Body**
```json
{
  "crawlJobId": "job_20260127_103000_topis",
  "sourceId": "topis",
  "startedAt": "2026-01-27T10:30:00+09:00",
  "scheduledBy": "cron",
  "metadata": {
    "version": "1.0.0",
    "crawler": "playwright"
  }
}
```

**Response 200**
```json
{
  "success": true,
  "crawlJobId": "job_20260127_103000_topis",
  "message": "Crawl job registered"
}
```

---

### 1.4 크롤링 작업 완료 알림

```http
POST /api/internal/crawler/jobs/complete
```

**Request Body**
```json
{
  "crawlJobId": "job_20260127_103000_topis",
  "sourceId": "topis",
  "completedAt": "2026-01-27T10:30:35+09:00",
  "status": "success",
  "durationMs": 3500,
  "stats": {
    "totalNotices": 20,
    "strikeRelated": 1,
    "newNotices": 2,
    "errors": 0
  }
}
```

**Response 200**
```json
{
  "success": true,
  "crawlJobId": "job_20260127_103000_topis",
  "message": "Crawl job completed"
}
```

---

### 1.5 크롤링 작업 실패 알림

```http
POST /api/internal/crawler/jobs/fail
```

**Request Body**
```json
{
  "crawlJobId": "job_20260127_103000_topis",
  "sourceId": "topis",
  "failedAt": "2026-01-27T10:30:15+09:00",
  "errorType": "TIMEOUT",
  "errorMessage": "Page load timeout after 30 seconds",
  "errorStack": "Error: Timeout\n  at ...",
  "metadata": {
    "url": "https://topis.seoul.go.kr/notice/openNoticeList.do",
    "retryCount": 3
  }
}
```

**Response 200**
```json
{
  "success": true,
  "crawlJobId": "job_20260127_103000_topis",
  "message": "Failure recorded",
  "shouldRetry": false,
  "retryAfter": null
}
```

---

## 2. 데이터 구조 타입 정의

### Notice (공지사항)

```typescript
interface NoticeSubmission {
  externalId: string;          // 외부 소스의 고유 ID
  title: string;                // 제목
  content: string;              // 본문 내용
  url: string;                  // 원본 URL
  category?: string;            // 카테고리
  publishedAt: string;          // 발표일시 (ISO 8601)
  views?: number;               // 조회수
  hasAttachment: boolean;       // 첨부파일 여부
  contentHash: string;          // 내용 해시 (중복 체크용)
  metadata?: Record<string, any>; // 추가 메타데이터
  strikeInfo: StrikeInfo;       // 파업 정보 추출 결과
}
```

### StrikeInfo (파업 정보)

```typescript
interface StrikeInfo {
  isStrike: boolean;            // 파업 관련 여부
  title?: string;               // 파업 제목
  regions?: string[];           // 지역 ['seoul', 'gyeonggi', 'incheon']
  busTypes?: string[];          // 버스 타입 ['city', 'intercity']
  strikeDate?: string;          // 파업 날짜 (YYYY-MM-DD)
  strikeTime?: string;          // 파업 시간 (HH:mm:ss)
  status?: 'scheduled' | 'ongoing' | 'cancelled' | 'ended';
  extractedKeywords?: string[]; // 추출된 키워드
}
```

### CrawlJobStats (크롤링 작업 통계)

```typescript
interface CrawlJobStats {
  totalNotices: number;         // 전체 공지사항 수
  strikeRelated: number;        // 파업 관련 공지 수
  newNotices: number;           // 신규 공지 수
  updatedNotices?: number;      // 업데이트된 공지 수
  errors?: number;              // 오류 수
}
```

---

# Part 2: Admin API

크롤링 시스템을 관리하고 모니터링하기 위한 관리자 API입니다.

---

## 1. 크롤러 관리

### 1.1 크롤러 목록 조회

```http
GET /sources
```

**Response 200**
```json
{
  "sources": [
    {
      "id": "topis",
      "name": "TOPIS",
      "url": "https://topis.seoul.go.kr/notice/openNoticeList.do",
      "type": "official",
      "priority": 1,
      "intervalMinutes": 10,
      "isActive": true,
      "lastCrawledAt": "2026-01-13T10:00:00+09:00",
      "status": {
        "lastStatus": "success",
        "itemsFound": 15,
        "lastDuration": 3500,
        "errorCount": 0
      }
    },
    {
      "id": "gbis",
      "name": "GBIS",
      "url": "https://www.gbis.go.kr/gbis2014/bbs.action?cmd=notice",
      "type": "official",
      "priority": 1,
      "intervalMinutes": 10,
      "isActive": true,
      "lastCrawledAt": "2026-01-13T10:05:00+09:00",
      "status": {
        "lastStatus": "success",
        "itemsFound": 8,
        "lastDuration": 4200,
        "errorCount": 0
      }
    }
  ]
}
```

---

### 1.2 크롤러 상세 조회

```http
GET /sources/{sourceId}
```

**Response 200**
```json
{
  "id": "topis",
  "name": "TOPIS",
  "url": "https://topis.seoul.go.kr/notice/openNoticeList.do",
  "type": "official",
  "priority": 1,
  "intervalMinutes": 10,
  "isActive": true,
  "lastCrawledAt": "2026-01-13T10:00:00+09:00",
  "createdAt": "2026-01-01T00:00:00+09:00",
  "stats": {
    "totalCrawls": 1440,
    "successRate": 99.3,
    "avgDuration": 3200,
    "totalItemsFound": 21600,
    "last24hCrawls": 144,
    "last24hItems": 2160
  }
}
```

---

### 1.3 크롤러 설정 변경

```http
PUT /sources/{sourceId}
```

**Request**
```json
{
  "intervalMinutes": 15,
  "isActive": true
}
```

**Response 200**
```json
{
  "id": "topis",
  "name": "TOPIS",
  "intervalMinutes": 15,
  "isActive": true,
  "updatedAt": "2026-01-13T10:30:00+09:00"
}
```

---

### 1.4 크롤러 수동 실행

```http
POST /sources/{sourceId}/trigger
```

**Response 200**
```json
{
  "message": "Crawling started",
  "jobId": "job_12345",
  "estimatedDuration": 5000
}
```

**Response 409** (이미 실행 중)
```json
{
  "error": "Crawler is already running",
  "currentJobId": "job_12344"
}
```

---

## 2. 크롤링 로그

### 2.1 크롤링 로그 조회

```http
GET /logs?sourceId={sourceId}&status={status}&limit={limit}&offset={offset}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| sourceId | string | N | 소스 ID 필터 |
| status | string | N | 상태 필터 (success, failed, partial) |
| limit | number | N | 결과 개수 (기본: 50) |
| offset | number | N | 페이지 오프셋 (기본: 0) |

**Response 200**
```json
{
  "total": 1440,
  "limit": 50,
  "offset": 0,
  "logs": [
    {
      "id": "log_12345",
      "sourceId": "topis",
      "sourceName": "TOPIS",
      "status": "success",
      "itemsFound": 15,
      "itemsProcessed": 3,
      "duration": 3500,
      "crawledAt": "2026-01-13T10:00:00+09:00"
    },
    {
      "id": "log_12346",
      "sourceId": "gbis",
      "sourceName": "GBIS",
      "status": "failed",
      "itemsFound": 0,
      "itemsProcessed": 0,
      "duration": 15000,
      "errorMessage": "Timeout after 15s",
      "crawledAt": "2026-01-13T09:50:00+09:00"
    }
  ]
}
```

---

### 2.2 크롤링 로그 상세

```http
GET /logs/{logId}
```

**Response 200**
```json
{
  "id": "log_12345",
  "sourceId": "topis",
  "sourceName": "TOPIS",
  "status": "success",
  "itemsFound": 15,
  "itemsProcessed": 3,
  "duration": 3500,
  "errorMessage": null,
  "crawledAt": "2026-01-13T10:00:00+09:00",
  "notices": [
    {
      "id": "notice_12345",
      "title": "버스 운행 안내",
      "publishedAt": "2026-01-13T09:00:00+09:00",
      "isStrikeRelated": false
    },
    {
      "id": "notice_12346",
      "title": "서울 시내버스 파업 예정 안내",
      "publishedAt": "2026-01-13T08:00:00+09:00",
      "isStrikeRelated": true,
      "strikeEventId": "strike_001"
    }
  ]
}
```

---

## 3. 원본 공지사항

### 3.1 공지사항 목록 조회

```http
GET /notices?sourceId={sourceId}&keyword={keyword}&startDate={startDate}&endDate={endDate}&limit={limit}&offset={offset}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| sourceId | string | N | 소스 ID |
| keyword | string | N | 검색 키워드 |
| startDate | string | N | 시작일 (ISO 8601) |
| endDate | string | N | 종료일 (ISO 8601) |
| limit | number | N | 결과 개수 (기본: 20) |
| offset | number | N | 페이지 오프셋 (기본: 0) |

**Response 200**
```json
{
  "total": 256,
  "limit": 20,
  "offset": 0,
  "notices": [
    {
      "id": "notice_12345",
      "sourceId": "topis",
      "sourceName": "TOPIS",
      "title": "서울 시내버스 파업 예정 안내",
      "url": "https://topis.seoul.go.kr/notice/view.do?id=12345",
      "category": "버스안내",
      "publishedAt": "2026-01-13T08:00:00+09:00",
      "views": 1234,
      "hasAttachment": true,
      "strikeEventId": "strike_001",
      "crawledAt": "2026-01-13T10:00:00+09:00"
    }
  ]
}
```

---

### 3.2 공지사항 상세 조회

```http
GET /notices/{noticeId}
```

**Response 200**
```json
{
  "id": "notice_12345",
  "sourceId": "topis",
  "sourceName": "TOPIS",
  "title": "서울 시내버스 파업 예정 안내",
  "content": "오는 1월 15일 오전 4시부터 서울 시내버스 390개 노선이 파업에 들어갑니다...",
  "url": "https://topis.seoul.go.kr/notice/view.do?id=12345",
  "category": "버스안내",
  "publishedAt": "2026-01-13T08:00:00+09:00",
  "views": 1234,
  "hasAttachment": true,
  "contentHash": "a1b2c3d4e5f6",
  "metadata": {
    "author": "교통정보담당",
    "attachments": [
      {
        "name": "파업노선목록.xlsx",
        "size": 102400
      }
    ]
  },
  "strikeEvent": {
    "id": "strike_001",
    "title": "서울 시내버스 파업",
    "status": "confirmed"
  },
  "crawledAt": "2026-01-13T10:00:00+09:00"
}
```

---

## 4. 파업 이벤트 관리

### 4.1 파업 이벤트 목록

```http
GET /strikes?status={status}&region={region}&limit={limit}&offset={offset}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| status | string | N | pending, confirmed, ongoing, ended |
| region | string | N | seoul, gyeonggi, incheon |
| limit | number | N | 결과 개수 (기본: 20) |
| offset | number | N | 페이지 오프셋 (기본: 0) |

**Response 200**
```json
{
  "total": 5,
  "limit": 20,
  "offset": 0,
  "strikes": [
    {
      "id": "strike_001",
      "title": "서울 시내버스 파업",
      "status": "confirmed",
      "startDate": "2026-01-15T04:00:00+09:00",
      "endDate": null,
      "affectedRegions": ["seoul"],
      "affectedRouteCount": 390,
      "source": "TOPIS",
      "confidenceScore": 0.95,
      "detectedAt": "2026-01-13T10:00:00+09:00",
      "confirmedAt": "2026-01-13T10:30:00+09:00"
    }
  ]
}
```

---

### 4.2 파업 이벤트 상세

```http
GET /strikes/{strikeId}
```

**Response 200**
```json
{
  "id": "strike_001",
  "rawNoticeId": "notice_12345",
  "title": "서울 시내버스 파업",
  "description": "서울 시내버스 노동조합의 임금 인상 요구가 받아들여지지 않아 파업이 결정되었습니다.",
  "status": "confirmed",
  "startDate": "2026-01-15T04:00:00+09:00",
  "endDate": null,
  "affectedRegions": ["seoul"],
  "affectedCompanies": ["서울승합", "대원교통", "삼화운수"],
  "affectedRouteCount": 390,
  "source": "TOPIS",
  "sourceUrl": "https://topis.seoul.go.kr/notice/view.do?id=12345",
  "confidenceScore": 0.95,
  "detectedAt": "2026-01-13T10:00:00+09:00",
  "confirmedAt": "2026-01-13T10:30:00+09:00",
  "affectedRoutes": [
    {
      "routeId": "100",
      "routeName": "100번",
      "status": "suspended"
    },
    {
      "routeId": "143",
      "routeName": "143번",
      "status": "suspended"
    }
  ],
  "rawNotice": {
    "title": "서울 시내버스 파업 예정 안내",
    "url": "https://topis.seoul.go.kr/notice/view.do?id=12345",
    "publishedAt": "2026-01-13T08:00:00+09:00"
  }
}
```

---

### 4.3 파업 이벤트 상태 변경

```http
PUT /strikes/{strikeId}/status
```

**Request**
```json
{
  "status": "confirmed",
  "startDate": "2026-01-15T04:00:00+09:00",
  "endDate": null,
  "affectedRoutes": ["100", "143", "240"]
}
```

**Response 200**
```json
{
  "id": "strike_001",
  "status": "confirmed",
  "startDate": "2026-01-15T04:00:00+09:00",
  "updatedAt": "2026-01-13T10:30:00+09:00"
}
```

---

### 4.4 파업 이벤트 삭제 (오탐)

```http
DELETE /strikes/{strikeId}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| reason | string | Y | 삭제 사유 |

**Response 200**
```json
{
  "message": "Strike event deleted",
  "strikeId": "strike_001",
  "reason": "False positive - not a strike"
}
```

---

## 5. 통계 및 대시보드

### 5.1 크롤링 통계

```http
GET /stats/crawling?period={period}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| period | string | N | 1h, 24h, 7d, 30d (기본: 24h) |

**Response 200**
```json
{
  "period": "24h",
  "summary": {
    "totalCrawls": 288,
    "successfulCrawls": 286,
    "failedCrawls": 2,
    "successRate": 99.3,
    "avgDuration": 3200,
    "totalItemsFound": 4320,
    "strikeEventsDetected": 2
  },
  "bySources": [
    {
      "sourceId": "topis",
      "sourceName": "TOPIS",
      "crawls": 144,
      "successRate": 100,
      "avgDuration": 3500,
      "itemsFound": 2160
    },
    {
      "sourceId": "gbis",
      "sourceName": "GBIS",
      "crawls": 144,
      "successRate": 98.6,
      "avgDuration": 4200,
      "itemsFound": 2160
    }
  ],
  "timeline": [
    {
      "timestamp": "2026-01-13T10:00:00+09:00",
      "crawls": 12,
      "itemsFound": 180,
      "avgDuration": 3200
    }
  ]
}
```

---

### 5.2 파업 탐지 통계

```http
GET /stats/strikes?period={period}
```

**Response 200**
```json
{
  "period": "30d",
  "summary": {
    "totalDetected": 12,
    "confirmed": 8,
    "falsePositives": 4,
    "accuracy": 66.7,
    "avgConfidenceScore": 0.85
  },
  "bySource": [
    {
      "source": "TOPIS",
      "detected": 5,
      "confirmed": 4
    },
    {
      "source": "GBIS",
      "detected": 4,
      "confirmed": 3
    },
    {
      "source": "News",
      "detected": 3,
      "confirmed": 1
    }
  ],
  "byRegion": [
    {
      "region": "seoul",
      "events": 6
    },
    {
      "region": "gyeonggi",
      "events": 2
    }
  ]
}
```

---

## 6. 시스템 상태

### 6.1 헬스체크

```http
GET /health
```

**Response 200**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-13T10:00:00+09:00",
  "services": {
    "database": {
      "status": "up",
      "responseTime": 5
    },
    "redis": {
      "status": "up",
      "responseTime": 2
    },
    "crawlers": {
      "active": 0,
      "scheduled": 4
    }
  }
}
```

---

### 6.2 시스템 메트릭

```http
GET /metrics
```

**Response 200**
```json
{
  "uptime": 864000,
  "memory": {
    "used": 512,
    "total": 2048,
    "percentage": 25
  },
  "cpu": {
    "usage": 15.5
  },
  "database": {
    "connections": {
      "active": 5,
      "idle": 15,
      "total": 20
    },
    "queries": {
      "total": 125000,
      "avgDuration": 12
    }
  },
  "redis": {
    "connections": 10,
    "memoryUsed": 128,
    "keys": 15000
  }
}
```

---

## 에러 응답

### 공통 에러 형식

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### 에러 코드

| 코드 | 상태 | 설명 |
|------|------|------|
| UNAUTHORIZED | 401 | 인증 실패 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| CONFLICT | 409 | 중복 또는 충돌 |
| VALIDATION_ERROR | 400 | 입력값 검증 실패 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## Rate Limiting

Admin API는 IP당 다음과 같은 제한이 있습니다:

- **조회 API**: 100 requests / minute
- **수정 API**: 30 requests / minute
- **크롤러 수동 실행**: 10 requests / minute

Rate limit 초과 시:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

**Response Headers**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705123200
```
