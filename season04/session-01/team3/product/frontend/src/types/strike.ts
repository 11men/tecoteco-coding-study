export type StrikeStatus = 'SCHEDULED' | 'ONGOING' | 'CANCELLED' | 'ENDED';

export interface Strike {
  id: number;
  title: string;
  description: string;
  status: StrikeStatus;
  strikeDate: string;
  affectedRegions: string[];
  busTypes: string[];
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrikesResponse {
  success: boolean;
  total: number;
  strikes: Strike[];
}

export const getStatusText = (status: StrikeStatus): string => {
  const statusMap: Record<StrikeStatus, string> = {
    SCHEDULED: '파업 예정',
    ONGOING: '파업 진행중',
    CANCELLED: '파업 중단',
    ENDED: '파업 종료'
  };
  return statusMap[status];
};

export const getStatusColor = (status: StrikeStatus): string => {
  const colorMap: Record<StrikeStatus, string> = {
    SCHEDULED: 'warning',
    ONGOING: 'danger',
    CANCELLED: 'info',
    ENDED: 'success'
  };
  return colorMap[status];
};
