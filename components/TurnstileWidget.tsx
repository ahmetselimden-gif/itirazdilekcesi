"use client";

import { Turnstile } from "next-turnstile";

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
  if (!siteKey) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-soft p-4">
      <p className="mb-3 text-sm font-semibold text-navy">Güvenlik doğrulaması</p>
      <Turnstile
        siteKey={siteKey}
        onVerify={onVerify}
        onExpire={onExpire}
        onError={onExpire}
        theme="light"
        size="flexible"
      />
    </div>
  );
}
