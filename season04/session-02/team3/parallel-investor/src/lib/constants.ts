import { LevelTier, NavItem } from "./types";

export const APP_NAME = "Parallel Investor";
export const APP_TAGLINE = "당신의 직감이 틀렸음을, 과거의 데이터가 증명합니다.";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "홈",
    href: "/",
    icon: "home",
    description: "대시보드",
  },
  {
    label: "패턴분석",
    href: "/pattern",
    icon: "chart",
    description: "과거 패턴 매칭",
  },
  {
    label: "참음기록",
    href: "/shadow-record",
    icon: "shield",
    description: "FOMO 기록",
  },
  {
    label: "방어현황",
    href: "/jomo",
    icon: "trophy",
    description: "JOMO 계산기",
  },
  {
    label: "레벨",
    href: "/level",
    icon: "star",
    description: "참을성 레벨링",
  },
];

export const LEVEL_TIERS: LevelTier[] = [
  { level: 1, title: "펄럭귀", titleEn: "Paper Ear", requiredExp: 0 },
  { level: 5, title: "철벽", titleEn: "Iron Wall", requiredExp: 100 },
  { level: 10, title: "돌부처", titleEn: "Stone Buddha", requiredExp: 300 },
  { level: 30, title: "현금 수호자", titleEn: "Cash Guardian", requiredExp: 1000 },
  { level: 99, title: "버핏의 후계자", titleEn: "Heir of Buffett", requiredExp: 5000 },
];

export const FOMO_INTENSITY_LABELS: Record<number, string> = {
  1: "살짝 흔들림",
  2: "좀 사고 싶다",
  3: "꽤 사고 싶다",
  4: "지금 당장 사야 할 것 같다",
  5: "안 사면 후회할 것 같다",
};

export const JOMO_ITEMS = [
  { name: "치킨", emoji: "🍗", unitPrice: 20000 },
  { name: "스타벅스 커피", emoji: "☕", unitPrice: 6000 },
  { name: "넷플릭스 1개월", emoji: "🎬", unitPrice: 13500 },
  { name: "맥북 에어", emoji: "💻", unitPrice: 1590000 },
  { name: "아이폰", emoji: "📱", unitPrice: 1350000 },
  { name: "해외여행 (동남아)", emoji: "✈️", unitPrice: 800000 },
];
