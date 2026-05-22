import type { ComponentProps, SVGProps } from "react";
import { cn } from "@/shared/lib/cn";

type IconSvgProps = SVGProps<SVGSVGElement>;
type IconSpanProps = ComponentProps<"span">;

/**
 * @page  - [공통 UI]
 * @title - SVG 아이콘 베이스 컴포넌트
 * @desc  - 공통 SVG 속성이 적용된 아이콘 베이스 렌더링
 */
function BaseIcon(props: IconSvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * @page  - [공통 UI]
 * @title - 대시보드 아이콘 컴포넌트
 * @desc  - 대시보드 메뉴 아이콘 렌더링
 */
export function DashboardIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 13h6v7H4z" />
      <path d="M14 4h6v16h-6z" />
      <path d="M4 4h6v5H4z" />
      <path d="M14 14h6v6h-6z" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 홈 아이콘 컴포넌트
 * @desc  - 홈 이동용 아이콘 렌더링
 */
export function HomeIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M10 21v-6h4v6" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 할 일 아이콘 컴포넌트
 * @desc  - 할 일 메뉴 아이콘 렌더링
 */
export function TasksIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="m8 7 2 2 4-4" />
      <path d="M5 7h.01" />
      <path d="M5 12h.01" />
      <path d="M5 17h.01" />
      <path d="M9 12h10" />
      <path d="M9 17h10" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 사용자 아이콘 컴포넌트
 * @desc  - 사용자 프로필 아이콘 렌더링
 */
export function UserIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 로그인 아이콘 컴포넌트
 * @desc  - 로그인 액션 아이콘 렌더링
 */
export function LoginIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H4" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 로그아웃 아이콘 컴포넌트
 * @desc  - 로그아웃 액션 아이콘 렌더링
 */
export function LogoutIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="M14 17l5-5-5-5" />
      <path d="M19 12H9" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 뒤로가기 아이콘 컴포넌트
 * @desc  - 이전 화면 이동 아이콘 렌더링
 */
export function ArrowLeftIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 체크 아이콘 컴포넌트
 * @desc  - 선택 또는 완료 표시 아이콘 렌더링
 */
export function CheckIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 12 4.5 4.5L19 7" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 삭제 아이콘 컴포넌트
 * @desc  - 삭제 액션 아이콘 렌더링
 */
export function TrashIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 다운로드 아이콘 컴포넌트
 * @desc  - 이미지 저장 액션 아이콘 렌더링
 */
export function DownloadIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={cn("relative block h-[18px] w-[18px] shrink-0", className)}
      {...props}
    >
      <span className="absolute left-1/2 top-[1px] h-[10px] w-[2px] -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute left-1/2 top-[8px] h-[7px] w-[7px] -translate-x-1/2 rotate-45 border-r-[2px] border-b-[2px] border-current" />
      <span className="absolute bottom-[1px] left-1/2 h-[2px] w-[12px] -translate-x-1/2 rounded-full bg-current" />
    </span>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 헬스케어 로고 아이콘 컴포넌트
 * @desc  - 브랜드 로고 아이콘 렌더링
 */
export function HealthcareLogoIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 21s-6.8-4.1-8.7-8.3C1.8 9.4 3.5 5.8 7 5.2c2-.3 3.6.5 5 2.2 1.4-1.7 3-2.5 5-2.2 3.5.6 5.2 4.2 3.7 7.5C18.8 16.9 12 21 12 21Z" />
      <path d="M8 12h2.1l1.2-2.1 1.5 4.2 1.2-2.1H16" />
    </BaseIcon>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 필터 아이콘 컴포넌트
 * @desc  - 필터 드롭다운 버튼 아이콘 렌더링
 */
export function FilterIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={cn("relative block h-[18px] w-[18px] shrink-0", className)}
      {...props}
    >
      <span className="absolute left-1/2 top-[2px] h-[2px] w-[14px] -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute left-1/2 top-[5px] h-0 w-0 -translate-x-1/2 border-t-[7px] border-r-[5px] border-l-[5px] border-t-current border-r-transparent border-l-transparent" />
      <span className="absolute left-1/2 top-[12px] h-[5px] w-[3px] -translate-x-1/2 rounded-b-[2px] bg-current" />
    </span>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 정렬 아이콘 컴포넌트
 * @desc  - 정렬 기준 드롭다운 버튼 아이콘 렌더링
 */
export function SortIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={cn("relative block h-[18px] w-[18px] shrink-0", className)}
      {...props}
    >
      <span className="absolute left-[2px] top-[3px] h-[2px] w-[11px] rounded-full bg-current/85" />
      <span className="absolute left-[2px] top-[8px] h-[2px] w-[8px] rounded-full bg-current/85" />
      <span className="absolute left-[2px] top-[13px] h-[2px] w-[5px] rounded-full bg-current/85" />
      <span className="absolute right-[3px] top-[3px] h-[12px] w-[2px] rounded-full bg-current/85" />
      <span className="absolute right-[1px] top-[11px] h-[5px] w-[5px] rotate-45 border-r-[2px] border-b-[2px] border-current/85" />
    </span>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 정렬 방향 아이콘 컴포넌트
 * @desc  - 오름차순 또는 내림차순 방향 아이콘 렌더링
 */
export function SortDirectionIcon({
  className,
  direction,
  ...props
}: IconSpanProps & { direction: "asc" | "desc" }) {
  const isAscending = direction === "asc";

  return (
    <span
      className={cn("relative block h-[18px] w-[18px] shrink-0", className)}
      {...props}
    >
      <span className="absolute left-1/2 top-[2px] h-[14px] w-[2px] -translate-x-1/2 rounded-full bg-current/85" />
      <span
        className={cn(
          "absolute left-1/2 h-[5px] w-[5px] -translate-x-1/2 rotate-45 border-current/85",
          isAscending
            ? "top-[2px] border-t-[2px] border-l-[2px]"
            : "top-[10px] border-r-[2px] border-b-[2px]",
        )}
      />
    </span>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 카드형 보기 아이콘 컴포넌트
 * @desc  - 카드형 뷰 전환 아이콘 렌더링
 */
export function CardViewIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={cn(
        "grid h-4 w-4 shrink-0 grid-cols-2 grid-rows-2 gap-[2px] leading-none",
        className,
      )}
      {...props}
    >
      <span className="block h-full w-full rounded-[1px] border-[1.6px] border-current" />
      <span className="block h-full w-full rounded-[1px] border-[1.6px] border-current" />
      <span className="block h-full w-full rounded-[1px] border-[1.6px] border-current" />
      <span className="block h-full w-full rounded-[1px] border-[1.6px] border-current" />
    </span>
  );
}

/**
 * @page  - [공통 UI]
 * @title - 리스트형 보기 아이콘 컴포넌트
 * @desc  - 리스트형 뷰 전환 아이콘 렌더링
 */
export function ListViewIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={cn(
        "grid h-4 w-4 shrink-0 grid-rows-4 items-center gap-[2px] leading-none",
        className,
      )}
      {...props}
    >
      <span className="block h-px w-full rounded-full bg-current/75" />
      <span className="block h-px w-full rounded-full bg-current/75" />
      <span className="block h-px w-full rounded-full bg-current/75" />
      <span className="block h-px w-full rounded-full bg-current/75" />
    </span>
  );
}
