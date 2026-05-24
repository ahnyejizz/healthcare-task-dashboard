/**
 * @page  - [공통 API]
 * @title - React Query 키 상수
 * @desc  - 캐시 키 불일치를 방지하기 위한 중앙 관리 쿼리 키
 */
export const queryKeys = {
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
