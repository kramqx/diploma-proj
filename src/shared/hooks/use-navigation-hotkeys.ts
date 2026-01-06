import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

const NAV_MAP: Record<string, string> = {
  "alt+KeyO": "/dashboard",
  "alt+KeyR": "/dashboard/repo",
  "alt+KeyS": "/dashboard/setting",
  "alt+KeyP": "/dashboard/settings?tab=profile",
  "alt+KeyB": "/dashboard/settings?tab=billing",
  "alt+KeyA": "/dashboard/settings?tab=api-keys",
};

export function useNavigationHotkeys(onAction?: () => void) {
  const router = useRouter();

  const hotkeys = Object.keys(NAV_MAP).join(", ");

  return useHotkeys(
    hotkeys,
    (e) => {
      const fullKey = `${e.altKey ? "alt+" : ""}${e.code}`;
      const path = NAV_MAP[fullKey];

      if (path) {
        e.preventDefault();
        onAction?.();
        router.push(path as Route);
      }
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );
}
