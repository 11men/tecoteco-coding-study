# 알림 기능 시퀀스 다이어그램

## 1. 알림 구독 (Subscribe)

```mermaid
sequenceDiagram
    participant User as 사용자
    participant FE as Frontend (React)
    participant FCM as Firebase Cloud Messaging
    participant BE as Backend (Spring)
    participant DB as MySQL

    User->>FE: 알림 구독 버튼 클릭
    FE->>FE: Notification.requestPermission()
    FE->>FCM: getToken(vapidKey)
    FCM-->>FE: FCM Token 반환
    FE->>BE: POST /api/subscriptions {token, userId}
    BE->>DB: FCM 토큰 저장
    DB-->>BE: 저장 완료
    BE-->>FE: 201 Created
    FE-->>User: 구독 완료 알림
```

## 2. 파업 알림 발송 (Send Notification)

```mermaid
sequenceDiagram
    participant Admin as 관리자
    participant BE as Backend (Spring)
    participant DB as MySQL
    participant FCM as Firebase Cloud Messaging
    participant SW as Service Worker
    participant User as 사용자

    Admin->>BE: POST /api/notifications {title, body, type}
    BE->>DB: 알림 내역 저장
    BE->>DB: 구독자 토큰 목록 조회
    DB-->>BE: FCM 토큰 리스트
    BE->>FCM: sendMulticast(tokens, message)
    FCM-->>BE: 발송 결과

    par 각 사용자에게 전달
        FCM->>SW: Push Message
        SW->>User: 알림 표시
    end

    BE-->>Admin: 발송 완료 응답
```

## 3. 포그라운드 알림 수신

```mermaid
sequenceDiagram
    participant FCM as Firebase Cloud Messaging
    participant FE as Frontend (React)
    participant User as 사용자

    FCM->>FE: onMessage(payload)
    FE->>FE: new Notification(title, body)
    FE-->>User: 알림 팝업 표시
```

## 4. 백그라운드 알림 수신

```mermaid
sequenceDiagram
    participant FCM as Firebase Cloud Messaging
    participant SW as Service Worker
    participant User as 사용자

    FCM->>SW: onBackgroundMessage(payload)
    SW->>SW: showNotification(title, body)
    SW-->>User: 시스템 알림 표시
    User->>SW: 알림 클릭
    SW->>SW: 앱으로 이동
```

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/subscriptions | FCM 토큰 등록 |
| DELETE | /api/subscriptions | FCM 토큰 삭제 |
| POST | /api/notifications | 알림 발송 |
| GET | /api/notifications | 알림 목록 조회 |
