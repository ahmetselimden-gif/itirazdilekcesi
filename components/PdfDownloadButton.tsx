"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PdfDownloadButtonProps = {
  fileName: string;
  disabled?: boolean;
  accessToken?: string;
  petitionToken?: string;
  petitionText?: string;
  autoStart?: boolean;
  onError?: (message: string) => void;
};

const buttonClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-navy bg-surface px-5 text-sm font-bold text-navy transition duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto";

export default function PdfDownloadButton({
  fileName,
  disabled = false,
  accessToken = "",
  petitionToken = "",
  petitionText = "",
  autoStart = false,
  onError,
}: PdfDownloadButtonProps) {
  const hasAutoStartedRef = useRef(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (disabled || isDownloading || !accessToken || !petitionToken) {
      return;
    }

    setIsDownloading(true);
    onError?.("");

    try {
      const response = await fetch("/api/payments/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access: accessToken,
          petition: petitionToken,
          editedPetition: petitionText,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        let message = "PDF indirilemedi.";

        if (contentType.includes("application/json")) {
          const data = (await response.json()) as { error?: string };
          message = data.error || message;
        } else {
          const text = await response.text();
          if (text) {
            message = text;
          }
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "PDF indirilirken beklenmeyen bir hata oluştu."
      );
    } finally {
      setIsDownloading(false);
    }
  }, [accessToken, disabled, fileName, isDownloading, onError, petitionText, petitionToken]);

  useEffect(() => {
    if (!autoStart || disabled || isDownloading || !accessToken || !petitionToken) {
      return;
    }

    if (hasAutoStartedRef.current) {
      return;
    }

    hasAutoStartedRef.current = true;
    void handleDownload();
  }, [autoStart, disabled, accessToken, petitionToken, handleDownload, isDownloading]);

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      aria-label={fileName}
    >
      {isDownloading ? "PDF hazırlanıyor..." : "PDF indir"}
    </button>
  );
}
