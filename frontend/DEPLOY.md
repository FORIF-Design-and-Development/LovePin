# LovePin 프론트 배포 (S3 + GitHub Actions)

백엔드와 같이 **AWS + GitHub Actions**를 쓰는 방식입니다. (Vercel/Amplify 콘솔 설정 없이 레포만으로 CI/CD)

## 구조

| 구분 | 배포 대상 | 트리거 |
|------|-----------|--------|
| 백엔드 | Elastic Beanstalk | `dev` push + `src/**` 등 변경 |
| 프론트 | S3 (`dist/` 정적 파일) | `dev` push + `frontend/**` 변경 |

연동: 빌드 시 `VITE_API_BASE_URL` → 배포된 EB API 주소.  
배포 후 **백엔드 CORS**에 프론트 URL을 추가해야 브라우저에서 API 호출 가능.

---

## 1. AWS 1회 설정 (백엔드/인프라 담당)

### S3 버킷

1. 리전: 백엔드와 동일 (`ap-northeast-2` 권장)
2. 버킷 이름 예: `lovepin-frontend` (전역 유일 이름 필요)
3. **정적 웹 사이트 호스팅** 활성화  
   - 인덱스 문서: `index.html`  
   - 오류 문서: `index.html` (React Router SPA용)
4. 버킷 정책: 퍼블릭 읽기 또는 CloudFront OAC 사용

### (권장) CloudFront

- Origin: 위 S3 버킷
- HTTPS URL 예: `https://d1234abcd.cloudfront.net`
- SPA: 403/404 → `/index.html` (200) 커스텀 에러 응답

### IAM

기존 GitHub Actions용 IAM 사용자에 추가 권한:

- `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` (프론트 버킷)
- (CloudFront 사용 시) `cloudfront:CreateInvalidation`

---

## 2. GitHub Secrets (저장소 Settings → Secrets)

백엔드와 **공유**:

| Secret | 예시 |
|--------|------|
| `AWS_ACCESS_KEY_ID` | (기존) |
| `AWS_SECRET_ACCESS_KEY` | (기존) |
| `AWS_REGION` | `ap-northeast-2` |

**프론트 추가**:

| Secret | 값 |
|--------|-----|
| `VITE_API_BASE_URL` | `http://lovepin-api.ap-northeast-2.elasticbeanstalk.com` |
| `FRONTEND_S3_BUCKET` | `lovepin-frontend` (실제 버킷명) |
| `CLOUDFRONT_DISTRIBUTION_ID` | (선택) CloudFront 배포 ID |

---

## 3. 백엔드 CORS (필수)

`WebConfig.java`의 `allowedOrigins`에 **배포된 프론트 Origin** 추가:

```java
.allowedOrigins(
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://YOUR-CLOUDFRONT-DOMAIN.cloudfront.net"  // 또는 S3 웹사이트 URL
)
```

HTTPS CloudFront를 쓰면 **http가 아닌 https Origin**을 넣어야 합니다.

---

## 4. 배포 방법

`dev` 브랜치에 `frontend/` 변경을 push하면  
`.github/workflows/deploy-frontend.yml` 이 자동 실행됩니다.

로컬에서 빌드만 확인:

```bash
cd frontend
npm ci
# Windows PowerShell
$env:VITE_API_BASE_URL="http://lovepin-api.ap-northeast-2.elasticbeanstalk.com"
npm run build
```

---

## 5. 접속 URL

- CloudFront 있음: `https://xxxx.cloudfront.net`
- S3 웹사이트만: `http://버킷명.s3-website.ap-northeast-2.amazonaws.com`

팀에 공유할 **프론트 URL**은 위 중 하나입니다.
