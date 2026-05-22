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

## shared 레이어 규칙

- `shared/ui`      -> `[공통 UI]`
- `shared/api`     -> `[공통 API]`
- `shared/lib`     -> `[공통 유틸]`
- `shared/config`  -> `[공통 설정]`
- `shared/mocks`   -> `[공통 Mock]`

### Example

```ts
/**
 * @page  - [공통 UI]
 * @title - 패널 컴포넌트
 * @desc  - 제목, 설명, 우측 액션, 본문을 포함한 공통 패널 렌더링
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