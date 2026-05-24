# healthcare-task-dashboard

- Next.js App Router 기반의 태스크 대시보드 프로젝트
- [로그인] → [대시보드] → [할 일 목록] → [할 일 상세] → [회원정보] 흐름

## 프로젝트 개요

**기술 스택**

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack Query v5, TanStack Virtual v3
- react-hook-form, zod
- MSW v2
- ECharts

**아키텍처**  
FSD(Feature-Sliced Design) 구조 기반으로
`app / widgets / features / entities / shared` 레이어 사용

**API 구성**  
MSW 기반 모킹 환경과 Next.js Route Handler 기반 API를 함께 구성
`NEXT_PUBLIC_ENABLE_MSW=true`일 때 MSW가 활성화

## 개발 명령어

```bash
npm install
nvm use
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
```

## 실행 환경

프로젝트는 `Node.js >= 20.9.0` 기준으로 작성

```bash
NEXT_PUBLIC_ENABLE_MSW=true
```

개발 환경에서는 값을 따로 넣지 않아도 MSW가 기본 활성화되며,
필요할 때만 `NEXT_PUBLIC_ENABLE_MSW=false`로 비활성화 가능

## 라우트 맵

| 경로         | 설명       | 레이아웃 그룹 |
| ------------ | ---------- | ------------- |
| `/`          | 대시보드   | `(protected)` |
| `/task`      | 할 일 목록 | `(protected)` |
| `/task/[id]` | 할 일 상세 | `(protected)` |
| `/user`      | 회원정보   | `(protected)` |
| `/sign-in`   | 로그인     | `(public)`    |

[로그인]
![로그인 화면 1](/readme/login/login1.png)
![로그인 화면 2](/readme/login/login2.png)

[대시보드]
![대시보드 화면 1](/readme/dashboard/dashboard1.png)
![대시보드 화면 2](/readme/dashboard/dashboard2.png)

[할 일 목록]
![할 일 목록 화면 1](/readme/task-list/task-list1.png)
![할 일 목록 화면 2](/readme/task-list/task-list2.png)
![할 일 목록 화면 3](/readme/task-list/task-list3.png)
![할 일 목록 화면 4](/readme/task-list/task-list4.png)
![할 일 목록 화면 5](/readme/task-list/task-list6.png)

[할 일 상세]
![할 일 상세 화면 1](/readme/task-detail/task-detail1.png)
![할 일 상세 화면 2](/readme/task-detail/task-detail2.png)
![할 일 상세 화면 3](/readme/task-detail/task-detail3.png)
![할 일 상세 화면 4](/readme/task-detail/task-detail4.png)

[회원정보], [로그아웃]
![회원정보 화면 1](/readme/user/user1.png)
![회원정보 화면 2](/readme/user/user2.png)


## 디렉토리 구조

```text
src/
  app/
    (protected)/
      layout.tsx          # 보호 라우트 공통 레이아웃
      page.tsx            # [대시보드] 라우트 진입점
      task/
        page.tsx          # [할 일 목록] 라우트 진입점
      task/[id]/
        page.tsx          # [할 일 상세] 라우트 진입점
      user/
        page.tsx          # [회원정보] 라우트 진입점
    (public)/
      sign-in/
        page.tsx          # [로그인] 라우트 진입점
    api/
      dashboard/route.ts  # [대시보드] API Route Handler
      refresh/route.ts    # 토큰 재발급 API Route Handler
      session/route.ts    # 세션 조회 API Route Handler
      sign-in/route.ts    # [로그인] API Route Handler
      sign-out/route.ts   # [로그아웃] API Route Handler
      task/route.ts       # [할 일 목록] API Route Handler
      task/[id]/route.ts  # [할 일 상세] 삭제 API Route Handler
      user/route.ts       # [회원정보] API Route Handler
    favicon.ico           # favicon
    globals.css           # CSS 토큰 + Tailwind + Pretendard import
    layout.tsx            # 루트 레이아웃
    providers.tsx         # 전역 provider 조합
  entities/
    task/
      ui/
        task-card.tsx     # [할 일 목록] 카드형 / 리스트형 태스크 표현 컴포넌트
  features/
    auth/
      sign-in/
        model/
          sign-in-schema.ts  # [로그인] 폼 검증 스키마
        ui/
          sign-in-page.tsx   # [로그인] 화면 UI
    task/
      delete-task/
        ui/
          delete-task-dialog.tsx      # [할 일 상세] 삭제 확인 다이얼로그
  shared/
    api/
      auth-storage.ts                 # accessToken 저장/구독 처리
      auth.ts                         # 로그인 / 로그아웃 API
      contracts.ts                    # API 응답/요청 타입 정의
      http.ts                         # 공통 fetch 래퍼 및 에러 처리
      mock-backend.ts                 # mock backend 동작 및 fixture 조합
      query-keys.ts                   # React Query key 정의
      tasks.ts                        # 할 일 목록 조회, 상세 조회, 삭제 요청 API
      user.ts                         # 회원정보 / 세션 API
    config/
      page-meta.ts                    # 페이지 메타 정보
      routes.ts                       # 라우트 상수 및 네비게이션 정보
    lib/
      cn.ts                           # className 병합 유틸
      download-chart-as-image.ts      # 차트 다운로드용 이미지 생성 유틸
      format-date-time.ts             # 날짜/시간 포맷 유틸
    mocks/
      browser.ts                      # MSW browser worker 설정
      handlers.ts                     # MSW 핸들러 정의
      data/
        seed.ts                       # mock seed / fixture 데이터
    ui/
      button/
        button.tsx                    # 공통 버튼 / 링크 버튼
        view-toggle-button.tsx        # 뷰 토글 버튼
      dialog/
        confirm-dialog.tsx            # 확인 다이얼로그
        dialog.tsx                    # 공통 다이얼로그 베이스
      loading/
        loading-overlay.tsx           # 전체화면 오버레이 로딩 UI
        loading-spinner.tsx           # 공통 로딩 스피너
      icons.tsx                       # 공통 아이콘 모음
      input.tsx                       # 공통 입력 컴포넌트
      panel.tsx                       # 공통 패널 레이아웃
      select-option-list.tsx          # 옵션 선택 리스트
      status-badge.tsx                # 상태 배지
      tooltip.tsx                     # 공통 툴팁
  widgets/
    auth/
      ui/
        access-token-gate.tsx         # 인증 상태 감시 및 진입 제어
        auth-required-panel.tsx       # 인증 필요 안내 패널
    dashboard/
      model/
        dashboard-model.ts            # [대시보드] 차트 메타 및 공유 타입
      ui/
        dashboard-page.tsx            # [대시보드] 페이지 메인
        metric-card.tsx               # [대시보드] 페이지 지표 카드
        chart/
          chart-card.tsx              # [대시보드] 페이지 차트 카드 + 다운로드 액션
          chart-card-header.tsx       # [대시보드] 페이지 차트 헤더
          chart-legend.tsx            # [대시보드] 페이지 차트 범례
          chart-options.ts            # [대시보드] 페이지 차트 옵션 조합
          options/
            comparison-count-option.ts  # [대시보드] 페이지 비교 건수 차트 옵션
            comparison-ratio-option.ts  # [대시보드] 페이지 비교 비율 차트 옵션
            completion-gauge-option.ts  # [대시보드] 페이지 완료율 게이지 옵션
            distribution-option.ts      # [대시보드] 페이지 분포 차트 옵션
            option-context.ts           # [대시보드] 페이지 차트 공통 옵션 컨텍스트
    navigation/
      ui/
        app-shell.tsx                   # 전체 앱 레이아웃
        navigation.tsx                  # 좌측 네비게이션
    task-detail/
      ui/
        task-detail-page.tsx            # [할 일 상세] 페이지 데이터 처리
        task-detail-view.tsx            # [할 일 상세] 페이지 UI
    task-list/
      model/
        task-list-controls.ts           # [할 일 목록] 페이지 필터/검색/정렬/뷰모드 타입 및 옵션
      ui/
        task-list-page.tsx              # [할 일 목록] 페이지 데이터 처리
        task-list-view.tsx              # [할 일 목록] 페이지 UI
        controls/
          filter-dropdown.tsx           # [할 일 목록] 페이지 필터 드롭다운 컴포넌트
          search-input.tsx              # [할 일 목록] 페이지 검색 입력 컴포넌트
          sort-toggle.tsx               # [할 일 목록] 페이지 정렬 토글 컴포넌트
          view-toggle.tsx               # [할 일 목록] 페이지 카드/리스트 뷰 전환 컴포넌트
    user-profile/
      ui/
        user-profile-card.tsx           # [회원정보] 페이지 카드 UI
        user-profile-page.tsx           # [회원정보] 페이지 데이터 처리
```

## 색상 토큰

- 모든 색상은 `globals.css`의 CSS 변수로 관리되며 Tailwind에 인라인 테마로 연결
- Tailwind 클래스에서는 `bg-primary`, `text-text-muted`, `border-border` 형태로 사용

주요 토큰:

- `--color-primary`: `#fcaf18`
- `--color-text`: `#172033`
- `--color-text-muted`: `#61708c`
- `--color-disabled`: `#a4afc3`
- `--color-danger`: `#d14343`
- `--color-success`: `#0d8a57`

## 인증 전략

- `accessToken`: 클라이언트 측 저장 (`src/shared/api/auth-storage.ts`)
- `refreshToken`: 쿠키 기반 저장 (`token` 쿠키명)
- 만료 시 `/api/refresh`를 통해 자동 재발급
- `AccessTokenGate`가 인증 상태를 감시하고, 미인증 상태에서는 로그인 유도 화면 표시

## MSW 모킹

- `NEXT_PUBLIC_ENABLE_MSW=true` 환경변수로 활성화
- 핸들러: `src/shared/mocks/handlers.ts`
- 시드 데이터: `src/shared/mocks/data/seed.ts`
- 커버 범위: `sign-in`, `refresh`, `sign-out`, `session`, `user`, `dashboard`, `task list`, `task detail`, `task delete`

## API 계약

- `docs/openapi.yaml` (OAS 3.1) 기준
- 원본 명세 외에 아래 API 추가
- `POST /api/sign-out`: 로그아웃 및 쿠키 제거
- `GET /api/session`: 세션 정보 조회 (회원정보 페이지에서 email 데이터 보여주기 위함)

## 추가 고려 항목 및 정리 사항

[대시보드]
- ECharts 도입 및 차트 렌더 전 로딩스피너 추가 및 공통화
- 차트별 옵션 파일 분리 및 툴팁/범례 공통 UI 설계
- 차트 hover 시 다운로드 아이콘 노출 및 이미지 다운로드 기능 제공

[할 일 목록, 할 일 상세]
- 할 일 상세 → 할 일 목록 `돌아가기` 버튼 추가
- 긴 메모의 경우 `말줄임표` 및 `툴팁` 처리
- 전체, TODO, DONE 상태값에 따른 `필터링` 기능 제공
- (`/api/task` 응답에는 TODO, DONE 상태값이 모두 포함되지만, `해야할 일`이라는 페이지 특성과 사용자 편의성을 고려해 TODO 상태 태스크를 기본으로 노출하고, 전체 및 DONE 상태도 볼 수 있도록 `필터링` 기능 제공)
- 태스크 ID 오름차순, 내림차순에 따른 `정렬` 기능 제공
- 태스크 ID, 태스크명, 메모 key에 따른 `검색` 기능 제공
- 상세/목록 화면을 `카드형, 리스트형` 형태로 볼 수 있도록 제공

[회원정보]
- `UserResponse`에는 `mail`, `memo`만 포함되므로, 이메일은 세션 정보에서 별도 조회해 화면에서 함께 제공

[공통]
- Prettier 설정 추가
- 로그아웃 기능 추가 및 로그아웃 확인 알럿창 추가
- API 로딩 시 전체화면 오버레이 로딩바 추가 및 공통화
- 동일 여백 템플릿 추가 및 공통 적용
- 컴포넌트 분리: 필터링/정렬/검색/뷰모드 제어 UI 분리
- 파일명만 봐도 메인 페이지 역할을 알 수 있도록 명명 규칙 정리 (-page.tsx)
- `desc` 주석 관리를 위한 문서 추가 및 규칙 적용
- `import` 정렬 및 레이어 주석 관리를 위한 문서 추가 및 규칙 적용

## 문서 및 코드 스타일 규칙

- Prettier 설정: `.prettierrc.json`
- ESLint 설정: `eslint.config.mjs`
- 경로 별칭: `@/` → `src/`

### JSDoc 규칙

`docs/comment-rules.md` 참고

```ts
/**
 * @page  - [레이어별 페이지명]
 * @title - 컴포넌트 한 줄 설명
 * @desc  - 역할 상세 (데이터 흐름, 액션 등)
 */
```

### Import 규칙

`docs/import-rules.md` 참고

- import는 `external → app → entities → features → shared → widgets → relative` 순서로 정리
- FSD 레이어 import는 가독성을 위해 레이어 주석 기준에 맞춰 정리
- 같은 그룹 내부 순서는 기존 흐름을 최대한 유지하고, 불필요한 재정렬은 피함

## 관련 문서

- `docs/PRD.md`: 프로젝트 요구사항 기반 PRD
- `docs/openapi.yaml`: API 명세서
- `docs/comment-rules.md`: JSDoc / desc 주석 규칙
- `docs/import-rules.md`: import 정렬 규칙
- `docs/AI_USAGE.md`: AI 활용 내역
