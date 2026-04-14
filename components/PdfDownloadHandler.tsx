"use client";

import PdfDownloadButton from "@/components/PdfDownloadButton";

type PdfDownloadHandlerProps = {
  fileName: string;
  accessToken: string;
  petitionToken?: string;
  petitionText?: string;
  autoStart: boolean;
  disabled: boolean;
  onError: (message: string) => void;
};

export default function PdfDownloadHandler({
  fileName,
  accessToken,
  petitionToken,
  petitionText,
  autoStart,
  disabled,
  onError,
}: PdfDownloadHandlerProps) {
  return (
    <PdfDownloadButton
      fileName={fileName}
      accessToken={accessToken}
      petitionToken={petitionToken}
      petitionText={petitionText}
      autoStart={autoStart}
      onError={onError}
      disabled={disabled}
    />
  );
}
