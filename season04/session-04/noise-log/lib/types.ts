export enum NoiseType {
    INTER_FLOOR = "INTER_FLOOR",
    EXTERNAL = "EXTERNAL",
    PET = "PET",
    BABY = "BABY",
    ELEVATOR = "ELEVATOR",
    TRASH = "TRASH",
    ETC = "ETC",
}

export enum TimeSlot {
    MORNING = "MORNING",
    AFTERNOON = "AFTERNOON",
    EVENING = "EVENING",
    NIGHT = "NIGHT",
}

export type BuildingType = "APARTMENT" | "OFFICETEL" | "VILLA" | "ETC";
export type CommercialDensity = "LOW" | "MEDIUM" | "HIGH";
export type BoardType = "FREE" | "NOISE_HELP" | "QNA";

export interface Building {
    id: string;
    address: string;
    buildingName?: string;
    lat: number;
    lng: number;
    buildingType: BuildingType;
    avgNoiseScore: number;
    predictedNoiseScore?: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface NoiseReview {
    id: string;
    buildingId: string;
    userId?: string;
    nickname?: string;
    floor?: number;
    noiseScore: number;
    noiseTypes: NoiseType[];
    timeOfDay: TimeSlot[];
    description: string;
    imageUrls?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ObjectiveData {
    id: string;
    buildingId: string;
    roadDistance: number;
    roadLanes?: number;
    nearbyConstruction: boolean;
    constructionEndDate?: string;
    subwayDistance?: number;
    subwayLine?: string;
    commercialDensity: CommercialDensity;
    commercialCount?: number;
    updatedAt: string;
}

export interface CommunityPost {
    id: string;
    userId: string;
    nickname: string;
    boardType: BoardType;
    region?: string;
    title: string;
    content: string;
    imageUrls?: string[];
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    nickname: string;
    content: string;
    parentId?: string;
    likeCount: number;
    createdAt: string;
}

export const NOISE_TYPE_LABELS: Record<NoiseType, string> = {
    [NoiseType.INTER_FLOOR]: "층간소음",
    [NoiseType.EXTERNAL]: "외부소음",
    [NoiseType.PET]: "반려동물",
    [NoiseType.BABY]: "아기",
    [NoiseType.ELEVATOR]: "엘리베이터",
    [NoiseType.TRASH]: "쓰레기 수거",
    [NoiseType.ETC]: "기타",
};

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
    [TimeSlot.MORNING]: "오전 (06-12시)",
    [TimeSlot.AFTERNOON]: "오후 (12-18시)",
    [TimeSlot.EVENING]: "저녁 (18-24시)",
    [TimeSlot.NIGHT]: "새벽 (00-06시)",
};

export const NOISE_TYPE_ICONS: Record<NoiseType, string> = {
    [NoiseType.INTER_FLOOR]: "👣",
    [NoiseType.EXTERNAL]: "🚗",
    [NoiseType.PET]: "🐕",
    [NoiseType.BABY]: "👶",
    [NoiseType.ELEVATOR]: "🛗",
    [NoiseType.TRASH]: "🗑️",
    [NoiseType.ETC]: "📢",
};
