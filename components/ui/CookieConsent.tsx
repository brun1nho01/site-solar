"use client";

import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  type AnalyticsConsent,
  getAnalyticsConsent,
  OPEN_COOKIE_PREFERENCES_EVENT,
  saveAnalyticsConsent,
  subscribeToAnalyticsConsent,
} from "@/lib/analytics-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface CookieConsentProps {
  gaId?: string;
}

export function CookieConsent({ gaId }: CookieConsentProps) {
  const analyticsConfigured = Boolean(gaId && gaId !== "G-XXXXXXX");
  const consent = useSyncExternalStore(subscribeToAnalyticsConsent, getAnalyticsConsent, () => null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const isOpen = preferencesOpen || (analyticsConfigured && consent === null);

  useEffect(() => {
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
  }, []);

  const chooseConsent = (value: AnalyticsConsent) => {
    if (value === "denied" && consent === "granted") {
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }

    saveAnalyticsConsent(value);
    setPreferencesOpen(false);
  };

  return (
    <>
      {analyticsConfigured && consent === "granted" && gaId ? (
        <GoogleAnalytics gaId={gaId} />
      ) : null}

      {isOpen ? (
        <div className="cookie-consent fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-3xl rounded-2xl border border-navy-900/10 bg-white/95 p-5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-navy-950/95 sm:p-6" role="dialog" aria-labelledby="cookie-consent-title">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent-copy">Privacidade</p>
              <h2 id="cookie-consent-title" className="text-lg font-bold text-navy-950 dark:text-white">
                {analyticsConfigured ? "Você decide sobre os dados de navegação" : "Cookies analíticos estão desativados"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-text-secondary">
                {analyticsConfigured
                  ? "Usamos o Google Analytics somente com sua autorização para entender o uso do site. A recusa não afeta o simulador nem o contato pelo WhatsApp."
                  : "Este site não está carregando o Google Analytics no momento. Apenas a sua preferência de privacidade pode ser salva neste navegador."}{" "}
                <Link href="/privacidade" className="font-semibold text-accent-copy underline-offset-4 hover:underline">Leia a política de privacidade.</Link>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              {analyticsConfigured ? (
                <>
                  <button type="button" onClick={() => chooseConsent("denied")} className="min-h-11 rounded-full border border-navy-900/15 px-5 py-2.5 text-sm font-bold text-navy-800 transition-colors hover:bg-navy-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10">Recusar</button>
                  <button type="button" onClick={() => chooseConsent("granted")} className="min-h-11 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950 shadow-lg transition-colors hover:bg-gold-400">Aceitar analíticos</button>
                </>
              ) : (
                <button type="button" onClick={() => setPreferencesOpen(false)} className="min-h-11 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-400">Fechar</button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
