# GitHub Secrets 설정 가이드

이 프로젝트의 CI/CD 파이프라인을 사용하려면 GitHub Repository Settings > Secrets and variables > Actions에 다음 시크릿을 등록하세요.

## 필수 시크릿

| 이름 | 설명 |
|------|------|
| `AWS_ACCESS_KEY_ID` | AWS IAM 액세스 키 ID |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM 시크릿 액세스 키 |
| `ECR_REGISTRY` | ECR 레지스트리 주소 (예: 123456789.dkr.ecr.ap-northeast-2.amazonaws.com) |
| `EC2_HOST` | EC2 인스턴스 퍼블릭 IP 또는 도메인 |
| `EC2_USER` | EC2 SSH 사용자 (예: ec2-user, ubuntu) |
| `EC2_SSH_KEY` | EC2 SSH 프라이빗 키 (PEM 파일 내용 전체) |
| `DB_URL` | PostgreSQL JDBC URL (예: jdbc:postgresql://rds-endpoint:5432/crossfitkorea) |
| `DB_USERNAME` | 데이터베이스 사용자명 |
| `DB_PASSWORD` | 데이터베이스 비밀번호 |
| `JWT_SECRET` | JWT 서명 시크릿 키 (32자 이상) |
| `S3_BUCKET` | S3 버킷 이름 |
| `NEXT_PUBLIC_API_URL` | 프론트엔드에서 사용할 백엔드 API URL |
| `KAKAO_MAP_KEY` | 카카오맵 API 키 |
| `TOSS_CLIENT_KEY` | 토스페이먼츠 클라이언트 키 |

## 워크플로우 설명

- **ci.yml**: `main`, `develop` 브랜치 push 또는 `main`으로의 PR 시 백엔드 테스트, 빌드, 프론트엔드 빌드 검증
- **deploy.yml**: `main` 브랜치 push 시 ECR 이미지 빌드 후 EC2 자동 배포
- **pr-check.yml**: PR 생성/수정 시 컴파일 및 타입 체크 자동 검사
