# LovePin 프론트엔드

React 19 · TypeScript · Vite 8 기반입니다.

## 스택

- **React Router** — 클라이언트 라우팅 (`src/routes/Router.tsx`)
- **Axios** — API 클라이언트 (`src/apis/client.ts`, `VITE_API_BASE_URL` 사용)
- **Tailwind CSS v4** — 유틸리티 스타일 (`@tailwindcss/vite`)

## 시작하기

```bash
cd frontend
npm install
```

### 환경 변수

1. `frontend/.env.example`을 참고해 `frontend/.env`를 만듭니다. (이미 있으면 생략)
2. `VITE_API_BASE_URL`에 백엔드 API 베이스 URL을 넣습니다.  
   예: `VITE_API_BASE_URL=http://lovepin-api.ap-northeast-2.elasticbeanstalk.com`  
   `.env`는 Git에 올리지 않습니다. 팀원은 각자 로컬에만 둡니다.

### 개발 서버

```bash
npm run dev
```

### 빌드 · 미리보기

```bash
npm run build
npm run preview
```

### 린트

```bash
npm run lint
```

## Tailwind CSS

- Vite 플러그인 `@tailwindcss/vite`로 연결되어 있습니다 (`vite.config.ts`).
- 전역 스타일은 `src/index.css` 맨 위의 `@import 'tailwindcss';` 이후에 이어서 작성하면 됩니다.
- 컴포넌트에서는 `className`에 Tailwind 유틸 클래스를 사용합니다.

```tsx
<div className="flex min-h-screen items-center justify-center bg-slate-50">
  <p className="text-lg font-medium text-slate-800">예시</p>
</div>
```

디자인 토큰을 CSS 변수로 맞추고 싶다면 [Tailwind 테마 문서](https://tailwindcss.com/docs/theme)의 `@theme`를 `index.css`에서 활용할 수 있습니다.

## 폴더 구조 (요약)

| 경로 | 설명 |
|------|------|
| `src/pages/` | 라우트별 페이지 |
| `src/routes/` | `BrowserRouter` 및 `Routes` 정의 |
| `src/apis/` | Axios 인스턴스 및 API 모듈 |

## 배포

프론트는 백엔드(EB)와 **별도**로 S3에 올립니다. CI/CD·시크릿·CORS 설정은 [DEPLOY.md](./DEPLOY.md)를 참고하세요.

## 참고

- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
