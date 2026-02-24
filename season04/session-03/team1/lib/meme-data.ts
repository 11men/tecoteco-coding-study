export type Platform = "TikTok" | "Instagram" | "Threads" | "X" | "YouTube" | "Community"
export type BrandSafety = "safe" | "caution" | "risky"
export type HeatLevel = "hot" | "warm" | "cooling" | "cold"
export type Generation = "GenZ" | "GenAlpha" | "Millennial" | "All"
export type Category = "all" | "expression" | "reaction" | "trend" | "slang" | "emoji" | "item" | "food" | "challenge" | "music"
export type Era = "2025" | "2024" | "2020s" | "2010s"

export interface SpreadEvent {
  date: string
  event: string
  platform: Platform | string
}

export interface MarketingGuide {
  suitableIndustries: string[]
  unsuitableIndustries: string[]
  copyExamples: string[]
  seasonTags: { season: string; fit: number }[]
  riskNote?: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface MemeEntry {
  id: string
  term: string
  definition: string
  example: string
  origin: string
  platforms: Platform[]
  brandSafety: BrandSafety
  heatLevel: HeatLevel
  generation: Generation
  category: Category
  era: Era
  relatedTerms: string[]
  doExample?: string
  dontExample?: string
  addedDate: string
  trendScore: number
  spreadTimeline?: SpreadEvent[]
  marketingGuide?: MarketingGuide
}

// Quiz data
export interface QuizSet {
  id: string
  title: string
  description: string
  era: Era
  difficulty: "easy" | "medium" | "hard"
  questions: QuizQuestion[]
}

export interface QuizGrade {
  min: number
  max: number
  title: string
  description: string
  emoji: string
}

export const quizGrades: QuizGrade[] = [
  { min: 90, max: 100, title: "트렌드 선구자", description: "밈 고고학자 수준! 당신은 트렌드의 최전선에 있습니다.", emoji: "sparkles" },
  { min: 70, max: 89, title: "MZ 인싸", description: "최신 트렌드를 잘 따라잡고 있어요. 마케터 합격!", emoji: "sunglasses" },
  { min: 50, max: 69, title: "밈 뉴비", description: "아직 공부가 필요해요. 밈 사전을 더 둘러보세요!", emoji: "thinking" },
  { min: 0, max: 49, title: "밈 문맹", description: "전 세대 고사를 추천합니다. 기초부터 다져봐요!", emoji: "dizzy" },
]

export function getGrade(score: number): QuizGrade {
  return quizGrades.find(g => score >= g.min && score <= g.max) || quizGrades[quizGrades.length - 1]
}

export const quizSets: QuizSet[] = [
  {
    id: "2025",
    title: "2025 밈고사",
    description: "최신 밈 트렌드를 얼마나 알고 있나요?",
    era: "2025",
    difficulty: "hard",
    questions: [
      {
        question: "'제곱근 하트'의 의미로 가장 적절한 것은?",
        options: ["수학 공부를 좋아한다", "평범한 하트보다 더 깊은 사랑 표현", "하트 모양 수식을 계산하는 밈", "루트 기호를 이모지로 쓰는 것"],
        correctIndex: 1,
        explanation: "루트(Root) 기호가 하트와 비슷해 사랑을 수학적으로 표현하는 밈입니다.",
      },
      {
        question: "'~하다못해'는 어떤 상황에서 사용하나요?",
        options: ["하기 싫은 일을 할 때", "어떤 행동이 극에 달했을 때의 과장 표현", "실패를 인정할 때", "포기를 선언할 때"],
        correctIndex: 1,
        explanation: "'기다리다못해 결국 직접 만들어버림' 같은 극적 서사를 만드는 밈입니다.",
      },
      {
        question: "'숏폼 브레인'이 뜻하는 것은?",
        options: ["숏폼 콘텐츠를 잘 만드는 능력", "짧은 영상에 익숙해져 긴 콘텐츠 소비가 힘든 상태", "뇌 건강에 대한 경고", "숏폼 알고리즘을 이해하는 것"],
        correctIndex: 1,
        explanation: "TikTok/릴스에 과도하게 익숙해진 상태를 자조적으로 표현한 밈입니다.",
      },
      {
        question: "'500원 갬성'의 핵심 의미는?",
        options: ["500원짜리 물건만 사는 절약법", "적은 비용으로 최대의 감성과 만족 추구", "가격 인상에 대한 불만", "복고풍 가격 마케팅"],
        correctIndex: 1,
        explanation: "가성비 감성의 극단적 표현으로, 소소하지만 확실한 행복을 의미합니다.",
      },
      {
        question: "'디깅 모먼트'의 뜻은?",
        options: ["땅을 파는 게임 밈", "좋아하는 분야에 깊이 몰입하는 순간", "삽질(실수)하는 순간", "발굴 프로그램 관련 밈"],
        correctIndex: 1,
        explanation: "Digging + Moment의 합성어로, 취미에 깊이 빠지는 순간을 의미합니다.",
      },
      {
        question: "'갈비만두'가 밈으로 쓰일 때의 뜻은?",
        options: ["맛있는 음식 추천", "전혀 관계없는 두 가지의 의외의 조합", "만두 챌린지의 별명", "갈비집 리뷰 밈"],
        correctIndex: 1,
        explanation: "예상 밖 조합이지만 의외로 잘 맞을 때 사용합니다.",
      },
      {
        question: "'뇌절'의 올바른 사용법은?",
        options: ["뇌가 피곤할 때 쓰는 말", "같은 드립을 반복해서 재미없어진 상태", "천재적인 아이디어를 떠올렸을 때", "정신이 멍할 때"],
        correctIndex: 1,
        explanation: "'뇌가 절단났다'의 줄임말로, 도를 넘은 반복을 지적할 때 씁니다.",
      },
      {
        question: "'캐릭터 소비'의 올바른 맥락은?",
        options: ["캐릭터 상품을 구매하는 것", "인물/캐릭터의 매력을 팬들이 2차 창작으로 소비하는 문화", "캐릭터 게임에 과금하는 것", "캐릭터 디자인을 도용하는 것"],
        correctIndex: 1,
        explanation: "K-pop 팬덤에서 시작, 팬들의 재해석과 2차 창작 문화를 뜻합니다.",
      },
      {
        question: "'분위기 팸'에서 '팸'의 유래는?",
        options: ["Famous의 줄임말", "Family의 줄임말 fam", "Pamphlet의 줄임말", "Platform의 줄임말"],
        correctIndex: 1,
        explanation: "힙합/스트릿 문화의 'fam'이 한국식으로 변형된 것입니다.",
      },
      {
        question: "다음 중 브랜드 마케팅에 '안전하게' 쓸 수 있는 밈은?",
        options: ["ㅋㅋ루삥뽕", "억까", "디깅 모먼트", "뇌절"],
        correctIndex: 2,
        explanation: "디깅 모먼트는 Brand Safe 등급으로, 대부분의 브랜드 커뮤니케이션에 적합합니다.",
      },
    ],
  },
  {
    id: "2024",
    title: "2024 밈고사",
    description: "2024년의 밈 트렌드를 기억하시나요?",
    era: "2024",
    difficulty: "medium",
    questions: [
      {
        question: "2024년 가장 유행한 음식 밈은?",
        options: ["마라탕후루", "로제 떡볶이", "크로플", "탕후루"],
        correctIndex: 0,
        explanation: "마라탕과 탕후루의 조합인 '마라탕후루'가 2024년 음식 밈의 정점이었습니다.",
      },
      {
        question: "'스탠리 텀블러' 열풍의 주요 플랫폼은?",
        options: ["X(트위터)", "인스타그램 & 틱톡", "유튜브", "네이버 블로그"],
        correctIndex: 1,
        explanation: "스탠리 텀블러는 인스타그램과 틱톡을 중심으로 바이럴되었습니다.",
      },
      {
        question: "'APT.'가 밈으로 확산된 주된 이유는?",
        options: ["가사가 재미있어서", "릴스/쇼츠 배경음악으로 바이럴", "뮤직비디오의 춤", "앨범 재킷 밈"],
        correctIndex: 1,
        explanation: "ROSE & Bruno Mars의 APT.는 숏폼 배경음악으로 폭발적 바이럴을 일으켰습니다.",
      },
      {
        question: "2024년 '선재 업고 튀어'에서 유래한 밈 표현은?",
        options: ["선재 런", "업고튀어 챌린지", "타임슬립 드립", "이 모든 것이 다"],
        correctIndex: 3,
        explanation: "다양한 밈이 파생되었지만, 드라마 대사와 장면의 종합적 밈화가 특징입니다.",
      },
      {
        question: "'갓생살기'의 반대 표현으로 유행한 말은?",
        options: ["똥생살기", "눕생살기", "럭셔리생활", "헬생살기"],
        correctIndex: 1,
        explanation: "'눕생살기'는 갓생의 반대 개념으로, 의도적으로 쉬며 사는 것을 뜻합니다.",
      },
      {
        question: "'Random Play Dance' 챌린지의 주요 타겟층은?",
        options: ["3040", "전 연령", "1020", "5060"],
        correctIndex: 2,
        explanation: "K-POP 팬덤 문화 기반으로, 10~20대가 주요 참여층입니다.",
      },
      {
        question: "2024년 밈 중 B2B 마케팅에 활용하기 가장 어려운 것은?",
        options: ["마라탕후루", "스탠리 텀블러", "디깅 모먼트", "ㅋㅋ루삥뽕"],
        correctIndex: 3,
        explanation: "ㅋㅋ루삥뽕은 High Risk 등급으로 공식 기업 마케팅에 부적합합니다.",
      },
      {
        question: "'조용한 사치'(Quiet Luxury) 트렌드의 핵심은?",
        options: ["비싼 것을 자랑하는 것", "로고 없이 품질로 승부하는 소비", "저렴한 명품 구매법", "중고 명품 거래"],
        correctIndex: 1,
        explanation: "로고를 드러내지 않되, 고품질 제품을 소비하는 트렌드입니다.",
      },
      {
        question: "2024년 가장 많은 브랜드 콜라보에 활용된 밈 카테고리는?",
        options: ["유행 음악", "유행 챌린지", "유행 음식", "유행어"],
        correctIndex: 2,
        explanation: "탕후루, 마라탕 등 유행 음식이 브랜드 콜라보에 가장 많이 활용되었습니다.",
      },
      {
        question: "'도파민 인테리어'의 뜻은?",
        options: ["뇌과학 실험실 인테리어", "밝고 화려한 컬러로 기분 좋은 공간 만들기", "미니멀리즘 인테리어", "게임방 꾸미기"],
        correctIndex: 1,
        explanation: "도파민을 자극하는 밝고 생동감 있는 컬러의 인테리어 트렌드입니다.",
      },
    ],
  },
  {
    id: "2020s",
    title: "2020~2023 통합 고사",
    description: "구제 고사! 놓쳤던 밈들을 되짚어보세요.",
    era: "2020s",
    difficulty: "easy",
    questions: [
      {
        question: "'갓생'의 의미는?",
        options: ["신이 되는 삶", "부지런하고 알찬 하루를 보내는 것", "종교적 생활", "게임 캐릭터 육성"],
        correctIndex: 1,
        explanation: "God + 인생의 합성어로, 생산적이고 알찬 삶을 뜻합니다.",
      },
      {
        question: "'MBTI'가 밈으로 활용되는 주된 방식은?",
        options: ["성격 유형별 재미있는 상황 밈", "취업 면접 준비", "심리 상담 도구", "학교 시험 과목"],
        correctIndex: 0,
        explanation: "ENFP는 이럴 때, INTJ는 이럴 때 등의 유형별 밈이 대중화되었습니다.",
      },
      {
        question: "'무야호'의 원본 출처는?",
        options: ["K-pop 가사", "예능 프로그램 자막", "짤방 발굴", "영화 대사"],
        correctIndex: 2,
        explanation: "커뮤니티에서 발굴된 짤방에서 시작, 예능으로 확산된 밈입니다.",
      },
      {
        question: "'오하운'(오늘 하루 운동)이 유행한 플랫폼은?",
        options: ["X(트위터)", "인스타그램", "유튜브", "네이버 카페"],
        correctIndex: 1,
        explanation: "인스타그램 스토리에서 운동 인증 문화와 함께 유행했습니다.",
      },
      {
        question: "'~꾸'(~꾸미기)에 해당하지 않는 것은?",
        options: ["다꾸(다이어리꾸미기)", "폰꾸(폰꾸미기)", "신꾸(신발꾸미기)", "밥꾸(밥꾸미기)"],
        correctIndex: 3,
        explanation: "다꾸, 폰꾸, 신꾸 등 꾸미기 문화가 유행했지만 밥꾸는 없었습니다.",
      },
      {
        question: "2022년 'JLPT'가 밈화된 맥락은?",
        options: ["일본어 능력시험 공부 인증", "일본 여행 밈", "애니메이션 밈", "K-pop 일본 진출"],
        correctIndex: 0,
        explanation: "일본 여행 붐과 함께 JLPT 공부 인증이 밈으로 자리잡았습니다.",
      },
      {
        question: "'탕후루' 밈이 폭발한 연도는?",
        options: ["2021년", "2022년", "2023년", "2024년"],
        correctIndex: 2,
        explanation: "2023년 가을부터 탕후루 전문점이 급증하며 밈화되었습니다.",
      },
      {
        question: "'어쩔티비'의 사용 맥락은?",
        options: ["TV 추천할 때", "상대방의 말을 무시하는 반응", "텔레비전 리뷰", "방송 프로그램 밈"],
        correctIndex: 1,
        explanation: "'어쩌라고 + TV'의 합성으로, 상대 말을 가볍게 무시하는 밈입니다.",
      },
      {
        question: "'가스라이팅'이 대중화된 계기는?",
        options: ["드라마", "사회 이슈와 언론 보도", "유튜브 예능", "웹툰"],
        correctIndex: 1,
        explanation: "사회적 이슈와 함께 언론에서 다루며 일상 용어로 대중화되었습니다.",
      },
      {
        question: "'워라밸'에서 파생된 2023년 신조어는?",
        options: ["워라블(워크-라이프-블렌드)", "워라런(워크-라이프-런)", "워라셀(워크-라이프-셀프)", "워라텍(워크-라이프-테크)"],
        correctIndex: 0,
        explanation: "일과 삶의 균형(밸런스)에서 융합(블렌드)으로 개념이 진화했습니다.",
      },
    ],
  },
]

export const memeData: MemeEntry[] = [
  {
    id: "1",
    term: "제곱근 하트",
    definition: "수학 기호 '루트(Root)'의 모양이 하트와 비슷한 데서 유래한 밈. 사랑을 표현할 때 수학 공식처럼 표현하는 것이 포인트.",
    example: "\"너에 대한 내 마음은 루트 무한대\" 같은 식으로 활용",
    origin: "TikTok에서 수학 밈과 결합되어 유행. 2025년 초 숏폼에서 급부상",
    platforms: ["TikTok", "Instagram"],
    brandSafety: "safe",
    heatLevel: "hot",
    generation: "GenZ",
    category: "emoji",
    era: "2025",
    relatedTerms: ["수학밈", "하트시그널", "공학감성"],
    doExample: "브랜드 발렌타인 이벤트에서 위트있게 활용",
    dontExample: "진지한 수학 교육 콘텐츠에서 혼동을 줄 수 있음",
    addedDate: "2025-02-10",
    trendScore: 97,
    spreadTimeline: [
      { date: "2024.09.15", event: "최초 등장 (TikTok 수학 밈 크리에이터)", platform: "TikTok" },
      { date: "2024.10.01", event: "인스타 릴스 확산", platform: "Instagram" },
      { date: "2024.11.15", event: "브랜드 마케팅 활용 시작", platform: "Instagram" },
      { date: "2025.02.01", event: "발렌타인 시즌 재폭발", platform: "TikTok" },
    ],
    marketingGuide: {
      suitableIndustries: ["뷰티", "패션", "F&B", "라이프스타일"],
      unsuitableIndustries: ["B2B", "금융", "교육(학원)"],
      copyExamples: [
        "고객님께 루트(감사) 드립니다",
        "루트(사랑)이 가득한 연말 선물",
        "루트(만족) 보장 세일",
      ],
      seasonTags: [
        { season: "발렌타인데이", fit: 5 },
        { season: "크리스마스", fit: 4 },
        { season: "화이트데이", fit: 5 },
      ],
    },
  },
  {
    id: "2",
    term: "~하다못해",
    definition: "어떤 행동이나 상태가 극에 달했을 때 쓰는 과장 표현. '~하다못해 결국 ~했다'의 구조로 극적 서사를 만드는 밈.",
    example: "\"기다리다못해 결국 직접 만들어버림\" 식의 드라마틱한 표현",
    origin: "트위터(X)에서 일상 불만을 극적으로 표현하는 밈으로 시작, 숏폼으로 확산",
    platforms: ["X", "TikTok", "Threads"],
    brandSafety: "safe",
    heatLevel: "hot",
    generation: "All",
    category: "expression",
    era: "2025",
    relatedTerms: ["극한의", "결국엔", "드라마틱"],
    doExample: "제품 런칭 티저에서 기다림을 극적으로 연출",
    dontExample: "고객 불만 상황에서 사용하면 비꼬는 것처럼 보일 수 있음",
    addedDate: "2025-02-08",
    trendScore: 94,
    spreadTimeline: [
      { date: "2024.12.01", event: "X(트위터) 일상 트윗에서 등장", platform: "X" },
      { date: "2025.01.10", event: "TikTok 숏폼 자막으로 확산", platform: "TikTok" },
      { date: "2025.02.01", event: "Threads에서 밈 계정들 활용", platform: "Threads" },
    ],
    marketingGuide: {
      suitableIndustries: ["이커머스", "패션", "식품", "엔터테인먼트"],
      unsuitableIndustries: ["의료", "법률", "금융"],
      copyExamples: [
        "기다리다못해 결국 오픈합니다!",
        "고민하다못해 결국 50% 세일!",
        "참다못해 공개하는 신메뉴",
      ],
      seasonTags: [
        { season: "신제품 런칭", fit: 5 },
        { season: "세일 시즌", fit: 4 },
      ],
    },
  },
  {
    id: "3",
    term: "캐릭터 소비",
    definition: "특정 인물이나 캐릭터의 매력 포인트를 팬들이 재해석하고 2차 창작으로 소비하는 문화 현상을 가리키는 표현.",
    example: "\"이 캐릭터 소비 미쳤다\" = 팬들의 2차 창작이 활발하다는 뜻",
    origin: "K-pop 팬덤과 웹툰 커뮤니티에서 시작, 일반 대중 문화로 확산",
    platforms: ["X", "Instagram", "Threads"],
    brandSafety: "caution",
    heatLevel: "warm",
    generation: "GenZ",
    category: "slang",
    era: "2025",
    relatedTerms: ["최애", "덕질", "부캐"],
    doExample: "브랜드 마스코트의 팬아트 이벤트 유도",
    dontExample: "소비를 '이용'의 부정적 뉘앙스로 해석될 수 있으니 주의",
    addedDate: "2025-02-05",
    trendScore: 85,
    marketingGuide: {
      suitableIndustries: ["엔터테인먼트", "패션", "캐릭터/IP"],
      unsuitableIndustries: ["금융", "B2B", "의료"],
      copyExamples: [
        "우리 캐릭터, 마음껏 소비하세요",
        "팬아트 이벤트: 캐릭터 소비 챌린지",
      ],
      seasonTags: [{ season: "팬미팅 시즌", fit: 5 }],
    },
  },
  {
    id: "4",
    term: "뇌절",
    definition: "같은 드립이나 행동을 반복해서 재미가 없어지는 상태. '뇌가 절단났다'의 줄임말로, 도를 넘은 반복을 지적할 때 사용.",
    example: "\"그 밈 이제 뇌절이야\" = 너무 많이 써서 식상하다는 뜻",
    origin: "온라인 커뮤니티에서 시작, 특히 게임/스트리밍 문화에서 일반화",
    platforms: ["TikTok", "X", "Instagram", "Threads"],
    brandSafety: "caution",
    heatLevel: "warm",
    generation: "GenZ",
    category: "slang",
    era: "2024",
    relatedTerms: ["식상", "올드", "TMI"],
    doExample: "자기 비하 유머로 자사 마케팅의 반복을 인정할 때",
    dontExample: "경쟁사를 겨냥하면 공격적으로 보일 수 있음",
    addedDate: "2025-01-28",
    trendScore: 78,
    marketingGuide: {
      suitableIndustries: ["게임", "엔터테인먼트"],
      unsuitableIndustries: ["교육", "금융", "공공기관"],
      copyExamples: ["뇌절일 수 있지만... 또 할인합니다"],
      seasonTags: [],
    },
  },
  {
    id: "5",
    term: "ㅋㅋ루삥뽕",
    definition: "웃김의 강도를 극대화한 의성어. 'ㅋㅋ'에 말도 안 되는 음절을 붙여 웃음의 크기를 과장하는 인터넷 밈.",
    example: "극도로 웃긴 상황에서 \"ㅋㅋ루삥뽕\" 하고 반응",
    origin: "디시인사이드에서 시작, 숏폼 콘텐츠 자막으로 확산",
    platforms: ["TikTok", "X"],
    brandSafety: "risky",
    heatLevel: "cooling",
    generation: "GenZ",
    category: "reaction",
    era: "2024",
    relatedTerms: ["ㅋㅋ", "웃참", "미친"],
    doExample: "MZ세대 타겟 캐주얼 브랜드에서 한정적으로 활용",
    dontExample: "공식 기업 계정이나 B2B 마케팅에서는 절대 금지",
    addedDate: "2025-01-20",
    trendScore: 62,
    marketingGuide: {
      suitableIndustries: ["게임", "스트리밍"],
      unsuitableIndustries: ["금융", "B2B", "교육", "의료", "공공기관"],
      copyExamples: [],
      seasonTags: [],
      riskNote: "공식 채널에서 사용 시 '가벼운 브랜드'로 인식될 수 있음. 극히 제한적 사용 권장.",
    },
  },
  {
    id: "6",
    term: "갈비만두",
    definition: "전혀 관계없는 두 가지를 억지로 합친 조합을 뜻하는 밈. 실제 갈비만두에서 유래, '의외의 조합이 대박'이라는 맥락으로 사용.",
    example: "\"이 콜라보 완전 갈비만두인데 맛있다\" = 예상 밖 조합이지만 좋다",
    origin: "음식 밈에서 시작, 예능 프로그램에서 픽업되며 대중화",
    platforms: ["Instagram", "TikTok", "Threads"],
    brandSafety: "safe",
    heatLevel: "warm",
    generation: "All",
    category: "expression",
    era: "2025",
    relatedTerms: ["콜라보", "의외의조합", "맛있는조합"],
    doExample: "이종 브랜드 콜라보 마케팅에서 자연스럽게 활용",
    dontExample: "음식과 관련 없는 맥락에서 무리하게 쓰면 어색",
    addedDate: "2025-02-12",
    trendScore: 88,
    marketingGuide: {
      suitableIndustries: ["F&B", "패션", "라이프스타일", "이커머스"],
      unsuitableIndustries: ["금융", "의료"],
      copyExamples: [
        "이 조합, 완전 갈비만두!",
        "갈비만두급 콜라보가 왔습니다",
      ],
      seasonTags: [{ season: "콜라보 시즌", fit: 5 }],
    },
  },
  {
    id: "7",
    term: "500원 갬성",
    definition: "적은 비용으로 최대의 감성과 만족을 추구하는 트렌드. '가성비 감성'의 극단적 표현으로, 소소하지만 확실한 행복을 의미.",
    example: "\"편의점 500원 간식으로 소확행\" 같은 콘텐츠에서 활용",
    origin: "경기 침체 시기 MZ세대의 소비 패턴에서 파생된 밈",
    platforms: ["Instagram", "TikTok", "Threads"],
    brandSafety: "safe",
    heatLevel: "hot",
    generation: "GenZ",
    category: "trend",
    era: "2025",
    relatedTerms: ["소확행", "가성비", "갓성비", "짠테크"],
    doExample: "저가 제품 라인이나 할인 이벤트 프로모션에 활용",
    dontExample: "프리미엄 브랜드가 사용하면 브랜드 가치 하락 우려",
    addedDate: "2025-02-14",
    trendScore: 91,
    marketingGuide: {
      suitableIndustries: ["편의점", "F&B", "이커머스", "라이프스타일"],
      unsuitableIndustries: ["럭셔리", "프리미엄 브랜드"],
      copyExamples: [
        "500원 갬성 폭발! 이번 주 특가",
        "500원으로 완성하는 소확행",
      ],
      seasonTags: [
        { season: "블랙프라이데이", fit: 5 },
        { season: "페이데이 세일", fit: 4 },
      ],
    },
  },
  {
    id: "8",
    term: "억까",
    definition: "'억지로 까다(비난하다)'의 줄임말. 근거 없이 비난하는 행위 또는 그런 사람을 지칭할 때 사용.",
    example: "\"이건 억까 아님?\" = 이 비난은 근거가 없지 않은가?",
    origin: "스포츠 팬덤에서 시작, 연예계/정치 커뮤니티로 확산",
    platforms: ["X", "Threads", "Instagram"],
    brandSafety: "risky",
    heatLevel: "warm",
    generation: "All",
    category: "slang",
    era: "2024",
    relatedTerms: ["안티", "비하", "팩폭"],
    doExample: "자사 제품에 대한 부당한 비난에 유머러스하게 대응할 때",
    dontExample: "고객 피드백을 '억까'로 치부하면 반감을 살 수 있음",
    addedDate: "2025-01-15",
    trendScore: 72,
    marketingGuide: {
      suitableIndustries: [],
      unsuitableIndustries: ["전 산업 (주의 필요)"],
      copyExamples: [],
      seasonTags: [],
      riskNote: "브랜드가 사용할 경우 고객 의견을 무시하는 것으로 비칠 수 있음. 극히 제한적 활용 권장.",
    },
  },
  {
    id: "9",
    term: "분위기 팸",
    definition: "분위기를 잘 타는 사람, 또는 특정 바이브를 완벽하게 구현한 그룹/팀을 뜻하는 신조어. 'Family'의 줄임 '팸'과 결합.",
    example: "\"우리 팀 완전 분위기 팸이라 회식도 즐거움\"",
    origin: "힙합/스트릿 문화에서 'fam' 사용이 한국식으로 변형",
    platforms: ["Instagram", "TikTok"],
    brandSafety: "safe",
    heatLevel: "warm",
    generation: "GenZ",
    category: "slang",
    era: "2025",
    relatedTerms: ["바이브", "무드", "텐션"],
    doExample: "팀/커뮤니티 마케팅에서 소속감을 강조할 때",
    dontExample: "격식을 차려야 하는 공식 커뮤니케이션에서는 부적합",
    addedDate: "2025-02-01",
    trendScore: 76,
    marketingGuide: {
      suitableIndustries: ["패션", "라이프스타일", "F&B", "스포츠"],
      unsuitableIndustries: ["법률", "금융", "공공기관"],
      copyExamples: [
        "분위기 팸 모여라! 신규 멤버십 오픈",
        "우리 브랜드 팸이 되어주세요",
      ],
      seasonTags: [{ season: "팀빌딩 시즌", fit: 4 }],
    },
  },
  {
    id: "10",
    term: "디깅 모먼트",
    definition: "'Digging(파고들기)' + 'Moment'의 합성어. 자신이 좋아하는 분야에 깊이 몰입하는 순간을 뜻하는 트렌드 키워드.",
    example: "\"오늘 디깅 모먼트: 3시간 동안 빈티지 레코드 탐색\"",
    origin: "2025 트렌드 코리아에서 키워드로 선정, SNS에서 밈화",
    platforms: ["Instagram", "Threads", "TikTok"],
    brandSafety: "safe",
    heatLevel: "hot",
    generation: "Millennial",
    category: "trend",
    era: "2025",
    relatedTerms: ["덕질", "취미존중", "오타쿠"],
    doExample: "니치 마켓 타겟팅, 취미 관련 브랜딩에 완벽",
    dontExample: "깊이 없는 콘텐츠에서 사용하면 역효과",
    addedDate: "2025-02-15",
    trendScore: 93,
    marketingGuide: {
      suitableIndustries: ["라이프스타일", "교육", "취미용품", "이커머스"],
      unsuitableIndustries: ["패스트푸드"],
      copyExamples: [
        "당신의 디깅 모먼트를 응원합니다",
        "디깅러를 위한 큐레이션",
      ],
      seasonTags: [
        { season: "연초 취미 시즌", fit: 5 },
        { season: "방학 시즌", fit: 4 },
      ],
    },
  },
  {
    id: "11",
    term: "요즘것들",
    definition: "기성세대가 젊은 세대를 지칭하던 말이 역으로 밈이 됨. Z세대가 자기 자신을 자조적으로 지칭하며 사용하는 아이러니한 표현.",
    example: "\"요즘것들은 퇴근 후에 부캐 운영함\" 같은 자조 유머",
    origin: "세대 갈등 담론에서 유머로 전환, 밈 계정에서 대중화",
    platforms: ["Instagram", "TikTok", "X", "Threads"],
    brandSafety: "caution",
    heatLevel: "warm",
    generation: "All",
    category: "expression",
    era: "2024",
    relatedTerms: ["MZ", "꼰대", "세대차이"],
    doExample: "세대 간 소통을 위트있게 다루는 캠페인",
    dontExample: "실제로 세대를 비하하는 톤이 되면 역효과",
    addedDate: "2025-01-25",
    trendScore: 80,
    marketingGuide: {
      suitableIndustries: ["엔터테인먼트", "미디어"],
      unsuitableIndustries: ["교육", "공공기관"],
      copyExamples: ["요즘것들이 원하는 건 바로 이것!"],
      seasonTags: [],
    },
  },
  {
    id: "12",
    term: "숏폼 브레인",
    definition: "짧은 숏폼 콘텐츠에 너무 익숙해져서 긴 콘텐츠를 소비하지 못하는 상태를 자조적으로 표현한 밈.",
    example: "\"숏폼 브레인이라 영화 2시간이 고문임\"",
    origin: "TikTok/릴스 과도 사용에 대한 자기 반성 밈으로 시작",
    platforms: ["TikTok", "X", "Threads"],
    brandSafety: "safe",
    heatLevel: "hot",
    generation: "GenZ",
    category: "trend",
    era: "2025",
    relatedTerms: ["도파민", "집중력", "릴스중독"],
    doExample: "숏폼 콘텐츠 프로모션에서 자기 반영적 유머로 활용",
    dontExample: "건강/교육 브랜드에서 사용하면 경박해 보일 수 있음",
    addedDate: "2025-02-18",
    trendScore: 95,
    marketingGuide: {
      suitableIndustries: ["미디어", "엔터테인먼트", "이커머스"],
      unsuitableIndustries: ["교육", "건강", "의료"],
      copyExamples: [
        "숏폼 브레인도 끝까지 보는 콘텐츠",
        "15초면 충분! 숏폼 브레인 맞춤 정보",
      ],
      seasonTags: [],
    },
  },
  // Expanded categories: 유행템, 유행 음식, 유행 챌린지, 유행 음악
  {
    id: "13",
    term: "스탠리 텀블러",
    definition: "2024년 가장 핫했던 텀블러 브랜드. 하이드로 플라스크 이후 물병 열풍의 아이콘으로, '스탠리 있어?'가 인사말이 된 밈.",
    example: "\"오늘의 OOTD: 스탠리 텀블러 포함\"",
    origin: "미국 TikTok에서 시작, 한국 인스타그램으로 확산",
    platforms: ["Instagram", "TikTok"],
    brandSafety: "safe",
    heatLevel: "cooling",
    generation: "GenZ",
    category: "item",
    era: "2024",
    relatedTerms: ["텀블러", "물병", "OOTD", "하이드로플라스크"],
    doExample: "라이프스타일 콘텐츠에서 트렌디한 소품으로 활용",
    dontExample: "경쟁 텀블러 브랜드에서 직접 언급 시 비교 마케팅으로 비칠 수 있음",
    addedDate: "2024-06-15",
    trendScore: 55,
    marketingGuide: {
      suitableIndustries: ["패션", "라이프스타일", "F&B"],
      unsuitableIndustries: ["B2B"],
      copyExamples: ["스탠리급 감성의 우리 텀블러"],
      seasonTags: [{ season: "여름", fit: 5 }],
    },
  },
  {
    id: "14",
    term: "마라탕후루",
    definition: "마라탕과 탕후루의 충격적 조합. 2024년 음식 밈의 정점으로, '이 조합 실화?'라는 반응과 함께 바이럴.",
    example: "\"마라탕후루 먹어봄? 의외로 맛있음\"",
    origin: "틱톡 먹방 크리에이터에서 시작, 인스타 릴스로 확산",
    platforms: ["TikTok", "Instagram"],
    brandSafety: "safe",
    heatLevel: "warm",
    generation: "All",
    category: "food",
    era: "2024",
    relatedTerms: ["마라탕", "탕후루", "이색조합", "먹방"],
    doExample: "F&B 신메뉴 네이밍이나 이색 조합 마케팅에 참고",
    dontExample: "음식과 관련 없는 브랜드에서 억지로 연결하면 어색",
    addedDate: "2024-08-01",
    trendScore: 68,
    marketingGuide: {
      suitableIndustries: ["F&B", "편의점", "배달앱"],
      unsuitableIndustries: ["건강식품", "프리미엄 레스토랑"],
      copyExamples: ["마라탕후루급 충격 조합! 신메뉴 출시"],
      seasonTags: [{ season: "겨울", fit: 4 }],
    },
  },
  {
    id: "15",
    term: "APT.",
    definition: "ROSE & Bruno Mars의 곡. '아파트 게임'에서 유래한 멜로디가 숏폼 배경음악의 절대 강자로 등극.",
    example: "\"아-파-트! 아-파-트!\" 배경음악에 맞춰 일상 영상 촬영",
    origin: "ROSE의 앨범 발매 후 틱톡에서 폭발적 바이럴",
    platforms: ["TikTok", "Instagram", "YouTube"],
    brandSafety: "safe",
    heatLevel: "warm",
    generation: "All",
    category: "music",
    era: "2024",
    relatedTerms: ["ROSE", "브루노마스", "숏폼BGM", "K-pop"],
    doExample: "브랜드 릴스/숏폼 영상의 BGM으로 활용",
    dontExample: "저작권 확인 필수. 무단 상업 사용 금지",
    addedDate: "2024-10-20",
    trendScore: 73,
    marketingGuide: {
      suitableIndustries: ["엔터테인먼트", "패션", "라이프스타일"],
      unsuitableIndustries: ["B2B", "금융"],
      copyExamples: ["APT.처럼 중독되는 우리 신제품"],
      seasonTags: [{ season: "연말", fit: 4 }],
      riskNote: "음원 저작권 라이선스 반드시 확인 후 사용.",
    },
  },
  {
    id: "16",
    term: "랜덤 플레이 댄스",
    definition: "K-POP 노래가 랜덤으로 나올 때 즉석에서 춤을 추는 챌린지. 길거리 버전이 유튜브 조회수 수천만을 기록.",
    example: "\"홍대 랜덤 플레이 댄스에서 전곡 다 춤\" 같은 인증",
    origin: "K-POP 팬덤 문화에서 시작, 유튜브 & 틱톡으로 글로벌 확산",
    platforms: ["YouTube", "TikTok"],
    brandSafety: "safe",
    heatLevel: "warm",
    generation: "GenZ",
    category: "challenge",
    era: "2024",
    relatedTerms: ["K-POP", "댄스챌린지", "홍대", "커버댄스"],
    doExample: "브랜드 자체 챌린지 기획 시 포맷 참고",
    dontExample: "무리한 브랜드 삽입은 자연스러움을 해칠 수 있음",
    addedDate: "2024-07-01",
    trendScore: 65,
    marketingGuide: {
      suitableIndustries: ["엔터테인먼트", "패션", "스포츠웨어"],
      unsuitableIndustries: ["금융", "법률"],
      copyExamples: ["우리 브랜드 챌린지에 참여하세요!"],
      seasonTags: [
        { season: "축제 시즌", fit: 5 },
        { season: "K-POP 컴백 시즌", fit: 5 },
      ],
    },
  },
  {
    id: "17",
    term: "눕생살기",
    definition: "'갓생'의 반대 개념. 의도적으로 아무것도 안 하고 누워서 쉬며 사는 것을 긍정적으로 표현한 밈.",
    example: "\"오늘은 눕생 선언. 이불 밖은 위험해.\"",
    origin: "갓생 피로감에서 파생, '번아웃'에 대한 긍정적 대안으로 확산",
    platforms: ["Instagram", "TikTok", "X"],
    brandSafety: "safe",
    heatLevel: "warm",
    generation: "All",
    category: "trend",
    era: "2024",
    relatedTerms: ["갓생", "번아웃", "소확행", "힐링"],
    doExample: "휴식/힐링 관련 제품 마케팅에 완벽",
    dontExample: "생산성 강조 브랜드에서 쓰면 메시지 혼선",
    addedDate: "2024-09-01",
    trendScore: 70,
    marketingGuide: {
      suitableIndustries: ["홈리빙", "F&B", "OTT", "여행"],
      unsuitableIndustries: ["피트니스", "교육"],
      copyExamples: [
        "오늘은 눕생 허가! 배달 시키세요",
        "눕생의 완성은 우리 매트리스",
      ],
      seasonTags: [
        { season: "여름 휴가", fit: 5 },
        { season: "연말 휴식", fit: 4 },
      ],
    },
  },
  {
    id: "18",
    term: "도파민 인테리어",
    definition: "밝고 화려한 컬러로 기분 좋은 공간을 만드는 인테리어 트렌드. 도파민을 자극하는 비비드한 컬러가 핵심.",
    example: "\"도파민 인테리어로 방 꾸몄더니 기분이 달라짐\"",
    origin: "해외 인테리어 트렌드가 한국 SNS에서 밈화",
    platforms: ["Instagram", "TikTok", "YouTube"],
    brandSafety: "safe",
    heatLevel: "cooling",
    generation: "Millennial",
    category: "trend",
    era: "2024",
    relatedTerms: ["인테리어", "비비드", "컬러풀", "자기표현"],
    doExample: "홈데코, 라이프스타일 브랜드 캠페인에 활용",
    dontExample: "미니멀리즘 브랜드와 충돌 가능",
    addedDate: "2024-05-10",
    trendScore: 50,
    marketingGuide: {
      suitableIndustries: ["인테리어", "가전", "라이프스타일"],
      unsuitableIndustries: ["B2B"],
      copyExamples: ["도파민 터지는 신상 컬러 컬렉션"],
      seasonTags: [{ season: "봄 인테리어 시즌", fit: 5 }],
    },
  },
]

export function getHeatLabel(heat: HeatLevel): string {
  switch (heat) {
    case "hot": return "HOT"
    case "warm": return "WARM"
    case "cooling": return "COOLING"
    case "cold": return "COLD"
  }
}

export function getSafetyLabel(safety: BrandSafety): string {
  switch (safety) {
    case "safe": return "SAFE"
    case "caution": return "CAUTION"
    case "risky": return "RISKY"
  }
}

export function getGenerationLabel(gen: Generation): string {
  switch (gen) {
    case "GenZ": return "Gen Z"
    case "GenAlpha": return "Gen Alpha"
    case "Millennial": return "Millennial"
    case "All": return "All"
  }
}

export function getCategoryLabel(cat: Category): string {
  switch (cat) {
    case "all": return "All"
    case "expression": return "Expression"
    case "reaction": return "Reaction"
    case "trend": return "Trend"
    case "slang": return "Slang"
    case "emoji": return "Emoji / Symbol"
    case "item": return "Item"
    case "food": return "Food"
    case "challenge": return "Challenge"
    case "music": return "Music"
  }
}

export function getCategoryLabelKo(cat: Category): string {
  switch (cat) {
    case "all": return "전체"
    case "expression": return "유행어"
    case "reaction": return "리액션"
    case "trend": return "트렌드"
    case "slang": return "신조어"
    case "emoji": return "이모지"
    case "item": return "유행템"
    case "food": return "유행 음식"
    case "challenge": return "챌린지"
    case "music": return "유행 음악"
  }
}
