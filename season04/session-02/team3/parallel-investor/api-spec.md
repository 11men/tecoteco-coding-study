# Parallel Investor - API 정의서 v1.0

> 프론트엔드 팀이 백엔드 팀에 요청하는 API 명세입니다.
> Base URL: `/api`

---

## 1. 종목 (Tickers)

### `GET /api/tickers/search`
종목 검색 (자동완성)

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| q | string | Yes | 검색어 (종목명 또는 심볼) |
| category | string | No | 필터: `stock`, `coin`, `etf` |
| limit | number | No | 최대 결과 수 (기본 10) |

**Response 200**
```json
{
  "tickers": [
    {
      "symbol": "BTC",
      "name": "비트코인",
      "currentPrice": 58320000,
      "changePercent": 3.2,
      "category": "coin"
    }
  ]
}
```

---

## 2. 패턴 분석 (Pattern Analysis) - Feature A

### `POST /api/pattern/analyze`
현재 차트 패턴 기반 과거 유사 패턴 매칭 실행

**Request Body**
```json
{
  "symbol": "BTC",
  "capturedAt": "2025-02-10T09:30:00Z"
}
```

**Response 200**
```json
{
  "ticker": {
    "symbol": "BTC",
    "name": "비트코인",
    "currentPrice": 58320000,
    "changePercent": 3.2,
    "category": "coin"
  },
  "capturedAt": "2025-02-10T09:30:00Z",
  "matches": [
    {
      "id": "pm-1",
      "matchDate": "2021-11-10",
      "similarity": 92,
      "priceAtMatch": 67000000,
      "resultAfter7Days": -12.5,
      "resultAfter30Days": -25.3,
      "resultAfter90Days": -40.1,
      "indicators": {
        "movingAverage": 65000000,
        "rsi": 78,
        "volume": 1500000
      }
    }
  ],
  "buyScenario": {
    "avgReturn7d": -5.2,
    "avgReturn30d": -17.4,
    "lossRate": 67
  },
  "waitScenario": {
    "avgReturn7d": 1.8,
    "avgReturn30d": 8.5,
    "gainRate": 72,
    "optimalEntryDays": 15
  }
}
```

**Error 400** - 유효하지 않은 종목
```json
{ "error": "INVALID_SYMBOL", "message": "존재하지 않는 종목입니다." }
```

---

## 3. 참음 기록 (Shadow Record) - Feature B

### `POST /api/shadow-record`
새 FOMO 참음 기록 생성

**Request Body**
```json
{
  "symbol": "BTC",
  "intendedAmount": 2000000,
  "fomoIntensity": 4,
  "memo": "친구가 지금 안 사면 후회한다고 해서..."
}
```

**Response 201**
```json
{
  "id": "sr-4",
  "ticker": {
    "symbol": "BTC",
    "name": "비트코인",
    "currentPrice": 58320000,
    "changePercent": 3.2,
    "category": "coin"
  },
  "priceAtRecord": 58320000,
  "intendedAmount": 2000000,
  "fomoIntensity": 4,
  "memo": "친구가 지금 안 사면 후회한다고 해서...",
  "createdAt": "2025-02-10T09:30:00Z",
  "result": null
}
```

**Validation**
- `symbol`: 필수, 유효한 종목
- `intendedAmount`: 필수, 양수
- `fomoIntensity`: 필수, 1~5 정수
- `memo`: 선택, 최대 500자

---

### `GET /api/shadow-record`
참음 기록 목록 조회

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| page | number | No | 페이지 (기본 1) |
| limit | number | No | 페이지당 개수 (기본 20) |
| status | string | No | `pending` / `success` / `failed` |
| sort | string | No | `latest` (기본) / `amount` / `fomo` |

**Response 200**
```json
{
  "records": [
    {
      "id": "sr-1",
      "ticker": { "symbol": "BTC", "name": "비트코인", "currentPrice": 58320000, "changePercent": 3.2, "category": "coin" },
      "priceAtRecord": 61500000,
      "intendedAmount": 2000000,
      "fomoIntensity": 4,
      "memo": "친구가 지금 안 사면 후회한다고 해서...",
      "createdAt": "2025-01-15T09:30:00Z",
      "result": {
        "currentPrice": 58320000,
        "changePercent": -5.2,
        "defendedAmount": 103000,
        "checkedAt": "2025-01-22T09:30:00Z",
        "isDefenseSuccess": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### `GET /api/shadow-record/:id`
특정 참음 기록 상세 조회

**Response 200** - 단일 ShadowRecord 객체 (위와 동일 구조)

---

## 4. JOMO 계산 (JOMO Calculator) - Feature C

### `GET /api/jomo/summary`
총 방어 금액 및 실물 환산 서머리

**Response 200**
```json
{
  "totalDefendedAmount": 345000,
  "totalRecords": 8,
  "defenseSuccessRate": 75,
  "conversions": [
    { "name": "치킨", "emoji": "🍗", "unitPrice": 20000, "quantity": 17 },
    { "name": "스타벅스 커피", "emoji": "☕", "unitPrice": 6000, "quantity": 57 },
    { "name": "넷플릭스 1개월", "emoji": "🎬", "unitPrice": 13500, "quantity": 25 }
  ],
  "monthlyTrend": [
    { "month": "2025-01", "defendedAmount": 103000 },
    { "month": "2025-02", "defendedAmount": 242000 }
  ]
}
```

---

## 5. 사용자 레벨 & 뱃지 (Leveling) - Feature D

### `GET /api/user/level`
현재 사용자 레벨 정보

**Response 200**
```json
{
  "level": 7,
  "title": "철벽",
  "titleEn": "Iron Wall",
  "currentExp": 180,
  "nextLevelExp": 300,
  "totalDefenseCount": 8,
  "consecutiveDays": 12,
  "nextTier": {
    "level": 10,
    "title": "돌부처",
    "titleEn": "Stone Buddha",
    "requiredExp": 300
  }
}
```

---

### `GET /api/user/badges`
사용자 뱃지 컬렉션

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| filter | string | No | `earned` / `unearned` / `all` (기본 `all`) |

**Response 200**
```json
{
  "badges": [
    {
      "id": "b-1",
      "name": "첫 참음",
      "description": "첫 번째 FOMO를 기록하고 참았습니다",
      "icon": "🛡️",
      "condition": "첫 FOMO 기록",
      "earnedAt": "2025-01-15T09:30:00Z",
      "isEarned": true
    },
    {
      "id": "b-3",
      "name": "빙쇼트",
      "description": "대세 상승장에서 추격매수 없이 버팀",
      "icon": "🧊",
      "condition": "상승장 버팀",
      "earnedAt": null,
      "isEarned": false
    }
  ],
  "earnedCount": 2,
  "totalCount": 4
}
```

---

## 6. 공통 에러 응답

모든 API는 에러 시 아래 형식을 따릅니다.

```json
{
  "error": "ERROR_CODE",
  "message": "사람이 읽을 수 있는 에러 메시지"
}
```

| HTTP Status | Error Code | Description |
|-------------|-----------|-------------|
| 400 | VALIDATION_ERROR | 요청 데이터 검증 실패 |
| 400 | INVALID_SYMBOL | 존재하지 않는 종목 |
| 401 | UNAUTHORIZED | 인증 필요 |
| 404 | NOT_FOUND | 리소스 없음 |
| 429 | RATE_LIMITED | 요청 제한 초과 |
| 500 | INTERNAL_ERROR | 서버 내부 오류 |

---

## 7. 데이터 타입 요약

| Type | 설명 | 사용처 |
|------|------|--------|
| StockTicker | 종목 정보 (symbol, name, price, change, category) | 전체 |
| PatternMatch | 유사 패턴 결과 | Feature A |
| PatternAnalysisResult | 분석 결과 (matches + scenarios) | Feature A |
| ShadowRecord | 참음 기록 | Feature B |
| ShadowResult | 참음 결과 (price change, defended amount) | Feature B |
| JomoConversion | 실물 환산 | Feature C |
| UserLevel | 레벨 정보 | Feature D |
| Badge | 뱃지 정보 | Feature D |
