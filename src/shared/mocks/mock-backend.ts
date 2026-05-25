/**
 * @page  - [공통 Mock]
 * @title - Mock 인증 모듈
 * @desc  - mock JWT 생성, 파싱, Bearer 및 refresh 토큰 기반 인증 처리를 제공
 */
export * from "@/shared/mocks/mock-auth";

/**
 * @page  - [공통 Mock]
 * @title - Mock 데이터 응답 모듈
 * @desc  - fixture와 메모리 저장소를 기반으로 사용자, 대시보드, 태스크 응답 데이터를 생성
 */
export * from "@/shared/mocks/mock-data";

/**
 * @page  - [공통 Mock]
 * @title - Mock 에러 응답 모듈
 * @desc  - MSW 및 Route Handler에서 공통으로 사용하는 mock 에러 응답 객체를 생성
 */
export * from "@/shared/mocks/mock-errors";
