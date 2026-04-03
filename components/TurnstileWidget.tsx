"use client";

import Script from "next/script";
import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  siteKey?: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
};

export default function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
}: TurnstileWidgetProps) {
  const containerId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !window.turnstile) {
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    container.innerHTML = "";
    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: siteKey,
      theme: "light",
      callback: onVerify,
      "expired-callback": onExpire,
      "error-callback": onExpire,
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [containerId, onExpire, onVerify, siteKey]);

  if (!siteKey) {
    return null;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div className="rounded-2xl border border-line bg-surface-soft p-4">
        <p className="mb-3 text-sm font-semibold text-navy">Güvenlik doğrulaması</p>
        <div id={containerId} />
      </div>
    </>
  );
}
