# PRD: 서울·경기권 파업 알림 서비스

## 📋 문서 정보

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 파업 알리미 (Strike Alert) |
| **팀** | Team-01 |
| **작성일** | 2026-01-27 |
| **버전** | v1.0 |

---

## 1. 개요 (Overview)

### 1.1 배경 및 문제 정의

서울·경기권에서 대중교통 파업, 의료 파업 등이 발생할 경우, 시민들은 출퇴근 및 일상생활에 큰 불편을 겪습니다. 현재 파업 정보는 여러 채널에 분산되어 있어 실시간으로 파악하기 어렵습니다.

### 1.2 목표

1. **파업 정보 통합**: 다양한 소스에서 파업 관련 정보를 수집하여 한 곳에서 확인
2. **실시간 알림**: 파업 발생 시 Slack을 통해 즉시 알림 전송
3. **사전 대비**: 예정된 파업 일정을 미리 공지하여 대체 수단 준비 가능

---

## 2. 파업 정보 소스 (Data Sources)

### 2.1 공공 API

#### 2.1.1 서울교통공사 지하철알림정보 API ⭐ (핵심)

| 항목 | 내용 |
|------|------|
| **URL** | https://www.data.go.kr/data/15144070/openapi.do |
| **제공 기관** | 서울교통공사 |
| **갱신 주기** | 1분 |
| **비용** | 무료 |
| **트래픽** | 10,000건/월 (개발계정) |

**제공 정보:**
- 열차 지연 정보
- 역 주변 시위로 인한 혼잡 안내
- 무정차 안내
- 열차시간표 변경
- 이례 상황 알림

```
# API 요청 예시
GET /api/지하철알림정보
Authorization: {서비스키}
```

#### 2.1.2 서울시 버스운행정보 API

| 항목 | 내용 |
|------|------|
| **URL** | http://api.bus.go.kr |
| **제공 기관** | 서울특별시 |
| **형식** | XML |
| **비용** | 무료 |

**제공 정보:**
- 노선 운행 정보
- 배차 간격
- 운행 여부 (파업 시 운휴 확인 가능)

#### 2.1.3 공공데이터포털 노동조합 협약정보 API

| 항목 | 내용 |
|------|------|
| **URL** | https://www.data.go.kr/data/15061198/openapi.do |
| **제공 기관** | 행정안전부 한국지역정보개발원 |
| **형식** | REST (XML) |
| **비용** | 무료 |

**제공 정보:**
- 지방공사, 공단의 노동조합 협약정보
- 산업별/지부별 단체협약
- 임금협약 정보

---

### 2.2 뉴스 크롤링 소스

#### 2.2.1 네이버 뉴스 검색 API

| 항목 | 내용 |
|------|------|
| **URL** | https://openapi.naver.com/v1/search/news |
| **검색 키워드** | "지하철 파업", "버스 파업", "의료 파업", "철도 파업" |
| **갱신 전략** | 10분 간격 폴링 |

```python
# 검색 키워드 예시
keywords = [
    "서울 지하철 파업",
    "서울 버스 파업", 
    "경기 버스 파업",
    "철도 노조 파업",
    "의료 파업 서울",
    "공공운수노조 파업"
]
```

#### 2.2.2 주요 언론사 RSS 피드

| 언론사 | RSS URL |
|--------|---------|
| 연합뉴스 | https://www.yna.co.kr/rss/society.xml |
| KBS | https://news.kbs.co.kr/rss/rss.html |
| SBS | https://news.sbs.co.kr/rss/ |

---

### 2.3 노동조합 공식 채널

#### 2.3.1 전국공공운수노동조합

| 항목 | 내용 |
|------|------|
| **웹사이트** | http://www.kptu.net |
| **모니터링 대상** | 공지사항, 보도자료 |
| **방식** | 웹 스크래핑 |

#### 2.3.2 서울교통공사 노동조합

| 항목 | 내용 |
|------|------|
| **웹사이트** | 서울교통공사 노조 공식 채널 |
| **모니터링 대상** | 파업 예고, 협상 진행 상황 |

#### 2.3.3 중앙노동위원회

| 항목 | 내용 |
|------|------|
| **웹사이트** | https://www.nlrc.go.kr |
| **제공 정보** | 쟁의조정 신청 현황, 조정 결과 |

---

### 2.4 정부 기관 공식 채널

| 기관 | URL | 정보 |
|------|-----|------|
| 고용노동부 | https://www.moel.go.kr | 노사 분쟁 현황 |
| 서울시 교통정보 | https://topis.seoul.go.kr | 교통 이슈 공지 |
| 국토교통부 | https://www.molit.go.kr | 철도/항공 파업 정보 |

---

## 3. Slack 알림 시스템

### 3.1 시스템 아키텍처

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│   Data Sources  │────▶│  Collector   │────▶│  Analyzer   │
│  (APIs, News)   │     │   Service    │     │   Service   │
└─────────────────┘     └──────────────┘     └──────┬──────┘
                                                     │
                                                     ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│     Slack       │◀────│  Notifier    │◀────│  Database   │
│   Workspace     │     │   Service    │     │  (Storage)  │
└─────────────────┘     └──────────────┘     └─────────────┘
```

### 3.2 Slack Webhook 설정

#### Step 1: Slack App 생성
1. https://api.slack.com/apps 접속
2. "Create New App" 클릭
3. "From scratch" 선택
4. App 이름: `파업알리미` 입력

#### Step 2: Incoming Webhook 활성화
1. 좌측 메뉴에서 "Incoming Webhooks" 선택
2. "Activate Incoming Webhooks" 토글 ON
3. "Add New Webhook to Workspace" 클릭
4. 알림 받을 채널 선택 (예: `#파업-알림`)

#### Step 3: Webhook URL 저장
```
YOUR_SLACK_WEBHOOK_URL_HERE
(형식: https://hooks.slack.com/services/TXXXXX/BXXXXX/XXXXXX)
```

### 3.3 알림 메시지 포맷

#### 3.3.1 파업 예고 알림

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚨 파업 예고 알림",
        "emoji": true
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*대상:*\n서울 지하철 1~8호선"
        },
        {
          "type": "mrkdwn",
          "text": "*예정일:*\n2026-02-01 (토)"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*상세 내용:*\n서울교통공사 노조가 임금 협상 결렬로 2월 1일 전면 파업을 예고했습니다."
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "📰 출처: 연합뉴스 | ⏰ 수집 시간: 2026-01-27 14:30"
        }
      ]
    }
  ]
}
```

#### 3.3.2 파업 진행 중 알림

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "⚠️ 파업 진행 중",
        "emoji": true
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*현황:*\n지하철 2호선 운행 중단"
        },
        {
          "type": "mrkdwn",
          "text": "*영향:*\n배차 간격 2배 증가"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*대체 교통:*\n• 간선버스 이용 권장\n• 따릉이 무료 개방 중"
      }
    }
  ]
}
```

### 3.4 알림 발송 코드 예시

```python
import requests
import json
from datetime import datetime

SLACK_WEBHOOK_URL = "YOUR_SLACK_WEBHOOK_URL_HERE"

def send_strike_alert(strike_info: dict):
    """파업 알림을 Slack으로 전송"""
    
    message = {
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"🚨 {strike_info['type']} 알림",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": f"*대상:*\n{strike_info['target']}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*일시:*\n{strike_info['date']}"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*상세 내용:*\n{strike_info['description']}"
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"📰 출처: {strike_info['source']} | ⏰ {datetime.now().strftime('%Y-%m-%d %H:%M')}"
                    }
                ]
            }
        ]
    }
    
    response = requests.post(
        SLACK_WEBHOOK_URL,
        data=json.dumps(message),
        headers={"Content-Type": "application/json"}
    )
    
    return response.status_code == 200


# 사용 예시
if __name__ == "__main__":
    strike_info = {
        "type": "파업 예고",
        "target": "서울 지하철 1~8호선",
        "date": "2026-02-01 (토)",
        "description": "서울교통공사 노조가 임금 협상 결렬로 전면 파업을 예고했습니다.",
        "source": "연합뉴스"
    }
    
    send_strike_alert(strike_info)
```

---

## 4. 기능 요구사항 (Functional Requirements)

### 4.1 MVP (Minimum Viable Product)

| 우선순위 | 기능 | 설명 |
|---------|------|------|
| P0 | 뉴스 모니터링 | 네이버 뉴스 API로 파업 관련 기사 수집 |
| P0 | Slack 알림 | 파업 감지 시 Slack으로 즉시 알림 |
| P1 | 지하철 API 연동 | 서울교통공사 알림정보 API 연동 |
| P1 | 중복 알림 방지 | 동일 내용 중복 발송 차단 |
| P2 | 알림 스케줄링 | 정해진 시간에만 알림 (업무시간 등) |

### 4.2 향후 확장 기능

- 카카오톡 알림 연동
- 웹 대시보드
- 파업 캘린더
- 대체 교통 자동 추천

---

## 5. 기술 스택 제안

| 구분 | 기술 | 선정 이유 |
|------|------|----------|
| **언어** | Python 3.11+ | 크롤링/API 연동에 최적화 |
| **스케줄러** | APScheduler / Cron | 주기적 데이터 수집 |
| **HTTP** | requests / httpx | API 호출 |
| **파싱** | BeautifulSoup4 | 웹 스크래핑 |
| **DB** | SQLite / PostgreSQL | 알림 이력 관리 |
| **배포** | AWS Lambda / Heroku | 서버리스 운영 |

---

## 6. 일정 (Timeline)

| 단계 | 내용 | 예상 기간 |
|------|------|----------|
| Phase 1 | 뉴스 크롤링 + Slack 알림 MVP | 1주 |
| Phase 2 | 공공 API 연동 | 1주 |
| Phase 3 | 중복 방지 + 안정화 | 1주 |
| Phase 4 | 추가 기능 확장 | 지속 |

---

## 7. 참고 자료

### 7.1 API 문서
- [공공데이터포털](https://www.data.go.kr/)
- [서울교통공사 지하철알림정보](https://www.data.go.kr/data/15144070/openapi.do)
- [서울시 버스운행정보](http://api.bus.go.kr)
- [네이버 검색 API](https://developers.naver.com/docs/serviceapi/search/news/news.md)
- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)

### 7.2 관련 사이트
- [고용노동부](https://www.moel.go.kr)
- [중앙노동위원회](https://www.nlrc.go.kr)
- [서울시 교통정보](https://topis.seoul.go.kr)

---

## 8. 부록

### 8.1 환경 변수 설정

```bash
# .env 파일
SLACK_WEBHOOK_URL=YOUR_SLACK_WEBHOOK_URL_HERE
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
DATA_GO_KR_API_KEY=your_api_key
```

### 8.2 프로젝트 구조 (제안)

```
strike-alert/
├── README.md
├── requirements.txt
├── .env.example
├── src/
│   ├── __init__.py
│   ├── collector/
│   │   ├── news_collector.py
│   │   ├── api_collector.py
│   │   └── scraper.py
│   ├── analyzer/
│   │   └── strike_detector.py
│   ├── notifier/
│   │   └── slack_notifier.py
│   └── main.py
├── tests/
│   └── test_notifier.py
└── data/
    └── strike_history.db
```
