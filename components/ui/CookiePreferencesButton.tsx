"use client";

import { openCookiePreferences } from "@/lib/analytics-consent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="inline-flex min-h-11 items-center text-left text-subtle-copy transition-colors hover:text-accent-copy"
    >
      Preferências de cookies
    </button>
  );
}
