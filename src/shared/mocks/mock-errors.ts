// shared
import type { ErrorResponse } from "@/shared/api/api-types";

/**
 * @page  - [공통 Mock]
 * @title - 인증 필요 에러 응답 함수
 * @desc  - 로그인 필요 상황에서 사용할 에러 응답 객체를 반환
 */
export function getUnauthorizedError(): ErrorResponse {
  return {
    errorMessage: "로그인이 필요합니다.",
  };
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 무효 에러 응답 함수
 * @desc  - 유효하지 않은 리프레시 토큰 상황의 에러 응답 객체를 반환
 */
export function getInvalidRefreshTokenError(): ErrorResponse {
  return {
    errorMessage: "리프레시 토큰이 유효하지 않습니다.",
  };
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 누락 에러 응답 함수
 * @desc  - 리프레시 토큰 쿠키가 없는 상황의 에러 응답 객체를 반환
 */
export function getMissingRefreshTokenError(): ErrorResponse {
  return {
    errorMessage: "리프레시 토큰이 없습니다.",
  };
}

/**
 * @page  - [로그인]
 * @title - 로그인 실패 에러 응답 함수
 * @desc  - 잘못된 로그인 자격증명 상황의 에러 응답 객체를 반환
 */
export function getInvalidCredentialsError(): ErrorResponse {
  return {
    errorMessage: "이메일 또는 비밀번호를 다시 확인해주세요.",
  };
}

/**
 * @page  - [할 일 목록]
 * @title - 잘못된 페이지 파라미터 에러 응답 함수
 * @desc  - page 쿼리 파라미터가 명세와 맞지 않는 상황의 에러 응답 객체를 반환
 */
export function getInvalidTaskPageError(): ErrorResponse {
  return {
    errorMessage: "page 파라미터는 1 이상의 정수여야 합니다.",
  };
}

/**
 * @page  - [할 일 상세]
 * @title - 할 일 미존재 에러 응답 함수
 * @desc  - 상세 조회 대상이 없는 경우 사용할 에러 응답 객체를 반환
 */
export function getTaskNotFoundError(): ErrorResponse {
  return {
    errorMessage: "해당 할 일을 찾을 수 없습니다.",
  };
}

/**
 * @page  - [할 일 상세]
 * @title - 할 일 삭제 불가 에러 응답 함수
 * @desc  - 이미 삭제되었거나 존재하지 않는 할 일 삭제 시도의 에러 응답 객체를 반환
 */
export function getDeleteTaskNotFoundError(): ErrorResponse {
  return {
    errorMessage: "이미 삭제되었거나 존재하지 않는 할 일입니다.",
  };
}
