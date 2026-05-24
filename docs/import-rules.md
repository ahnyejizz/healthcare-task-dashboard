# Import Rules

프로젝트 전반의 import는 아래 순서로 정리한다.

## 1. 기본 순서

1. `external`
2. `app`
3. `entities`
4. `features`
5. `shared`
6. `widgets`
7. `relative`

## 2. 그룹 기준

- `external`: `react`, `next`, `@tanstack/*`, `zod`, `msw` 등 외부 패키지
- `app`: `@/app/*`
- `entities`: `@/entities/*`
- `features`: `@/features/*`
- `shared`: `@/shared/*`
- `widgets`: `@/widgets/*`
- `relative`: `./`, `../` 로 시작하는 상대 경로 및 CSS 같은 side-effect import

## 3. 작성 규칙

- 과도한 레이어 주석을 방지하기 위해, FSD 레이어 import가 모두 1개씩만 존재하는 경우에는 주석을 생략한다.
- `external` 그룹은 파일 최상단의 기본 그룹으로 보고 주석을 생략한다.
- `relative` 그룹은 CSS 같은 side-effect import가 많지 않으므로 주석을 생략한다.
- `import type`은 일반 import와 분리하지 않고, 같은 그룹 안에서 함께 정렬한다.
- 같은 그룹 내부의 import 순서는 기존 흐름을 최대한 유지하고, 불필요한 재정렬은 피한다.

## 4. 예시

```ts
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";

import { TaskCard } from "@/entities/task/ui/task-card";

// shared
import type { TaskItem } from "@/shared/api/api-types";
import { pageMeta } from "@/shared/config/page-meta";
import { cn } from "@/shared/lib/cn";
import { Panel } from "@/shared/ui/panel";

// widgets
import {
  type SearchField,
  type TaskFilter,
  type TaskListViewMode,
  type TaskSortOrder,
} from "@/widgets/task-list/model/task-list-controls";
```

## 5. 목적

- import 블록만 봐도 파일이 어떤 레이어에 의존하는지 바로 파악할 수 있도록 한다.
- 같은 레이어가 섞여 들어가는 것을 줄여 가독성을 높인다.
- 같이 일하는 개발자가 처음 봐도 코드 구조를 빠르게 이해할 수 있도록 정렬 기준을 통일한다.
