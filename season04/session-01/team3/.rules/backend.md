# Backend Rules

## Architecture: Hexagonal (Ports & Adapters)

```
src/main/java/com/busapp/
├── domain/                    # 핵심 비즈니스 로직 (외부 의존성 없음)
│   ├── Notification.java      # 도메인 엔티티
│   └── NotificationType.java  # 도메인 Enum
├── application/               # 유스케이스 레이어
│   └── port/
│       ├── in/                # Inbound Ports (유스케이스 인터페이스)
│       │   └── SendNotificationUseCase.java
│       └── out/               # Outbound Ports (외부 시스템 인터페이스)
│           └── NotificationRepository.java
├── adapter/                   # 어댑터 레이어
│   ├── in/
│   │   └── web/               # REST Controller (Inbound Adapter)
│   │       └── NotificationController.java
│   └── out/
│       └── persistence/       # JPA Repository (Outbound Adapter)
│           ├── NotificationJpaEntity.java
│           ├── NotificationJpaRepository.java
│           └── NotificationPersistenceAdapter.java
└── BusAppApplication.java
```

## TDD (Test-Driven Development)

### 개발 순서
1. **RED**: 실패하는 테스트 먼저 작성
2. **GREEN**: 테스트를 통과하는 최소한의 코드 작성
3. **REFACTOR**: 코드 리팩토링 (테스트는 계속 통과해야 함)

### 테스트 작성 규칙
- 모든 기능은 테스트 코드 먼저 작성
- 도메인 로직: 단위 테스트 필수
- 유스케이스: 단위 테스트 (Mock 사용)
- 컨트롤러: 통합 테스트 (@WebMvcTest)
- 리포지토리: @DataJpaTest

### 테스트 네이밍 컨벤션
```java
@Test
void should_SendNotification_When_ValidRequest() { }

@Test
void should_ThrowException_When_InvalidType() { }
```

### 커버리지 목표
- 도메인: 100%
- 유스케이스: 90% 이상
- 어댑터: 80% 이상

## 코딩 컨벤션

### 의존성 규칙
- Domain → 외부 의존성 없음 (순수 Java)
- Application → Domain만 의존
- Adapter → Application, Domain 의존 가능

### 패키지 간 의존성
```
adapter.in.web → application.port.in
adapter.out.persistence → application.port.out
application.port.in 구현체 → domain, application.port.out
```

### 명명 규칙
- UseCase: `~UseCase` (인터페이스)
- Service: `~Service` (UseCase 구현체)
- Port (out): `~Repository`, `~Client`
- Adapter: `~Controller`, `~PersistenceAdapter`

## 기술 스택
- Java 21
- Spring Boot 3.4.x
- MySQL 8
- JUnit 5 + Mockito
