# LovePin

커플의 장소·기록을 남기는 서비스입니다. 모노레포로 **백엔드(Spring Boot)** 와 **프론트(React + Vite)** 가 함께 있습니다.

## 배포 URL (dev)

| 구분 | URL |
|------|-----|
| **프론트 (웹)** | https://lovepin.hee.io.kr |
| **API (백엔드)** | https://lovepin-api.hee.io.kr |

- 로컬 프론트: http://localhost:5173
- API 경로 예: `GET https://lovepin-api.hee.io.kr/api/members/health`

프론트에서 API를 호출하려면 백엔드 CORS에 프론트 Origin(`https://lovepin.hee.io.kr`)이 허용되어 있어야 합니다.

## 레포 구조

| 경로 | 설명 |
|------|------|
| `src/main/java/` | Spring Boot API (Elastic Beanstalk 배포) |
| `frontend/` | React 19 + TypeScript + Vite (S3 + CloudFront 배포) |
| `.github/workflows/` | `deploy.yml`(백엔드), `deploy-frontend.yml`(프론트) |

## 시작하기

### 백엔드

JDK 17, Gradle. `dev` 브랜치 push 시 EB로 자동 배포됩니다. (워크플로: `.github/workflows/deploy.yml`)

### 프론트

```bash
cd frontend
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

환경 변수·배포·시크릿: [frontend/README.md](./frontend/README.md), [frontend/DEPLOY.md](./frontend/DEPLOY.md)

## CI/CD 요약

| 대상 | 트리거 | 브랜치 |
|------|--------|--------|
| 백엔드 EB | `src/**` 등 변경 push | `dev` |
| 프론트 S3 | `frontend/**` 변경 push | `dev` |

## 환경 변수 (프론트만)

| 변수 | 로컬 | GitHub Actions (배포 빌드) |
|------|------|---------------------------|
| `VITE_API_BASE_URL` | `frontend/.env` (git 제외) | Secret `VITE_API_BASE_URL` 권장 |

`.env`를 gitignore에 넣은 것은 **로컬 개발용**으로 맞습니다. 배포 파이프라인은 Actions 러너에서 빌드하므로, 팀 시크릿에 `VITE_API_BASE_URL`을 두는 것이 좋습니다. (없으면 빌드 시 API 주소가 비어 배포 번들이 잘못될 수 있습니다.)
