# healthcare-task-dashboard

Next.js App Router 기반의 태스크 대시보드 프로젝트 골격입니다. 요구사항 문서와 기술스택을 반영해 `TypeScript`, `Tailwind CSS`, `react-hook-form`, `MSW`, `React Query`, FSD 스타일 디렉터리 구성을 기본값으로 잡았습니다.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- react-hook-form + zod
- MSW
- TanStack React Query
- TanStack Virtual

## Getting Started

```bash
nvm use
npm install
npm run msw:init
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## Environment

프로젝트는 `Node.js >= 20.9.0`을 기준으로 맞춰져 있습니다.

```bash
NEXT_PUBLIC_ENABLE_MSW=true
```

개발 환경에서는 값을 따로 넣지 않아도 MSW가 기본 활성화됩니다.
필요할 때만 `NEXT_PUBLIC_ENABLE_MSW=false`로 끌 수 있습니다.

## Structure

```text
src
├── app
├── entities
├── features
├── shared
└── widgets
```

## Documents

- `docs/PRD.md`: 프로젝트 요구사항 기반 PRD
- `openapi.yaml`: API 계약 원문
- `AI_USAGE.md`: AI 활용 내역 초안

## Notes

- 현재는 초기 세팅 단계라 일부 페이지는 스캐폴딩 위주로 구성했습니다.
- 상세 구현 시 `/task` 목록에는 `TanStack Virtual + React Query infinite query`를 연결할 예정입니다.
