# LovePin 프론트 배포 (S3 + GitHub Actions)

백엔드와 같이 **AWS + GitHub Actions**로 배포합니다.

## 배포 URL (dev, 현재)

| 구분 | URL |
|------|-----|
| **프론트 (사용자 접속)** | https://lovepin.hee.io.kr |
| **API** | https://lovepin-api.hee.io.kr |

멘토/인프라에서 설정한 값 (팀 내부 참고):

| 이름 | 용도 |
|------|------|
| `FRONTEND_S3_BUCKET` | GitHub Actions → `aws s3 sync` 대상 버킷 (예: `lovepin-frontend-dev`) |
| `FRONTEND_URL` | 팀 공유용 프론트 주소 (= 위 `https://lovepin.hee.io.kr`). 코드/시크릿 이름은 아님 |

---

## 구조

| 구분 | 배포 대상 | 트리거 |
|------|-----------|--------|
| 백엔드 | Elastic Beanstalk | `dev` push + `src/**` 등 변경 |
| 프론트 | S3 (`dist/` 정적 파일) → CloudFront → 커스텀 도메인 | `dev` push + `frontend/**` 변경 |

**연동**

1. 프론트 빌드 시 `VITE_API_BASE_URL` → `https://lovepin-api.hee.io.kr` (axios baseURL)
2. 백엔드 `WebConfig.java` CORS `allowedOrigins`에 프론트 Origin `https://lovepin.hee.io.kr` 포함

프론트 Origin과 API Origin은 **호스트가 다른 두 URL**입니다. 브라우저 cross-origin 규칙 때문에 CORS 설정이 필요합니다.

---

## 1. AWS (인프라 담당, 1회)

### S3 버킷

- 리전: `ap-northeast-2` 권장
- 버킷명: 팀에서 정한 이름 (예: `lovepin-frontend-dev`)
- SPA: 인덱스·오류 문서 `index.html`
- CloudFront Origin으로 연결

### CloudFront + 도메인

- Origin: 위 S3 버킷
- 커스텀 도메인·SSL: `https://lovepin.hee.io.kr`
- SPA: 403/404 → `/index.html` (200) 커스텀 에러 응답

### IAM (GitHub Actions용)

- `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` (프론트 버킷)
- (선택) `cloudfront:CreateInvalidation`

---

## 2. GitHub Secrets

**Settings → Secrets and variables → Actions**

### 백엔드·AWS 공통

| Secret | 예시 |
|--------|------|
| `AWS_ACCESS_KEY_ID` | (기존) |
| `AWS_SECRET_ACCESS_KEY` | (기존) |
| `AWS_REGION` | `ap-northeast-2` |

### 프론트 배포 필수

| Secret | 값 (현재 dev 기준) |
|--------|---------------------|
| `FRONTEND_S3_BUCKET` | 실제 S3 버킷명 (멘토 제공) |
| `VITE_API_BASE_URL` | `https://lovepin-api.hee.io.kr` |

### 프론트 배포 선택

| Secret | 값 |
|--------|-----|
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront 배포 ID (캐시 무효화) |

### 로컬 `.env` vs Secret

| | `frontend/.env` | GitHub Secret `VITE_API_BASE_URL` |
|--|-----------------|-----------------------------------|
| 용도 | `npm run dev`, 로컬 `npm run build` | Actions의 `npm run build` (S3에 올라가는 번들) |
| Git | **올리지 않음** (`.gitignore`) | 저장소 Secret에만 저장 |
| 필수 여부 | 로컬 개발 시 필수 | **CI 배포 시 권장·사실상 필수** |

`.env`를 gitignore에 넣은 것은 **보안·개인 설정 분리**로 올바릅니다. 다만 그것만으로는 **GitHub Actions 빌드에 API URL이 전달되지 않습니다.** 배포 프론트에 API 주소를 박으려면 Secret `VITE_API_BASE_URL`을 추가하세요.

워크플로 참고: `.github/workflows/deploy-frontend.yml` Build 단계의 `env.VITE_API_BASE_URL`.

---

## 3. 백엔드 CORS

`src/main/java/com/hanyang/lovepin/config/WebConfig.java`:

```java
.allowedOrigins(
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://lovepin.hee.io.kr"
)
```

- Origin은 **스킴+호스트+포트**만 (경로·슬래시 없음)
- 커스텀 도메인은 **https** 사용

`src/**` 변경을 `dev`에 머지하면 백엔드 EB 배포 워크플로가 실행됩니다.

---

## 4. 배포 방법

`dev`에 `frontend/` 또는 `deploy-frontend.yml` 변경을 push → **Deploy Frontend (S3)** 실행.

로컬 빌드 확인:

```bash
cd frontend
npm ci
```

```powershell
# Windows PowerShell
$env:VITE_API_BASE_URL="https://lovepin-api.hee.io.kr"
npm run build
```

---

## 5. 배포 후 확인

- [ ] https://lovepin.hee.io.kr 접속·라우팅(SPA) 정상
- [ ] 브라우저 Network에서 API 요청이 `lovepin-api.hee.io.kr`로 가고 CORS 오류 없음
- [ ] Secret `VITE_API_BASE_URL` 설정 후 프론트 재배포(필요 시)
