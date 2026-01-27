export interface StrikeNotification {
  id: string;
  title: string;
  body: string;
  type: 'strike_alert' | 'strike_start' | 'strike_end' | 'negotiation';
  timestamp: Date;
  data?: {
    strikeId?: string;
    affectedRoutes?: string[];
    region?: string;
  };
}

export interface NotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}
