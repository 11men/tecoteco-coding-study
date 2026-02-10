import { LevelTier, NavItem } from "./types";

export const APP_NAME = "DÉJÀ BUY";
export const APP_TAGLINE = "또 사려고? 이거 전에도 봤잖아.";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "홈",
    href: "/",
    icon: "home",
    description: "홈",
  },
  {
    label: "데자뷰",
    href: "/pattern",
    icon: "chart",
    description: "전에 본 적 있는 패턴",
  },
  {
    label: "기록",
    href: "/shadow-record",
    icon: "shield",
    description: "이번엔 안 산다",
  },
  {
    label: "세이브",
    href: "/jomo",
    icon: "trophy",
    description: "안 사서 번 돈",
  },
  {
    label: "레벨",
    href: "/level",
    icon: "star",
    description: "내 레벨",
  },
];

export const LEVEL_TIERS: LevelTier[] = [
  { level: 1, title: "펄럭귀", titleEn: "Paper Ear", requiredExp: 0 },
  { level: 5, title: "철벽", titleEn: "Iron Wall", requiredExp: 100 },
  { level: 10, title: "돌부처", titleEn: "Stone Buddha", requiredExp: 300 },
  { level: 30, title: "냉장고", titleEn: "Freezer", requiredExp: 1000 },
  { level: 99, title: "버핏의 후계자", titleEn: "Heir of Buffett", requiredExp: 5000 },
];

export const FOMO_INTENSITY_LABELS: Record<number, string> = {
  1: "좀 흔들리네",
  2: "사고 싶긴 한데...",
  3: "꽤 사고 싶다",
  4: "지금 안 사면 늦을 것 같아",
  5: "안 사면 평생 후회할 듯",
};

export const JOMO_ITEMS = [
  { name: "치킨", emoji: "🍗", unitPrice: 20000 },
  { name: "스타벅스 커피", emoji: "☕", unitPrice: 6000 },
  { name: "넷플릭스 1개월", emoji: "🎬", unitPrice: 13500 },
  { name: "맥북 에어", emoji: "💻", unitPrice: 1590000 },
  { name: "아이폰", emoji: "📱", unitPrice: 1350000 },
  { name: "해외여행 (동남아)", emoji: "✈️", unitPrice: 800000 },
];
