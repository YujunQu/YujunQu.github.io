import { logoutAction } from "@/lib/server-actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="secondary-button">
        退出登录
      </button>
    </form>
  );
}
