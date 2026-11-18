const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab and Shift+Tab inside a container (dialogs and open menus). Call from the container's
 * onKeyDown handler.
 */
export function trapFocus(
  event: { key: string; shiftKey: boolean; preventDefault(): void },
  container: HTMLElement | null,
): void {
  if (event.key !== "Tab" || !container) return;
  const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
  if (items.length === 0) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
