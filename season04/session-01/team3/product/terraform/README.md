# Terraform - EC2 + Docker 구성

## 아키텍처 (최소 구성)

```
┌─────────────────────────────────────┐
│            EC2 (t3.small)           │
│  ┌─────────────────────────────┐   │
│  │      Docker Compose         │   │
│  │  ┌─────────┐ ┌──────────┐  │   │
│  │  │ Nginx   │ │ Spring   │  │   │
│  │  │:80      │ │ Boot:8080│  │   │
│  │  └─────────┘ └────┬─────┘  │   │
│  │                   │        │   │
│  │            ┌──────▼─────┐  │   │
│  │            │ PostgreSQL │  │   │
│  │            │ :5432      │  │   │
│  │            └────────────┘  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 예상 비용

| 리소스 | 스펙 | 비용 |
|--------|------|------|
| EC2 | t3.small | ~$15/월 |
| EBS | 30GB gp3 | ~$2.4/월 |
| EIP | 1개 | ~$3.6/월 |
| **합계** | | **~$21/월** |

## 배포

### 1. Terraform 실행
```bash
cd environments/dev
terraform init
terraform apply -var="key_name=your-key"
```

### 2. EC2 접속
```bash
ssh -i your-key.pem ec2-user@<PUBLIC_IP>
```

### 3. 앱 배포
```bash
# 프로젝트 클론
git clone <your-repo>
cd product

# Docker Compose 실행
docker-compose up -d --build
```

### 4. 확인
```
http://<PUBLIC_IP>
```

## 삭제
```bash
terraform destroy -var="key_name=your-key"
```
