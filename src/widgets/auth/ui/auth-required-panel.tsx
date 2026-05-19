import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
import { LoginIcon } from "@/shared/ui/icons";
import { Panel } from "@/shared/ui/panel";

export function AuthRequiredPanel() {
  return (
    <Panel
      title="이 화면은 로그인 후 이용할 수 있습니다."
      description="LNB 구조는 그대로 유지하고, 콘텐츠 영역만 로그인 여부에 따라 분기처리 하였습니다."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <article className="relative overflow-hidden rounded-[28px] border border-border bg-white px-6 py-7 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-primary text-white shadow-[0_16px_32px_rgba(252,175,24,0.22)]">
              <LoginIcon className="size-7" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                로그인하면 대시보드와 할 일 화면을 바로 이어서 볼 수 있어요.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
                현재는 비로그인 상태라 오른쪽 콘텐츠만 잠겨 있습니다. 
                <br/>
                로그인하면 대시보드, 할 일 목록, 회원정보가 같은 레이아웃 안에서 바로 열립니다.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-border/80 bg-surface p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
                Dashboard
              </p>
              <p className="mt-2 text-sm leading-6 text-text">
                전체 할 일 현황 확인
              </p>
            </div>
            <div className="rounded-[22px] border border-border/80 bg-surface p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
                Tasks
              </p>
              <p className="mt-2 text-sm leading-6 text-text">
                목록과 상세 화면 이동
              </p>
            </div>
            <div className="rounded-[22px] border border-border/80 bg-surface p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
                Account
              </p>
              <p className="mt-2 text-sm leading-6 text-text">
                회원 이메일 확인
              </p>
            </div>
          </div>
        </article>

        <aside className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,245,221,0.92),rgba(255,255,255,0.98))] p-6 lg:p-7">
          <p className="text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
            Quick Access
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-text">
            로그인 후 전체 기능을 사용할 수 있습니다.
          </h3>
          <div className="mt-6 rounded-[22px] border border-border/70 bg-white/90 p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
              Test Account
            </p>
            <p className="mt-3 text-sm text-text-muted">이메일</p>
            <p className="mt-1 text-base font-semibold text-text">
              test@naver.com
            </p>
            <p className="mt-4 text-sm text-text-muted">비밀번호</p>
            <p className="mt-1 text-base font-semibold text-text">
              frontend2026
            </p>
          </div>
          <div className="mt-6">
            <ButtonLink href={routes.signIn} className="w-full">
              로그인하러 가기
            </ButtonLink>
          </div>
        </aside>
      </div>
    </Panel>
  );
}
