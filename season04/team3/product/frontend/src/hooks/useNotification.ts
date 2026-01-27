import { useState, useEffect, useCallback } from 'react';
import { NotificationState, StrikeNotification } from '../types/notification';

export const useNotification = () => {
  const [state, setState] = useState<NotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
  });

  useEffect(() => {
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    setState(prev => ({
      ...prev,
      isSupported,
      permission: isSupported ? Notification.permission : 'denied',
    }));
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
        setState(prev => ({ ...prev, isSubscribed: true }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      return false;
    }
  }, [state.isSupported]);

  const sendNotification = useCallback((notification: Omit<StrikeNotification, 'id' | 'timestamp'>) => {
    if (state.permission !== 'granted') {
      console.warn('알림 권한이 없습니다.');
      return;
    }

    const options: NotificationOptions = {
      body: notification.body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
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
      title: '🚌 [긴급] 서울 시내버스 파업 예고',
      body: '내일(1/13) 04:00부터 서울 시내버스 파업이 예정되어 있습니다. 대체 교통수단을 확인하세요.',
      type: 'strike_alert',
      data: {
        strikeId: 'STK-2026-001',
        affectedRoutes: ['143', '240', '100'],
        region: 'seoul',
      },
    });
  }, [sendNotification]);

  const sendMockStrikeStart = useCallback(() => {
    sendNotification({
      title: '🚨 [속보] 서울 시내버스 파업 시작',
      body: '서울 시내버스 390개 노선이 운행을 중단했습니다. 지하철 또는 대체버스를 이용해주세요.',
      type: 'strike_start',
      data: {
        strikeId: 'STK-2026-001',
        region: 'seoul',
      },
    });
  }, [sendNotification]);

  const sendMockStrikeEnd = useCallback(() => {
    sendNotification({
      title: '✅ 서울 시내버스 파업 종료',
      body: '노사 협상이 타결되어 내일 첫차부터 정상 운행됩니다.',
      type: 'strike_end',
      data: {
        strikeId: 'STK-2026-001',
        region: 'seoul',
      },
    });
  }, [sendNotification]);

  const sendMockNegotiation = useCallback(() => {
    sendNotification({
      title: '📢 노사 협상 진행 중',
      body: '서울시버스노조와 사측 간 협상이 진행 중입니다. 결과를 기다려주세요.',
      type: 'negotiation',
      data: {
        strikeId: 'STK-2026-001',
      },
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
