const ACCESS_TOKEN_KEY = "healthcare-task-dashboard-access-token";
const ACCESS_TOKEN_CHANGE_EVENT = "healthcare-task-dashboard-access-token-change";

function notifyAccessTokenChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(ACCESS_TOKEN_CHANGE_EVENT));
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifyAccessTokenChange();
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  notifyAccessTokenChange();
}

export function subscribeToAccessTokenChange(
  onChange: (token: string | null) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== ACCESS_TOKEN_KEY) {
      return;
    }

    onChange(event.newValue);
  };

  const handleTokenChange = () => {
    onChange(getAccessToken());
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(ACCESS_TOKEN_CHANGE_EVENT, handleTokenChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ACCESS_TOKEN_CHANGE_EVENT, handleTokenChange);
  };
}
