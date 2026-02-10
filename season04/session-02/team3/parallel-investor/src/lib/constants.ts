import { LevelTier, NavItem } from "./types";

export const APP_NAME = "DÉJÀ BUY";
export const APP_TAGLINE = "또 사려고? 이거 전에도 봤잖아.";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "홈",
    href: "/",
    icon: "home",
    description: "Déjà Buy 감지",
  },
  {
    label: "기록",
    href: "/history",
    icon: "shield",
    description: "참음 기록 & 세이브",
  },
  {
    label: "내 레벨",
    href: "/level",
    icon: "star",
    description: "레벨 & 뱃지",
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

// --- Persona (투자 MBTI) ---
export const PERSONA_WHY_OPTIONS = [
  { value: "N" as const, label: "뉴스/찌라시 봤어", emoji: "📰" },
  { value: "C" as const, label: "차트가 예뻐서", emoji: "📈" },
  { value: "F" as const, label: "그냥 감이 와", emoji: "🎯" },
];

export const PERSONA_TIME_OPTIONS = [
  { value: "S" as const, label: "오늘 단타", emoji: "⚡" },
  { value: "W" as const, label: "며칠~몇 주", emoji: "📆" },
  { value: "H" as const, label: "장기 존버", emoji: "🏔️" },
];

export const PERSONA_RISK_OPTIONS = [
  { value: "H" as const, label: "인생 건다", emoji: "🔥" },
  { value: "L" as const, label: "정찰병만", emoji: "🔍" },
];

export const PERSONA_NICKNAMES: Record<string, { nickname: string; emoji: string; risk: string }> = {
  "NSH": { nickname: "불나방", emoji: "🔥", risk: "극고위험" },
  "NSL": { nickname: "뉴스서퍼", emoji: "🏄", risk: "고위험" },
  "NWH": { nickname: "뉴스올인러", emoji: "📰", risk: "고위험" },
  "NWL": { nickname: "정보수집가", emoji: "🔎", risk: "중위험" },
  "NHH": { nickname: "뉴스존버러", emoji: "📡", risk: "중고위험" },
  "NHL": { nickname: "신문읽는 거북이", emoji: "🐢", risk: "저위험" },
  "CSH": { nickname: "차트전사", emoji: "⚔️", risk: "중고위험" },
  "CSL": { nickname: "기술적 정찰병", emoji: "🔭", risk: "중위험" },
  "CWH": { nickname: "차트분석 올인러", emoji: "📊", risk: "중고위험" },
  "CWL": { nickname: "분석가", emoji: "🧠", risk: "저위험" },
  "CHH": { nickname: "장기 차트 신봉자", emoji: "🏛️", risk: "중위험" },
  "CHL": { nickname: "현명한 관찰자", emoji: "👓", risk: "최저위험" },
  "FSH": { nickname: "도박사", emoji: "🎰", risk: "극고위험" },
  "FSL": { nickname: "감치기", emoji: "🎲", risk: "고위험" },
  "FWH": { nickname: "직감 올인러", emoji: "💫", risk: "고위험" },
  "FWL": { nickname: "느긋한 감투자", emoji: "🍵", risk: "중위험" },
  "FHH": { nickname: "믿음의 전사", emoji: "🛐", risk: "중고위험" },
  "FHL": { nickname: "느낌있는 거북이", emoji: "🐌", risk: "저위험" },
};

// --- Premium ---
export const FREE_ANALYSIS_LIMIT = 10;

export const PREMIUM_PLAN = {
  name: "SOLID",
  monthlyPrice: 9900,
  yearlyPrice: 89000,
  trialDays: 7,
};
