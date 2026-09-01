export type AnalyticsConsent = "granted" | "denied";

export const ANALYTICS_CONSENT_STORAGE_KEY = "wlima.analytics-consent";
export const OPEN_COOKIE_PREFERENCES_EVENT = "wlima:open-cookie-preferences";
export const ANALYTICS_CONSENT_CHANGE_EVENT = "wlima:analytics-consent-change";

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  const savedValue = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  return savedValue === "granted" || savedValue === "denied" ? savedValue : null;
}

export function saveAnalyticsConsent(value: AnalyticsConsent) {
  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_CHANGE_EVENT));
}

export function subscribeToAnalyticsConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}
