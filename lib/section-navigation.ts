import type { MouseEvent } from "react";

let cancelPendingNavigation: (() => void) | undefined;

export function handleSectionLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const hash = event.currentTarget.hash;
  if (!document.getElementById(hash.slice(1))) return;

  event.preventDefault();
  navigateToSection(hash);
}

export function navigateToSection(hash: string) {
  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  cancelPendingNavigation?.();
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);

  if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });

  const hasPendingContent = () => Array.from(document.querySelectorAll("[data-deferred-section]")).some(
    (element) => target.contains(element) || Boolean(element.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING),
  );
  if (typeof ResizeObserver === "undefined" || !hasPendingContent()) return;

  let targetTop = target.getBoundingClientRect().top + window.scrollY;
  const cancelOn = ["wheel", "touchstart", "pointerdown", "keydown", "popstate", "hashchange", "pagehide"] as const;
  const cancel = () => {
    observer.disconnect();
    cancelOn.forEach((type) => window.removeEventListener(type, cancel));
    if (cancelPendingNavigation === cancel) cancelPendingNavigation = undefined;
  };
  const observer = new ResizeObserver(() => {
    if (!target.isConnected || window.location.hash !== hash) {
      cancel();
      return;
    }

    const nextTop = target.getBoundingClientRect().top + window.scrollY;
    // Only a layout shift above the destination needs correction, not scrolling
    // or a resize below it. Explicit user interaction always ends this session.
    if (Math.abs(nextTop - targetTop) > 1) {
      targetTop = nextTop;
      target.scrollIntoView({ behavior: "instant", block: "start" });
    }
    if (!hasPendingContent()) cancel();
  });

  observer.observe(document.body);
  cancelOn.forEach((type) => window.addEventListener(type, cancel, { passive: true }));
  cancelPendingNavigation = cancel;
}
