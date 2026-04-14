type PetitionDocumentProps = {
  petition: string;
  className?: string;
};

const SECTION_TITLES = new Set([
  "Başvuran Bilgileri",
  "Açıklamalar",
  "Hukuki Nedenler",
  "Hukuki Gerekçe",
  "Talep",
  "Sonuç",
  "Sonuç ve İstem",
]);

function getLineClassName(trimmed: string) {
  if (trimmed.startsWith("Konu:") || trimmed.startsWith("KONU:")) {
    return "petition-line petition-subject";
  }

  if (trimmed.startsWith("Tarih:") || trimmed.startsWith("İmza:")) {
    return "petition-line petition-signature-line";
  }

  return "petition-line";
}

function parsePetitionParts(petition: string) {
  const lines = petition.split("\n");
  const titleIndex = lines.findIndex((line) => line.trim());
  const title = titleIndex >= 0 ? lines[titleIndex].trim() : "";
  const institutionIndex = lines.findIndex(
    (line, index) => index > titleIndex && line.trim()
  );
  const institution = institutionIndex >= 0 ? lines[institutionIndex].trim() : "";
  const bodyLines =
    institutionIndex >= 0
      ? lines.slice(institutionIndex + 1)
      : lines.slice(Math.max(titleIndex + 1, 0));

  return {
    title,
    institution,
    bodyLines,
  };
}

export default function PetitionDocument({
  petition,
  className = "",
}: PetitionDocumentProps) {
  const { title, institution, bodyLines } = parsePetitionParts(petition);
  const filteredBodyLines = bodyLines.filter((line, index, arr) => {
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
        {filteredBodyLines.map((line, index) => {
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
