import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

/**
 * While `active`, intercepts every way of leaving the current page and asks
 * for confirmation first:
 *  - in-app navigation (navigate(), <Link>, redirects)  -> custom dialog
 *  - plain same-origin <a href> clicks (header links)   -> custom dialog
 *  - browser back button                                 -> custom dialog
 *  - reload / close tab / typed URL                      -> browser's native
 *    "leave site?" prompt (browsers don't allow custom text there)
 *
 * BrowserRouter isn't a data router, so useBlocker isn't available: we wrap
 * the router's navigator instead (classic react-router v6 pattern).
 *
 * Returns `pending` (true when the dialog should be open), `confirm` (leave)
 * and `cancel` (stay), plus `guard(action)` to protect in-page actions such
 * as "redo the test".
 */
export function useLeaveGuard(active: boolean) {
  const { navigator } = useContext(UNSAFE_NavigationContext) as unknown as {
    navigator: { push: (...a: unknown[]) => void; replace: (...a: unknown[]) => void };
  };
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const bypass = useRef(false);

  useEffect(() => {
    if (!active) return;
    bypass.current = false;

    const push = navigator.push;
    const replace = navigator.replace;
    navigator.push = (...args) => {
      if (bypass.current) return push(...args);
      setPendingAction(() => () => push(...args));
    };
    navigator.replace = (...args) => {
      if (bypass.current) return replace(...args);
      setPendingAction(() => () => replace(...args));
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (bypass.current) return;
      e.preventDefault();
      e.returnValue = "";
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.protocol === "blob:") return;
      e.preventDefault();
      setPendingAction(() => () => window.location.assign(url.href));
    };

    // Back button: keep a duplicate history entry on top so "back" lands on
    // the same URL; we then restore it and ask.
    window.history.pushState({ leaveGuard: true }, "", window.location.href);
    const onPopState = () => {
      if (bypass.current) return;
      window.history.pushState({ leaveGuard: true }, "", window.location.href);
      setPendingAction(() => () => window.history.go(-2));
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      navigator.push = push;
      navigator.replace = replace;
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [active, navigator]);

  const confirm = useCallback(() => {
    const action = pendingAction;
    setPendingAction(null);
    bypass.current = true;
    action?.();
  }, [pendingAction]);

  const cancel = useCallback(() => setPendingAction(null), []);

  // Protect an in-page action (no navigation involved).
  const guard = useCallback(
    (action: () => void) => () => {
      if (!active) return action();
      setPendingAction(() => action);
    },
    [active],
  );

  return { pending: pendingAction !== null, confirm, cancel, guard };
}
