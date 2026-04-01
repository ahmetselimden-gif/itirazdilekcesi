export type TrafficFormData = {
  fullName: string;
  tckn?: string;
  plate: string;
  penaltyDate: string;
  notificationDate: string;
  penaltyType: string;
  location: string;
  cameraStatus: string;
  institution: string;
  explanation: string;
};

export type TrafficGenerationResult = {
  petition: string;
  evaluationLevel: "Düşük" | "Orta" | "Yüksek";
  evaluationComment: string;
  source: "openai" | "fallback";
  petitionToken?: string;
};

function toTurkishUppercase(value: string) {
  return value.toLocaleUpperCase("tr-TR");
}

function getDistrictFromLocation(location: string) {
  const parts = location
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "NÖBETÇİ SULH CEZA HÂKİMLİĞİ'NE";
  }

  const district = parts[parts.length - 1];
  return `${toTurkishUppercase(district)} NÖBETÇİ SULH CEZA HÂKİMLİĞİ'NE`;
}

export function resolveInstitution(institution: string, location: string) {
  const cleaned = institution.trim();
  if (cleaned) {
    return cleaned;
  }

  return getDistrictFromLocation(location);
}

function normalizeExplanation(explanation: string) {
  return explanation.replace(/\s+/g, " ").trim();
}

function buildMeasuredExplanation(explanation: string) {
  const cleaned = normalizeExplanation(explanation);

  if (!cleaned) {
    return "Başvuru konusu idari para cezasına ilişkin işlemin dayanaklarının ve maddi vakıanın hukuki denetime elverişli şekilde incelenmesi talep edilmektedir.";
  }

  return `Başvuruya konu ceza işlemine ilişkin itiraz nedenleri başvuran tarafından "${cleaned}" şeklinde açıklanmıştır. Bu beyanların tutanak içeriği ve dosya kapsamı ile birlikte değerlendirilmesi talep edilmektedir.`;
}

function buildLegalReasoning(data: TrafficFormData) {
  const explanation = normalizeExplanation(data.explanation).toLocaleLowerCase("tr-TR");
  const reasons: string[] = [];

  reasons.push(
    "İdari yaptırıma dayanak teşkil eden tespitlerin somut, denetlenebilir ve yeterli delillerle desteklenmesi; isnadın kişi, araç, yer ve zaman bakımından tereddüde yer bırakmayacak açıklıkta ortaya konulması gerekir."
  );

  if (data.cameraStatus === "Bilmiyorum") {
    reasons.push(
      "Dosyada isnada dayanak teşkil eden teknik kayıt veya görsel delil bulunup bulunmadığının açık biçimde ortaya konulması önem arz etmektedir. İspat yükünün idarede olduğu gözetildiğinde, delil yapısının yeterliliği ayrıca değerlendirilmelidir."
    );
  } else if (data.cameraStatus === "Yok") {
    reasons.push(
      "İsnadın kamera, radar veya benzeri teknik kayıtlarla desteklenmemesi halinde tespitin hangi somut verilere dayandığının ayrıca açıklanması gerekir."
    );
  }

  if (data.penaltyType === "Hız ihlali") {
    reasons.push(
      "Hız ölçümüne dayanılan hallerde cihazın kalibrasyon durumu, tolerans hesabı ve ölçüm koşullarının mevzuata uygunluğu da değerlendirilmelidir."
    );
  }

  if (
    /yanlış|yanlis|haksız|haksiz|eksik|usul|tebliğ|teblig|delil|kamera|radar|plaka/i.test(
      explanation
    )
  ) {
    reasons.push(
      "Başvuru dilekçesinde ileri sürülen hususlar birlikte değerlendirildiğinde, işlemin maddi dayanağı ile usuli yönlerinin yeniden incelenmesi gerektiği anlaşılmaktadır."
    );
  }

  return reasons.join(" ");
}

function inferEvaluation(data: TrafficFormData) {
  const explanation = normalizeExplanation(data.explanation).toLocaleLowerCase("tr-TR");
  let score = 0;

  if (data.cameraStatus !== "Var") score += 1;
  if (data.penaltyType === "Hız ihlali") score += 1;
  if (
    /yanlış|yanlis|haksız|haksiz|eksik|usul|tebliğ|teblig|delil|kamera|radar|plaka/i.test(
      explanation
    )
  ) {
    score += 2;
  }

  if (score >= 4) {
    return {
      level: "Yüksek" as const,
      comment:
        "Girilen bilgiler, maddi tespit ve delil yapısı bakımından güçlü bir itiraz zemini oluşturuyor.",
    };
  }

  if (score >= 2) {
    return {
      level: "Orta" as const,
      comment:
        "Başvuru içeriği, ceza işlemine esas alınan tespitlerin ve usul süreçlerinin yeniden değerlendirilmesini gerektirebilecek noktalar içeriyor.",
    };
  }

  return {
    level: "Düşük" as const,
    comment:
      "Mevcut açıklama temel bir itiraz zemini sunuyor. Somut delil ve usul eksikliği daha açık belirtilirse itiraz gücü artabilir.",
  };
}

export function buildTrafficPrompt(data: TrafficFormData) {
  const resolvedInstitution = resolveInstitution(data.institution, data.location);

  return `
Sen trafik cezası itiraz dilekçeleri hazırlayan deneyimli bir hukuk asistanısın.
Kullanıcının verdiği bilgi ve olay anlatımına göre resmi Türkçe ile mantıklı, sade ve ölçülü bir dilekçe üret.

Kurallar:
- Cevabı yalnızca JSON ver.
- JSON dışında hiçbir açıklama yazma.
- Anahtarlar: petition, evaluationLevel, evaluationComment.
- evaluationLevel yalnızca şu üç değerden biri olsun: Düşük, Orta, Yüksek.
- petition alanı yalnızca dilekçe metni olsun.
- Kullanıcının anlatmadığı hiçbir olguyu uydurma.
- İlk açıklama paragrafında kullanıcı adına ayrı bir yorum üretme; kullanıcının beyanını nötr ve kısa hukuk diliyle düzenle.
- Tüm ceza türlerinde aynı otomatik vaka anlatımını kullanma.
- Belirsiz konularda ölçülü dil kullan.
- Şu tür yapay cümleleri kullanma:
  "Somut olayda kamera / radar durumu 'Bilmiyorum' olarak belirtilmiştir."
- Dilekçe şu sırayla yazılsın:
  1. T.C.
  2. Kurum adı büyük harf
  3. KONU
  4. BAŞVURAN BİLGİLERİ
  5. AÇIKLAMALAR
  6. HUKUKİ NEDENLER
  7. SONUÇ VE İSTEM
  8. TARİH ve İMZA
- Kurum adı olarak şu veri kullanılsın:
  ${resolvedInstitution}
- KONU satırı şu mantıkta olsun:
  [ceza bilgisi] itirazı ve iptali istemi.
- HUKUKİ NEDENLER bölümünde yalnızca kullanıcı beyanına mantıken uygun gerekçeleri yaz.
- Kullanıcı hız ihlali seçtiyse ölçüm ve kalibrasyon denetimine değin.
- Kamera/radar durumu kesin değilse delillerin açıklığa kavuşturulması gereğine doğal biçimde değin.
- Sonuç bölümü şu anlamı taşısın:
  Hukuka aykırı cezanın iptaline karar verilmesini saygılarımla arz ve talep ederim.
- Metin tek sayfaya sığabilecek yoğunlukta, temiz ve ikna edici olsun.

Kullanıcı verileri:
Ad Soyad: ${data.fullName}
TCKN: ${data.tckn || "Belirtilmedi"}
Plaka: ${data.plate}
Ceza Tarihi: ${data.penaltyDate}
Tebliğ Tarihi: ${data.notificationDate}
Ceza Türü: ${data.penaltyType}
Ceza Yeri: ${data.location}
Kamera / Radar Durumu: ${data.cameraStatus}
Kurum Adı: ${resolvedInstitution}
Kullanıcının Olay Anlatımı:
${data.explanation}
`.trim();
}

export function buildFallbackTrafficResult(
  data: TrafficFormData
): TrafficGenerationResult {
  const institution = resolveInstitution(data.institution, data.location);
  const institutionUpper = toTurkishUppercase(institution);
  const explanationText = buildMeasuredExplanation(data.explanation);
  const legalReasoning = buildLegalReasoning(data);
  const evaluation = inferEvaluation(data);

  return {
    petition: [
      "T.C.",
      institutionUpper,
      "",
      `KONU: ${data.penaltyType} nedeniyle düzenlenen trafik idari para cezasına itirazı ve iptali istemi.`,
      "",
      "Başvuran Bilgileri",
      `Ad Soyad: ${data.fullName}`,
      data.tckn ? `TCKN: ${data.tckn}` : null,
      `Plaka: ${data.plate}`,
      `Ceza Tarihi: ${data.penaltyDate}`,
      `Tebliğ Tarihi: ${data.notificationDate}`,
      `Ceza Türü: ${data.penaltyType}`,
      `Ceza Yeri: ${data.location}`,
      "",
      "Açıklamalar",
      explanationText,
      "",
      "Hukuki Nedenler",
      "Karayolları Trafik Kanunu, İdari Yargılama Usulü Kanunu ve ilgili mevzuat.",
      legalReasoning,
      "",
      "Sonuç ve İstem",
      "Yukarıda arz edilen nedenlerle, tarafıma düzenlenen trafik idari para cezasının hukuka aykırılık yönünden yeniden incelenmesine ve iptaline karar verilmesini saygılarımla arz ve talep ederim.",
      "",
      "Tarih: .... / .... / ........",
      `İmza: ${data.fullName}`,
    ]
      .filter(Boolean)
      .join("\n"),
    evaluationLevel: evaluation.level,
    evaluationComment: evaluation.comment,
    source: "fallback",
  };
}
