import { z } from "zod";

/**
 * @page  - [로그인]
 * @title - 로그인 스키마 상수
 * @desc  - 로그인 입력값 검증 규칙 정의
 */
export const signInSchema = z.object({
  email: z.email("이메일 형식이 올바르지 않습니다."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(24, "비밀번호는 24자 이하여야 합니다.")
    .regex(/^[A-Za-z0-9]+$/, "비밀번호는 영문과 숫자로만 구성되어야 합니다."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
