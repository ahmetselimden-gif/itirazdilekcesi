type PetitionDocumentProps = {
  petition: string;
  className?: string;
};

const SECTION_TITLES = new Set([
  "Başvuran Bilgileri",
  "Açıklamalar",
  "Hukuki Gerekçe",
  "Talep",
  "Sonuç",
]);

function getLineClassName(trimmed: string) {
  if (trimmed.startsWith("Konu:")) {
    return "petition-line petition-subject";
  }

  if (trimmed.startsWith("Tarih:") || trimmed.startsWith("İmza:")) {
    return "petition-line petition-signature-line";
  }

  return "petition-line";
}

export default function PetitionDocument({
  petition,
  className = "",
}: PetitionDocumentProps) {
  const lines = petition.split("\n");
  const title = lines[0] ?? "";
  const institution = lines[1] ?? "";
  const bodyLines = lines.slice(2).filter((line, index, arr) => {
    if (index === 0 && line.trim() === "") {
      return false;
    }

    return !(line.trim() === "" && arr[index - 1]?.trim() === "");
  });

  return (
    <div className={`petition-document ${className}`.trim()}>
      <div className="petition-header">
        <div className="petition-header-title">{title}</div>
        <div className="petition-header-institution">{institution}</div>
      </div>

      <div className="petition-body">
        {bodyLines.map((line, index) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={`${line}-${index}`} className="petition-gap" />;
          }

          if (SECTION_TITLES.has(trimmed)) {
            return (
              <h4 key={`${line}-${index}`} className="petition-section-title">
                {trimmed}
              </h4>
            );
          }

          return (
            <p key={`${line}-${index}`} className={getLineClassName(trimmed)}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
