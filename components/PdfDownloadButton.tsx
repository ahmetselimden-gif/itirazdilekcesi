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
  const iframeIdRef = useRef(`pdf-download-frame-${Math.random().toString(36).slice(2)}`);

  const handleDownload = useCallback(() => {
    if (disabled || !accessToken || !petitionToken) {
      return;
    }

    let iframe = document.getElementById(iframeIdRef.current) as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = iframeIdRef.current;
      iframe.name = iframeIdRef.current;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/payments/download";
    form.target = iframeIdRef.current;
    form.style.display = "none";

    const accessInput = document.createElement("input");
    accessInput.type = "hidden";
    accessInput.name = "access";
    accessInput.value = accessToken;
    form.appendChild(accessInput);

    const petitionInput = document.createElement("input");
    petitionInput.type = "hidden";
    petitionInput.name = "petition";
    petitionInput.value = petitionToken;
    form.appendChild(petitionInput);

    document.body.appendChild(form);
    form.submit();
    form.remove();
  }, [disabled, accessToken, petitionToken]);

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
    <button
      type="button"
      className={buttonClassName}
      onClick={handleDownload}
      disabled={disabled}
      aria-label={fileName}
    >
      PDF indir
    </button>
  );
}
