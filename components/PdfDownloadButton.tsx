"use client";

type PdfDownloadButtonProps = {
  fileName: string;
  disabled?: boolean;
  accessToken?: string;
  petitionToken?: string;
};

const buttonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-surface px-5 text-sm font-bold text-navy transition duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-55";

export default function PdfDownloadButton({
  fileName,
  disabled = false,
  accessToken = "",
  petitionToken = "",
}: PdfDownloadButtonProps) {
  const handleDownload = async () => {
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
  };

  return (
    <button type="button" className={buttonClassName} onClick={handleDownload} disabled={disabled}>
      PDF indir
    </button>
  );
}
