type ClassValue = false | null | string | undefined;

/**
 * @page  - [공통 유틸]
 * @title - 클래스 조합 함수
 * @desc  - 조건부 className 문자열을 공백 기준으로 조합
 */
export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}
