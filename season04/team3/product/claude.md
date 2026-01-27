# 서울/경기 버스 파업 알림 앱 - 기술 스택 스펙

## 개요

| 구분 | 기술 |
|------|------|
| **Backend** | Spring Boot 3.4.x + Java 21 |
| **Frontend** | React 18 + TypeScript 5.x |
| **Database** | PostgreSQL 16 + Redis 7 |
| **Infra** | AWS (EC2, RDS, ElastiCache) |

---

## Backend (Spring Boot)

### 핵심 기술

| 기술 | 버전 | 용도 |
|------|------|------|
| **Java** | 21 (LTS) | 프로그래밍 언어 |
| **Spring Boot** | 3.4.x | 애플리케이션 프레임워크 |
| **Spring Framework** | 6.2.x | 코어 프레임워크 |
| **Gradle** | 8.x | 빌드 도구 |

### 주요 의존성

| 라이브러리 | 용도 |
|------------|------|
| **spring-boot-starter-web** | REST API 개발 |
| **spring-boot-starter-data-jpa** | JPA/Hibernate ORM |
| **spring-boot-starter-security** | 인증/인가 |
| **spring-boot-starter-validation** | 요청 검증 |
| **spring-boot-starter-cache** | 캐싱 |
| **spring-boot-starter-actuator** | 모니터링/헬스체크 |

### 추가 라이브러리

| 라이브러리 | 버전 | 용도 |
|------------|------|------|
| **jjwt** | 0.12.x | JWT 토큰 처리 |
| **firebase-admin** | 9.x | FCM 푸시 알림 |
| **springdoc-openapi** | 2.x | Swagger API 문서 |
| **querydsl** | 5.x | 동적 쿼리 |
| **mapstruct** | 1.5.x | DTO 매핑 |
| **lombok** | 1.18.x | 보일러플레이트 제거 |

### build.gradle.kts (예시)

```kotlin
plugins {
    java
    id("org.springframework.boot") version "3.4.1"
    id("io.spring.dependency-management") version "1.1.7"
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

    // Firebase
    implementation("com.google.firebase:firebase-admin:9.3.0")

    // API Docs
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.7.0")

    // QueryDSL
    implementation("com.querydsl:querydsl-jpa:5.1.0:jakarta")
    annotationProcessor("com.querydsl:querydsl-apt:5.1.0:jakarta")

    // MapStruct
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")

    // Lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // Database
    runtimeOnly("org.postgresql:postgresql")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
}
```

### Java 21 주요 기능 활용

| 기능 | 설명 | 활용 |
|------|------|------|
| **Virtual Threads** | 경량 스레드 | 대용량 동시 요청 처리 |
| **Record Patterns** | 패턴 매칭 | DTO 처리 간소화 |
| **Sequenced Collections** | 순서 컬렉션 | 데이터 처리 |
| **String Templates** (Preview) | 문자열 템플릿 | 로그/메시지 생성 |

### 패키지 구조

```
backend/
└── src/main/java/com/busapp/
    ├── BusAppApplication.java
    ├── domain/
    │   ├── user/
    │   ├── strike/
    │   ├── route/
    │   └── notification/
    ├── global/
    │   ├── config/
    │   ├── security/
    │   ├── exception/
    │   └── common/
    └── infra/
        ├── firebase/
        ├── redis/
        └── external/
```

---

## Frontend (React + TypeScript)

### 핵심 기술

| 기술 | 버전 | 용도 |
|------|------|------|
| **React** | 18.3.x | UI 라이브러리 |
| **TypeScript** | 5.7.x | 타입 안전성 |
| **Vite** | 6.x | 빌드 도구 |
| **Node.js** | 20.x (LTS) | 런타임 |

### 주요 라이브러리

| 라이브러리 | 버전 | 용도 |
|------------|------|------|
| **react-router-dom** | 7.x | 라우팅 |
| **@tanstack/react-query** | 5.x | 서버 상태 관리 |
| **zustand** | 5.x | 클라이언트 상태 관리 |
| **axios** | 1.7.x | HTTP 클라이언트 |
| **tailwindcss** | 3.4.x | 스타일링 |
| **shadcn/ui** | latest | UI 컴포넌트 |
| **react-hook-form** | 7.x | 폼 관리 |
| **zod** | 3.x | 스키마 검증 |

### 지도/위치 관련

| 라이브러리 | 용도 |
|------------|------|
| **react-kakao-maps-sdk** | 카카오맵 연동 |
| **@react-google-maps/api** | 구글맵 (대안) |

### package.json (예시)

```json
{
  "name": "bus-strike-app-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1",
    "@tanstack/react-query": "^5.62.8",
    "zustand": "^5.0.2",
    "axios": "^1.7.9",
    "react-hook-form": "^7.54.2",
    "zod": "^3.24.1",
    "@hookform/resolvers": "^3.9.1",
    "react-kakao-maps-sdk": "^1.1.27",
    "date-fns": "^4.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@typescript-eslint/eslint-plugin": "^8.19.1",
    "@typescript-eslint/parser": "^8.19.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.18.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.0.7",
    "vitest": "^2.1.8"
  }
}
```

### 폴더 구조

```
frontend/
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── api/                 # API 호출
│   │   ├── client.ts
│   │   ├── strikes.ts
│   │   └── routes.ts
│   ├── components/          # 공통 컴포넌트
│   │   ├── ui/
│   │   └── layout/
│   ├── features/            # 기능별 모듈
│   │   ├── auth/
│   │   ├── strikes/
│   │   ├── routes/
│   │   └── map/
│   ├── hooks/               # 커스텀 훅
│   ├── stores/              # Zustand 스토어
│   ├── types/               # 타입 정의
│   ├── utils/               # 유틸리티
│   └── styles/              # 글로벌 스타일
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Database

### PostgreSQL 16

| 항목 | 설정 |
|------|------|
| **버전** | 16.x |
| **인코딩** | UTF-8 |
| **타임존** | Asia/Seoul |

### Redis 7

| 항목 | 설정 |
|------|------|
| **버전** | 7.x |
| **용도** | 캐싱, 세션, 실시간 데이터 |

---

## 인프라 (AWS)

| 서비스 | 용도 |
|--------|------|
| **EC2** | 애플리케이션 서버 |
| **RDS** | PostgreSQL |
| **ElastiCache** | Redis |
| **S3** | 정적 파일 저장 |
| **CloudFront** | CDN |
| **Route 53** | DNS |
| **ACM** | SSL 인증서 |

---

## 개발 환경

| 도구 | 권장 |
|------|------|
| **IDE** | IntelliJ IDEA (Backend), VS Code (Frontend) |
| **JDK** | Amazon Corretto 21 또는 Eclipse Temurin 21 |
| **Docker** | 로컬 DB 및 Redis |
| **Git** | 버전 관리 |

### Docker Compose (로컬 개발)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: busapp
      POSTGRES_USER: busapp
      POSTGRES_PASSWORD: busapp123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 참고 자료

- [Spring Boot 공식 문서](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
