"use client";

import { useCallback, useEffect, useRef } from "react";

type PdfDownloadButtonProps = {
  fileName: string;
  disabled?: boolean;
  accessToken?: string;
  petitionToken?: string;
  autoStart?: boolean;
};

const buttonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-surface px-5 text-sm font-bold text-navy transition duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-55";

export default function PdfDownloadButton({
  fileName,
  disabled = false,
  accessToken = "",
  petitionToken = "",
  autoStart = false,
}: PdfDownloadButtonProps) {
  const hasAutoStartedRef = useRef(false);

  const handleDownload = useCallback(async () => {
    if (disabled || !accessToken || !petitionToken) {
      return;
    }

    const response = await fetch(
      `/api/payments/download?access=${encodeURIComponent(accessToken)}&petition=${encodeURIComponent(petitionToken)}`
    );

    if (!response.ok) {
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }, [disabled, accessToken, petitionToken, fileName]);

  useEffect(() => {
    if (!autoStart || disabled || !accessToken || !petitionToken) {
      return;
    }

    if (hasAutoStartedRef.current) {
      return;
    }

    hasAutoStartedRef.current = true;
    void handleDownload();
  }, [autoStart, disabled, accessToken, petitionToken, handleDownload]);

  return (
    <button type="button" className={buttonClassName} onClick={handleDownload} disabled={disabled}>
      PDF indir
    </button>
  );
}
