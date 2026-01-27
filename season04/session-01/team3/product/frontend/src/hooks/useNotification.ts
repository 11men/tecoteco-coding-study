import { useState, useEffect, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';

const VAPID_KEY = 'BF5Hrjy0Pvpq-YIodfyrcp_aFbLk0-kwYj48VbBqQF9rgWcXDXIK95it8QO5zCiRfol1jxeEnSxNL7o27RGPGNw';

interface NotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  fcmToken: string | null;
}

interface StrikeNotification {
  title: string;
  body: string;
  type: 'strike_alert' | 'strike_start' | 'strike_end' | 'negotiation';
  data?: {
    strikeId?: string;
    affectedRoutes?: string[];
    region?: string;
  };
}

export const useNotification = () => {
  const [state, setState] = useState<NotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
    fcmToken: null,
  });

  useEffect(() => {
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    setState(prev => ({
      ...prev,
      isSupported,
      permission: isSupported ? Notification.permission : 'denied',
    }));

    // FCM 포그라운드 메시지 수신
    if (isSupported) {
      onMessage(messaging, (payload) => {
        console.log('FCM 메시지 수신:', payload);
        if (payload.notification) {
          new Notification(payload.notification.title || '알림', {
            body: payload.notification.body,
            icon: '/bus-icon.svg',
          });
        }
      });
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      console.error('알림이 지원되지 않는 브라우저입니다.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));

      if (permission === 'granted') {
        // Service Worker 등록
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        // FCM 토큰 가져오기
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        console.log('FCM Token:', token);
        setState(prev => ({ ...prev, isSubscribed: true, fcmToken: token }));

        // TODO: 백엔드에 토큰 전송
        // await fetch('/api/notifications/subscribe', { method: 'POST', body: JSON.stringify({ token }) });

        return true;
      }
      return false;
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      return false;
    }
  }, [state.isSupported]);

  const sendNotification = useCallback((notification: StrikeNotification) => {
    if (state.permission !== 'granted') {
      console.warn('알림 권한이 없습니다.');
      return;
    }

    const options: NotificationOptions = {
      body: notification.body,
      icon: '/bus-icon.svg',
      tag: notification.type,
      requireInteraction: notification.type === 'strike_start',
      data: notification.data,
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(notification.title, options);
      });
    } else {
      new Notification(notification.title, options);
    }
  }, [state.permission]);

  const sendMockStrikeAlert = useCallback(() => {
    sendNotification({
      title: '[긴급] 서울 시내버스 파업 예고',
      body: '내일(1/13) 04:00부터 서울 시내버스 파업이 예정되어 있습니다.',
      type: 'strike_alert',
      data: { strikeId: 'STK-2026-001', region: 'seoul' },
    });
  }, [sendNotification]);

  const sendMockStrikeStart = useCallback(() => {
    sendNotification({
      title: '[속보] 서울 시내버스 파업 시작',
      body: '서울 시내버스 390개 노선이 운행을 중단했습니다.',
      type: 'strike_start',
      data: { strikeId: 'STK-2026-001', region: 'seoul' },
    });
  }, [sendNotification]);

  const sendMockStrikeEnd = useCallback(() => {
    sendNotification({
      title: '서울 시내버스 파업 종료',
      body: '노사 협상이 타결되어 내일 첫차부터 정상 운행됩니다.',
      type: 'strike_end',
      data: { strikeId: 'STK-2026-001', region: 'seoul' },
    });
  }, [sendNotification]);

  const sendMockNegotiation = useCallback(() => {
    sendNotification({
      title: '노사 협상 진행 중',
      body: '서울시버스노조와 사측 간 협상이 진행 중입니다.',
      type: 'negotiation',
      data: { strikeId: 'STK-2026-001' },
    });
  }, [sendNotification]);

  return {
    ...state,
    requestPermission,
    sendNotification,
    sendMockStrikeAlert,
    sendMockStrikeStart,
    sendMockStrikeEnd,
    sendMockNegotiation,
  };
};
