# Parallel Investor - 팀별 작업 가이드

## 프로젝트 구조 (충돌 방지 규칙)

```
src/
├── app/
│   ├── layout.tsx          ❌ 수정 금지 (공유)
│   ├── page.tsx            ❌ 수정 금지 (공유)
│   ├── globals.css         ❌ 수정 금지 (공유)
│   ├── pattern/page.tsx    ✅ Team 1 전용
│   ├── shadow-record/page.tsx ✅ Team 2 전용
│   ├── jomo/page.tsx       ✅ Team 2 전용
│   └── level/page.tsx      ✅ Team 3 전용
├── components/
│   ├── layout/             ❌ 수정 금지 (공유)
│   ├── ui/                 ❌ 수정 금지 (공유)
│   ├── pattern/            ✅ Team 1 전용
│   ├── shadow-record/      ✅ Team 2 전용
│   ├── jomo/               ✅ Team 2 전용
│   └── level/              ✅ Team 3 전용
├── lib/
│   ├── types.ts            ⚠️ 읽기만 가능 (추가 필요 시 자기 컴포넌트 폴더에 로컬 타입 생성)
│   ├── constants.ts        ⚠️ 읽기만 가능
│   ├── mock-data.ts        ⚠️ 읽기만 가능
│   └── utils.ts            ⚠️ 읽기만 가능
```

### 핵심 규칙
1. **자기 폴더만 수정** - 다른 팀 폴더 절대 수정 금지
2. **공유 파일 수정 금지** - layout, ui 컴포넌트, lib 파일은 읽기 전용
3. **새 컴포넌트는 자기 폴더에** - `src/components/{feature}/` 하위에 생성
4. **공유 컴포넌트 import는 자유** - `@/components/ui/*`, `@/lib/*` 활용

---

## Team 1: Pattern Similarity Engine (패턴 유사도 매칭)

### 담당 피처: Feature A
### 작업 파일
- `src/app/pattern/page.tsx`
- `src/components/pattern/*.tsx` (새로 생성)

### 구현 항목
1. **TickerSearch** - 종목 검색 컴포넌트 (자동완성, 실시간 가격)
2. **PatternMatchCard** - 과거 유사 패턴 결과 카드 (유사도 %, 날짜, 결과)
3. **ScenarioComparison** - "사면/참으면" 시나리오 비교 UI (카드 2장 대비)
4. **MomentCapture** - "사고 싶다" 클릭 시 현재 지표 캡처 표시 (RSI, 이동평균, 거래량)
5. **ActionGuide** - "지금 사시겠습니까? 2주 후 타점을 예약하시겠습니까?" 안내

### 사용할 mock 데이터
- `MOCK_TICKERS`, `MOCK_PATTERN_MATCHES`, `MOCK_ANALYSIS_RESULT`

### 필요 API (→ api-spec.md 참고)
- `GET /api/tickers/search`
- `POST /api/pattern/analyze`

---

## Team 2: Shadow Record + JOMO Calculator

### 담당 피처: Feature B + Feature C
### 작업 파일
- `src/app/shadow-record/page.tsx`
- `src/app/jomo/page.tsx`
- `src/components/shadow-record/*.tsx` (새로 생성)
- `src/components/jomo/*.tsx` (새로 생성)

### Feature B 구현 항목
1. **FomoRecordForm** - FOMO 기록 폼 (종목 선택, 금액, FOMO 강도 1~5, 메모)
2. **FomoIntensitySlider** - FOMO 강도 슬라이더 (이모지/텍스트 포함)
3. **ShadowRecordList** - 참음 기록 리스트 (날짜순 정렬, 결과 표시)
4. **ResultFeedback** - 결과 피드백 카드 (하락→방어성공! / 상승→위로 메시지)

### Feature C 구현 항목
5. **JomoSummary** - 총 방어 금액 서머리 (큰 숫자 + 트렌드)
6. **JomoConversionCard** - 실물 환산 카드 (치킨 N마리, 맥북 N대 등)
7. **DefenseTimeline** - 방어 히스토리 타임라인

### 사용할 mock 데이터
- `MOCK_TICKERS`, `MOCK_SHADOW_RECORDS`, `MOCK_USER`
- `JOMO_ITEMS`, `FOMO_INTENSITY_LABELS`

### 필요 API (→ api-spec.md 참고)
- `POST /api/shadow-record`
- `GET /api/shadow-record`
- `GET /api/jomo/summary`

---

## Team 3: Patience Leveling (참을성 레벨링)

### 담당 피처: Feature D
### 작업 파일
- `src/app/level/page.tsx`
- `src/components/level/*.tsx` (새로 생성)

### 구현 항목
1. **LevelProfileCard** - 현재 레벨 프로필 (칭호, 아바타, EXP 바)
2. **LevelTierProgress** - 레벨 티어 진행도 (전체 티어 맵 + 현재 위치)
3. **BadgeCollection** - 뱃지 컬렉션 그리드 (획득/미획득 구분)
4. **BadgeDetailModal** - 뱃지 상세 모달 (조건, 획득 날짜)
5. **AchievementFeed** - 최근 업적 피드 (타임라인)

### 사용할 mock 데이터
- `MOCK_USER`, `MOCK_BADGES`
- `LEVEL_TIERS`

### 필요 API (→ api-spec.md 참고)
- `GET /api/user/level`
- `GET /api/user/badges`
