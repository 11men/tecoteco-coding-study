export type MembershipPlan = "BASIC" | "PRO";

export interface UserProfile {
    id: string;
    nickname: string;
    email: string;
    avatarUrl?: string;
    plan: MembershipPlan;
    planStartDate?: string;
    nextBillingDate?: string;
    reviewCount: number;
    freeViewsRemaining: number;
    freeViewsTotal: number;
    favoriteBuildings: string[];
    joinedAt: string;
}

export interface PaymentHistory {
    id: string;
    date: string;
    amount: number;
    description: string;
    type: "SUBSCRIPTION" | "SINGLE";
}

export interface NoiseMeasurementRecord {
    id: string;
    date: string;
    location: string;
    avgDecibel: number;
    peakDecibel: number;
    duration: number;
}

export const MOCK_USER: UserProfile = {
    id: "u1",
    nickname: "조용한생활",
    email: "quiet@example.com",
    plan: "BASIC",
    reviewCount: 5,
    freeViewsRemaining: 2,
    freeViewsTotal: 5,
    favoriteBuildings: ["1", "4", "7"],
    joinedAt: "2026-01-15",
};

export const MOCK_PAYMENTS: PaymentHistory[] = [
    {
        id: "pay1",
        date: "2026-03-01",
        amount: 1900,
        description: "역삼 센트럴 아파트 리포트",
        type: "SINGLE",
    },
    {
        id: "pay2",
        date: "2026-02-15",
        amount: 1900,
        description: "반포 힐스테이트 리포트",
        type: "SINGLE",
    },
];

export const MOCK_MEASUREMENTS: NoiseMeasurementRecord[] = [
    {
        id: "m1",
        date: "2026-03-09",
        location: "서울시 송파구 잠실동",
        avgDecibel: 58,
        peakDecibel: 78,
        duration: 300,
    },
    {
        id: "m2",
        date: "2026-03-07",
        location: "서울시 강남구 역삼동",
        avgDecibel: 45,
        peakDecibel: 62,
        duration: 180,
    },
    {
        id: "m3",
        date: "2026-03-05",
        location: "서울시 마포구 합정동",
        avgDecibel: 52,
        peakDecibel: 71,
        duration: 240,
    },
];
