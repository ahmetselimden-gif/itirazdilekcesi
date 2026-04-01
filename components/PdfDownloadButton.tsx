"use client";

type PdfDownloadButtonProps = {
  elementId: string;
  fileName: string;
  disabled?: boolean;
  accessToken?: string;
};

const buttonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-surface px-5 text-sm font-bold text-navy transition duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-55";

export default function PdfDownloadButton({
  elementId,
  fileName,
  disabled = false,
  accessToken = "",
}: PdfDownloadButtonProps) {
  const handleDownload = async () => {
    if (disabled || !accessToken) {
      return;
    }

    const verification = await fetch(
      `/api/payments/access?token=${encodeURIComponent(accessToken)}`
    );

    if (!verification.ok) {
      return;
    }

    const target = document.getElementById(elementId);

    if (!target) {
      return;
    }

    const html2pdf = (await import("html2pdf.js")).default;

    await html2pdf()
      .set({
        margin: [15, 15, 15, 15],
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(target)
      .save();
  };

  return (
    <button type="button" className={buttonClassName} onClick={handleDownload} disabled={disabled}>
      PDF indir
    </button>
  );
}
