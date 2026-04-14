import OpenAI from "openai";

export type PetitionPanel = "kiraci" | "ev-sahibi";

export type HousingPetitionData = {
  fullName: string;
  tckn?: string;
  address: string;
  counterpartyName: string;
  rentedAddress: string;
  problemType: string;
  explanation: string;
  institution: string;
};

export type PetitionGenerationResult = {
  petition: string;
  evaluationLevel: "Düşük" | "Orta" | "Yüksek";
  evaluationComment: string;
  source: "openai" | "fallback";
};

function normalize(value: string | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function toUpper(value: string) {
  return value.toLocaleUpperCase("tr-TR");
}

export function sanitizeHousingPetitionData(
  data: Partial<HousingPetitionData>
): HousingPetitionData {
  return {
    fullName: normalize(data.fullName),
    tckn: normalize(data.tckn),
    address: normalize(data.address),
    counterpartyName: normalize(data.counterpartyName),
    rentedAddress: normalize(data.rentedAddress),
    problemType: normalize(data.problemType),
    explanation: normalize(data.explanation),
    institution: normalize(data.institution),
  };
}

export function validateHousingPetitionData(data: HousingPetitionData) {
  if (
    !data.fullName ||
    !data.address ||
    !data.counterpartyName ||
    !data.rentedAddress ||
    !data.problemType ||
    !data.explanation ||
    !data.institution
  ) {
    return "Lütfen zorunlu alanların tamamını doldurun.";
  }

  if (data.tckn && !/^\d{11}$/.test(data.tckn)) {
    return "TCKN yalnızca 11 haneli rakamlardan oluşmalıdır.";
  }

  return "";
}

function getPanelCopy(panel: PetitionPanel) {
  if (panel === "kiraci") {
    return {
      role: "kiracı",
      counterparty: "Ev Sahibi",
      subject:
        "kiracı tarafından kira uyuşmazlığına ilişkin itiraz ve talep dilekçesi sunulması",
      legal:
        "Türk Borçlar Kanunu, kira sözleşmesine ilişkin hükümler ve ilgili mevzuat.",
    };
  }

  return {
    role: "ev sahibi",
    counterparty: "Kiracı",
    subject:
      "ev sahibi tarafından kira uyuşmazlığına ilişkin itiraz ve talep dilekçesi sunulması",
    legal:
      "Türk Borçlar Kanunu, kira sözleşmesine ilişkin hükümler ve ilgili mevzuat.",
  };
}

function inferEvaluation(data: HousingPetitionData): Pick<
  PetitionGenerationResult,
  "evaluationLevel" | "evaluationComment"
> {
  const explanation = data.explanation.toLocaleLowerCase("tr-TR");
  let score = 1;

  if (data.explanation.length > 120) score += 1;
  if (/dekont|sözleşme|ihtar|fotoğraf|tutanak|mesaj|belge|ödeme/i.test(explanation)) {
    score += 1;
  }
  if (/tarih|gün|ay|yıl|tebliğ|bildirim/i.test(explanation)) {
    score += 1;
  }

  if (score >= 4) {
    return {
      evaluationLevel: "Yüksek",
      evaluationComment:
        "Girilen bilgiler olay, belge ve talep bakımından güçlü bir dilekçe zemini oluşturuyor.",
    };
  }

  if (score >= 2) {
    return {
      evaluationLevel: "Orta",
      evaluationComment:
        "Girilen bilgiler temel bir dilekçe zemini oluşturuyor. Tarih ve belge bilgileri artırılırsa metin güçlenir.",
    };
  }

  return {
    evaluationLevel: "Düşük",
    evaluationComment:
      "Açıklama kısa görünüyor. Olay tarihi, yazışmalar ve varsa belgeler eklenirse dilekçe daha güçlü olur.",
  };
}

export function buildHousingPrompt(panel: PetitionPanel, data: HousingPetitionData) {
  const copy = getPanelCopy(panel);

  return `
Sen kira hukuku uyuşmazlıkları için Türkçe dilekçe hazırlayan deneyimli bir hukuk asistanısın.
Kullanıcının verdiği bilgi ve olay anlatımına göre resmi, sade ve ölçülü bir dilekçe üret.

Kurallar:
- Cevabı yalnızca JSON ver.
- JSON dışında hiçbir açıklama yazma.
- Anahtarlar: petition, evaluationLevel, evaluationComment.
- evaluationLevel yalnızca şu üç değerden biri olsun: Düşük, Orta, Yüksek.
- petition alanı yalnızca dilekçe metni olsun.
- Kullanıcının anlatmadığı hiçbir olguyu uydurma.
- Belirsiz konularda kesin hüküm kurma.
- Dilekçe şu sırayla yazılsın:
  1. T.C.
  2. Kurum adı büyük harf
  3. KONU
  4. BAŞVURAN BİLGİLERİ
  5. AÇIKLAMALAR
  6. HUKUKİ NEDENLER
  7. SONUÇ VE İSTEM
  8. TARİH ve İMZA
- Metin tek sayfaya sığabilecek yoğunlukta, temiz ve ikna edici olsun.

Panel: ${copy.role}
Kurum: ${data.institution}
Konu mantığı: ${copy.subject}
Hukuki nedenler: ${copy.legal}

Kullanıcı verileri:
Ad Soyad: ${data.fullName}
TCKN: ${data.tckn || "Belirtilmedi"}
Adres: ${data.address}
${copy.counterparty}: ${data.counterpartyName}
Kiralanan Ev Adresi: ${data.rentedAddress}
Problem Türü: ${data.problemType}
Açıklama:
${data.explanation}
`.trim();
}

export function buildFallbackHousingResult(
  panel: PetitionPanel,
  data: HousingPetitionData
): PetitionGenerationResult {
  const copy = getPanelCopy(panel);
  const evaluation = inferEvaluation(data);

  return {
    petition: [
      "T.C.",
      toUpper(data.institution),
      "",
      `KONU: ${data.problemType} nedeniyle ${copy.subject}.`,
      "",
      "Başvuran Bilgileri",
      `Ad Soyad: ${data.fullName}`,
      data.tckn ? `TCKN: ${data.tckn}` : null,
      `Adres: ${data.address}`,
      `${copy.counterparty}: ${data.counterpartyName}`,
      `Kiralanan Ev Adresi: ${data.rentedAddress}`,
      "",
      "Açıklamalar",
      `Taraflar arasındaki kira ilişkisi kapsamında ${data.problemType} konusunda uyuşmazlık yaşanmaktadır.`,
      data.explanation,
      "",
      "Hukuki Nedenler",
      copy.legal,
      "",
      "Sonuç ve İstem",
      "Yukarıda arz edilen nedenlerle, başvurumun değerlendirilmesini, uyuşmazlık konusu hususta gerekli incelemenin yapılmasını ve talebim doğrultusunda karar verilmesini saygılarımla arz ve talep ederim.",
      "",
      "Tarih: .... / .... / ........",
      `İmza: ${data.fullName}`,
    ]
      .filter(Boolean)
      .join("\n"),
    evaluationLevel: evaluation.evaluationLevel,
    evaluationComment: evaluation.evaluationComment,
    source: "fallback",
  };
}

export async function generateHousingPetition(
  panel: PetitionPanel,
  data: HousingPetitionData
): Promise<PetitionGenerationResult> {
  const fallbackResult = buildFallbackHousingResult(panel, data);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackResult;
  }

  try {
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const response = await client.responses.create({
      model,
      input: buildHousingPrompt(panel, data),
    });

    const rawText = response.output_text?.trim();
    if (!rawText) {
      return fallbackResult;
    }

    const parsed = JSON.parse(rawText) as Partial<PetitionGenerationResult>;
    if (!parsed.petition || !parsed.evaluationLevel || !parsed.evaluationComment) {
      return fallbackResult;
    }

    return {
      petition: parsed.petition.trim(),
      evaluationLevel: parsed.evaluationLevel,
      evaluationComment: parsed.evaluationComment.trim(),
      source: "openai",
    };
  } catch (error) {
    console.error("Housing petition generation failed, fallback returned:", error);
    return fallbackResult;
  }
}
