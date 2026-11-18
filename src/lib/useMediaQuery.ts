import { useCallback, useSyncExternalStore } from "react";

/**
 * Live `matchMedia` result. Always false on the server and during hydration, so the
 * server markup (the no-JS version) is what hydrates; the real value follows right after.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      // addListener: Safari < 14 has no addEventListener on MediaQueryList.
      if (list.addEventListener) list.addEventListener("change", onChange);
      else list.addListener(onChange);
      return () => {
        if (list.removeEventListener) list.removeEventListener("change", onChange);
        else list.removeListener(onChange);
      };
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
