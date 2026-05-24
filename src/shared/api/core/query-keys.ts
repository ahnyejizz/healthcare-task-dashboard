/**
 * @page  - [공통 API]
 * @title - React Query 키 상수
 * @desc  - 캐시 키 불일치를 방지하기 위한 중앙 관리 쿼리 키
 *
 * [queryKey가 없는 페이지]
 * - /sign-in (로그인): 데이터를 조회(GET)하는 게 아니라 자격증명을 서버에 제출(POST)하는 동작이므로
 *   useQuery 대신 react-hook-form의 handleSubmit + 직접 API 호출로 처리함
 *   (실제 서비스라면 useMutation 사용 권장)
 *
 * - /task (할 일 목록): useQuery가 아닌 useInfiniteQuery를 사용하므로 위 queryKeys와 별도 맥락.
 *   useQuery는 단건 fetch용이고, useInfiniteQuery는 페이지를 누적해서 불러오는 무한 스크롤 전용임
 *   queryKey 자체는 동일하게 이 파일의 taskList를 공유함
 */
export const queryKeys = {
  // 실제 서비스라면 userId, 기간(range), 조직/프로젝트 식별자 등을 포함해 조건별 캐시를 분리하는 편이 안전함
  dashboard: ["dashboard"] as const,
  /*
  실제 서비스 예시:
  dashboard: (userId: string, range: "week" | "month") =>
    ["dashboard", userId, range] as const
  → 같은 사용자의 주간/월간 대시보드가 서로 다른 캐시로 관리됨
  */

  // 실제 서비스라면 userId를 키에 포함해야 하지만, 과제 특성상 유저 1명만 조회하므로 고정값 사용
  user: ["user"] as const,
  /*
  실제 서비스 예시:
  user: (userId: string) => ["user", userId] as const
  → 유저마다 별도 캐시로 관리되어 다른 계정으로 전환 시 캐시가 섞이지 않음
  */

  // 실제 서비스라면 필터·정렬·검색 파라미터도 키에 포함해 서버 측 필터링을 해야 하지만, 과제 특성상 클라이언트 측 필터링으로 처리하므로 initialPage만 포함
  taskList: (initialPage: number) => ["tasks", initialPage] as const,
  /*
  실제 서비스 예시:
  taskList: (page: number, filter: string, sort: string, search: string) =>
    ["tasks", page, filter, sort, search] as const
  → filter="done", sort="asc", search="김" 이면 ["tasks", 1, "done", "asc", "김"] 로 캐싱
  → 조건이 바뀔 때마다 서버에 재요청하고 각각 별도 캐시로 관리됨
  */

  // 항목 삭제 후 목록 캐시 전체 무효화용 prefix 키 — 무한 스크롤 특성상 삭제된 항목이 몇 번째 페이지에 있는지 알 수 없고, 삭제 후 뒤 페이지 항목이 앞으로 당겨지므로 전체를 날리는 것이 안전함
  taskListPrefix: ["tasks"] as const,

  taskDetail: (id: string) => ["task-detail", id] as const,
};
