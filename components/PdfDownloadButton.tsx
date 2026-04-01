"use client";

type PdfDownloadButtonProps = {
  elementId: string;
  fileName: string;
  disabled?: boolean;
};

export default function PdfDownloadButton({
  elementId,
  fileName,
  disabled = false,
}: PdfDownloadButtonProps) {
  const handleDownload = async () => {
    if (disabled) {
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
    <button
      type="button"
      className="secondary-button"
      onClick={handleDownload}
      disabled={disabled}
    >
      PDF indir
    </button>
  );
}
