# Comment Rules

## 목적

모든 export component/function에는 일관된 JSDoc을 작성한다.

## widgets 레이어 규칙

- 한 문장으로 간결하게 작성한다.
- 메인 역할을 하는 페이지 컴포넌트의 title에는 "~ 메인 페이지"를 명시한다.
- desc에는 데이터 처리 및 가공 후 하위 컴포넌트에 필요한 데이터를 전달하는 역할을 작성한다.

### Example

```ts
/**
 * @page  - [회원정보]
 * @title - 회원정보 메인 페이지
 * @desc  - 데이터 처리 및 가공 후 UserProfileCard 컴포넌트에 데이터 전달
 */
```

```ts
/**
 * @page  - [회원정보]
 * @title - 회원정보 카드 컴포넌트
 * @desc  - 프로필 정보 표시 + 로그아웃 액션 제공
 */
``;
```

## shared 레이어 규칙 (@page)

- `shared/ui`            -> `[공통 UI]`
- `shared/api/core`      -> `[공통 API]`
- `shared/api/endpoints` -> `[각 페이지명]`
- `shared/lib`           -> `[공통 유틸]`
- `shared/config`        -> `[공통 설정]`
- `shared/mocks`         -> `[공통 Mock]`

### Example

```ts
/**
 * @page  - [공통 UI]
 * @title - 패널 컴포넌트
 * @desc  - 제목, 설명, 우측 액션, 본문을 포함한 공통 패널 렌더링
 */
```

## entities 레이어 규칙

- 도메인 한 건의 표현 책임이 드러나도록 작성한다.
- 특정 화면 전용이 아니라 도메인 표현 단위임이 보이게 작성한다.
- `entities/task` -> `[할 일 목록]` 또는 `[공통]`

### Example

```ts
/**
 * @page  - [할 일 목록]
 * @title - 할 일 컴포넌트
 * @desc  - 태스크 ID, 태스크 명, 상태 뱃지, 메모 정보를 카드 또는 리스트 형태로 표시
 */
```

## features 레이어 규칙

- `features/auth` -> `[로그인]`
- `features/task` -> `[할 일 상세]`

### Example

```ts
/**
 * @page  - [로그인]
 * @title - 로그인 폼 컴포넌트
 * @desc  - 이메일/비밀번호 입력 및 로그인 제출 처리
 */
```

## app 레이어 규칙

- 애플리케이션 진입점, 라우팅, 레이아웃, 전역 설정 책임이 드러나도록 작성한다.
- `page.tsx`는 라우트 진입점임을 나타내기 위해 title에 "~ 라우트 페이지"로 명시한다.
- `providers`, `layout`은 전역 역할 중심으로 작성한다.
- API Route Handler는 title에 "~ Route Handler"로 명시한다.

### Example

```ts
/**
 * @page  - [대시보드]
 * @title - 대시보드 라우트 페이지
 * @desc  - 대시보드 라우트 진입점, 데이터를 DashboardPage 컴포넌트에 전달
 */
```