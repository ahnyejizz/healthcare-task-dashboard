/**
 * @page  - [공통 유틸]
 * @title - 날짜 포맷 함수
 * @desc  - 날짜 문자열을 한국어 일시 형식으로 변환
 */
export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}
