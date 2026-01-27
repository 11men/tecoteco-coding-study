# 백엔드 알림 구현 시퀀스 (Hexagonal Architecture)

## 1. FCM 토큰 등록

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Controller as NotificationController<br/>(Adapter In)
    participant UseCase as SubscribeUseCase<br/>(Application Port In)
    participant Service as SubscriptionService<br/>(Application)
    participant Domain as Subscription<br/>(Domain)
    participant RepoPort as SubscriptionRepository<br/>(Application Port Out)
    participant RepoAdapter as SubscriptionPersistenceAdapter<br/>(Adapter Out)
    participant DB as MySQL

    Client->>Controller: POST /api/subscriptions<br/>{token, deviceInfo}
    Controller->>UseCase: subscribe(command)
    UseCase->>Service: subscribe(token, deviceInfo)
    Service->>Domain: new Subscription(token, deviceInfo)
    Domain-->>Service: Subscription 객체
    Service->>RepoPort: save(subscription)
    RepoPort->>RepoAdapter: save(subscription)
    RepoAdapter->>DB: INSERT INTO subscriptions
    DB-->>RepoAdapter: OK
    RepoAdapter-->>RepoPort: Subscription
    RepoPort-->>Service: Subscription
    Service-->>UseCase: SubscriptionId
    UseCase-->>Controller: Response
    Controller-->>Client: 201 Created
```

## 2. 알림 발송

```mermaid
sequenceDiagram
    participant Admin as Admin Client
    participant Controller as NotificationController<br/>(Adapter In)
    participant UseCase as SendNotificationUseCase<br/>(Application Port In)
    participant Service as NotificationService<br/>(Application)
    participant Domain as Notification<br/>(Domain)
    participant SubRepo as SubscriptionRepository<br/>(Port Out)
    participant NotiRepo as NotificationRepository<br/>(Port Out)
    participant FCMPort as FCMClient<br/>(Port Out)
    participant FCMAdapter as FCMAdapter<br/>(Adapter Out)
    participant FCM as Firebase Cloud Messaging

    Admin->>Controller: POST /api/notifications<br/>{title, body, type}
    Controller->>UseCase: send(command)
    UseCase->>Service: send(title, body, type)

    Service->>Domain: new Notification(title, body, type)
    Domain-->>Service: Notification 객체

    Service->>NotiRepo: save(notification)
    NotiRepo-->>Service: saved

    Service->>SubRepo: findAllActiveTokens()
    SubRepo-->>Service: List<String> tokens

    Service->>FCMPort: sendMulticast(tokens, notification)
    FCMPort->>FCMAdapter: sendMulticast(tokens, notification)
    FCMAdapter->>FCM: HTTP POST (Firebase Admin SDK)
    FCM-->>FCMAdapter: BatchResponse
    FCMAdapter-->>FCMPort: SendResult
    FCMPort-->>Service: SendResult

    Service-->>UseCase: NotificationResult
    UseCase-->>Controller: Response
    Controller-->>Admin: 200 OK {sentCount, failCount}
```

## 3. 패키지 구조

```
backend/src/main/java/com/busapp/
├── domain/
│   ├── Notification.java
│   ├── NotificationType.java
│   └── Subscription.java
│
├── application/
│   ├── port/
│   │   ├── in/
│   │   │   ├── SendNotificationUseCase.java
│   │   │   └── SubscribeUseCase.java
│   │   └── out/
│   │       ├── NotificationRepository.java
│   │       ├── SubscriptionRepository.java
│   │       └── FCMClient.java          # Firebase 발송 포트
│   └── service/
│       ├── NotificationService.java
│       └── SubscriptionService.java
│
└── adapter/
    ├── in/
    │   └── web/
    │       └── NotificationController.java
    └── out/
        ├── persistence/
        │   ├── NotificationPersistenceAdapter.java
        │   └── SubscriptionPersistenceAdapter.java
        └── fcm/
            └── FCMAdapter.java          # Firebase Admin SDK
```

## 4. 핵심 인터페이스

### Port In (UseCase)
```java
public interface SendNotificationUseCase {
    NotificationResult send(String title, String body, NotificationType type);
}

public interface SubscribeUseCase {
    Long subscribe(String token, String deviceInfo);
    void unsubscribe(String token);
}
```

### Port Out (외부 시스템)
```java
public interface FCMClient {
    SendResult sendMulticast(List<String> tokens, Notification notification);
}

public interface SubscriptionRepository {
    Subscription save(Subscription subscription);
    List<String> findAllActiveTokens();
    void deleteByToken(String token);
}
```

## 5. 의존성 방향

```
┌─────────────────────────────────────────────────────────┐
│                    Adapter (In)                         │
│                  NotificationController                 │
└─────────────────────────┬───────────────────────────────┘
                          │ depends on
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Application (Port In)                   │
│            SendNotificationUseCase (interface)          │
└─────────────────────────┬───────────────────────────────┘
                          │ implemented by
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Application (Service)                   │
│                 NotificationService                     │
│                          │                              │
│          depends on Domain + Port Out                   │
└───────────┬─────────────┴─────────────┬─────────────────┘
            │                           │
            ▼                           ▼
┌───────────────────────┐   ┌─────────────────────────────┐
│       Domain          │   │    Application (Port Out)   │
│     Notification      │   │  FCMClient, Repository      │
│    (no dependency)    │   │       (interfaces)          │
└───────────────────────┘   └─────────────┬───────────────┘
                                          │ implemented by
                                          ▼
                            ┌─────────────────────────────┐
                            │      Adapter (Out)          │
                            │  FCMAdapter, JpaAdapter     │
                            └─────────────────────────────┘
```
