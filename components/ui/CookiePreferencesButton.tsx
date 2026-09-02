"use client";

import { openCookiePreferences } from "@/lib/analytics-consent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="inline-flex min-h-11 items-center text-left text-navy-400 transition-colors hover:text-gold-500 dark:text-text-muted"
    >
      Preferências de cookies
    </button>
  );
}

