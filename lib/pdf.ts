import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_TOP = 42.5;
const MARGIN_BOTTOM = 42.5;
const MARGIN_LEFT = 36.85;
const MARGIN_RIGHT = 42.5;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, size);

    if (width <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    let segment = "";
    for (const char of word) {
      const trial = `${segment}${char}`;
      if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
        segment = trial;
      } else {
        if (segment) {
          lines.push(segment);
        }
        segment = char;
      }
    }

    currentLine = segment;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function createPage(pdfDoc: PDFDocument) {
  return pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
}

function drawWrappedParagraph(
  pageRef: { page: PDFPage; cursorY: number },
  pdfDoc: PDFDocument,
  text: string,
  font: PDFFont,
  size: number,
  lineHeight: number,
  options?: { center?: boolean; right?: boolean; gapAfter?: number }
) {
  const lines = wrapText(text, font, size, CONTENT_WIDTH);

  for (const line of lines) {
    if (pageRef.cursorY < MARGIN_BOTTOM + lineHeight) {
      pageRef.page = createPage(pdfDoc);
      pageRef.cursorY = PAGE_HEIGHT - MARGIN_TOP;
    }

    let x = MARGIN_LEFT;
    const lineWidth = font.widthOfTextAtSize(line, size);

    if (options?.center) {
      x = MARGIN_LEFT + (CONTENT_WIDTH - lineWidth) / 2;
    } else if (options?.right) {
      x = PAGE_WIDTH - MARGIN_RIGHT - lineWidth;
    }

    pageRef.page.drawText(line, {
      x,
      y: pageRef.cursorY,
      size,
      font,
      color: rgb(0, 0, 0),
    });

    pageRef.cursorY -= lineHeight;
  }

  pageRef.cursorY -= options?.gapAfter ?? 3;
}

function parsePetitionParts(petition: string) {
  const lines = petition.split("\n");
  const titleIndex = lines.findIndex((line) => line.trim());
  const title = titleIndex >= 0 ? lines[titleIndex].trim() : "T.C.";
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

export async function buildPetitionPdf(petition: string) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const regularFontBytes = await readFile(
    path.join(process.cwd(), "public", "fonts", "times.ttf")
  );
  const boldFontBytes = await readFile(
    path.join(process.cwd(), "public", "fonts", "timesbd.ttf")
  );

  const regularFont = await pdfDoc.embedFont(regularFontBytes);
  const boldFont = await pdfDoc.embedFont(boldFontBytes);

  const { title, institution, bodyLines } = parsePetitionParts(petition);

  const pageRef = {
    page: createPage(pdfDoc),
    cursorY: PAGE_HEIGHT - MARGIN_TOP,
  };

  drawWrappedParagraph(pageRef, pdfDoc, title, boldFont, 14, 18, {
    center: true,
    gapAfter: 2,
  });

  if (institution.trim()) {
    drawWrappedParagraph(pageRef, pdfDoc, institution, boldFont, 13, 18, {
      center: true,
      gapAfter: 14,
    });
  }

  for (const rawLine of bodyLines) {
    const line = rawLine.trim();

    if (!line) {
      pageRef.cursorY -= 5;
      continue;
    }

    const isSectionTitle = [
      "Başvuran Bilgileri",
      "Açıklamalar",
      "Hukuki Nedenler",
      "Hukuki Gerekçe",
      "Talep",
      "Sonuç",
      "Sonuç ve İstem",
    ].includes(line);

    const isSubject = line.startsWith("KONU:");
    const isRight = line.startsWith("Tarih:") || line.startsWith("İmza:");

    drawWrappedParagraph(
      pageRef,
      pdfDoc,
      rawLine,
      isSectionTitle ? boldFont : regularFont,
      isSectionTitle ? 12 : 11,
      isSectionTitle ? 17 : 16,
      {
        right: isRight,
        gapAfter: isSectionTitle || isSubject ? 4 : 2,
      }
    );
  }

  return pdfDoc.save();
}
