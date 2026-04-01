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

function professionalizeExplanation(explanation: string) {
  const cleaned = explanation.trim();

  if (!cleaned) {
    return "Anayasa ve İdari Yargılama Usulü Kanunu ilkeleri ışığında, mezkur ceza tutanağının maddi gerçeklikle bağdaşmadığı ve hukuki dayanaktan yoksun olduğu anlaşılmaktadır.";
  }

  return `Anayasa ve İdari Yargılama Usulü Kanunu ilkeleri ışığında, başvuruya konu olay değerlendirildiğinde "${cleaned}" şeklinde özetlenebilecek vakıanın maddi gerçeklikle bağdaşmadığı ve ceza tutanağının hukuki denetime tabi tutulmasının zorunlu olduğu anlaşılmaktadır.`;
}

function buildCameraReason(cameraStatus: string) {
  if (cameraStatus === "Bilmiyorum") {
    return "İsnat edilen fiilin somut, denetlenebilir ve teknolojik delillerle (fotoğraf/video kaydı) ispatlanmadığı, ispat yükünün idarede olduğu ve şüpheden sanık yararlanır ilkesi gereği cezanın iptali gerekmektedir.";
  }

  if (cameraStatus === "Yok") {
    return "İsnada dayanak alınan tespitin somut ve denetlenebilir teknik delillerle desteklenmemesi halinde idari yaptırımın hukuki dayanağı tartışmalı hale gelecektir.";
  }

  return "Dosyada bulunduğu varsayılan teknik kayıtların tam, açık ve denetlenebilir biçimde incelenmesi; isnadın hangi maddi verilere dayandığının kuşkuya yer bırakmayacak şekilde ortaya konulması gerekmektedir.";
}

function buildPenaltyReason(penaltyType: string) {
  if (penaltyType === "Hız ihlali") {
    return "Hız ölçüm cihazının son kalibrasyon raporunun dosyaya celbi ile cihazın hata payının (tolerans) mevzuata uygun hesaplanıp hesaplanmadığının denetimini talep ederim.";
  }

  return "";
}

export function buildTrafficPrompt(data: TrafficFormData) {
  const resolvedInstitution = resolveInstitution(data.institution, data.location);

  return `
Sen trafik cezası itiraz dilekçeleri hazırlayan deneyimli bir hukuk asistanısın.
Kullanıcının verdiği bilgilere göre resmi, ikna edici, doğal ve profesyonel hukuk diliyle Türkçe bir dilekçe üret.

Kurallar:
- Cevabı yalnızca JSON ver.
- JSON dışında hiçbir açıklama yazma.
- Anahtarlar: petition, evaluationLevel, evaluationComment.
- evaluationLevel değeri yalnızca şu üç seçenekten biri olsun: Düşük, Orta, Yüksek.
- petition alanı yalnızca dilekçe metni olsun.
- Dilekçe şu başlık düzeniyle yazılsın:
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
- KONU satırı şu mantıkta kurulsun:
  [ceza bilgisi] itirazı ve iptali istemi.
- Kullanıcının açıklaması profesyonel hukuk diliyle yeniden yazılsın.
- Hukuki gerekçede mekanik, yapay ve kullanıcı seçimlerini doğrudan tekrar eden cümleler kurulmasın.
- Şu tür ifade kalıplarını kullanma:
  "Somut olayda kamera / radar durumu 'Bilmiyorum' olarak belirtilmiştir."
- Kamera durumu "Bilmiyorum" ise şu hukuki özü doğal biçimde işle:
  İsnat edilen fiilin somut, denetlenebilir ve teknolojik delillerle ispatlanmadığı, ispat yükünün idarede olduğu ve şüpheden sanık yararlanır ilkesi gereği cezanın iptali gerektiği.
- Ceza türü "Hız ihlali" ise şu hukuki özü doğal biçimde işle:
  Hız ölçüm cihazının son kalibrasyon raporunun celbi ve hata payı hesabının denetlenmesi talebi.
- HUKUKİ NEDENLER başlığında şu çerçeve yer alsın:
  Karayolları Trafik Kanunu, İdari Yargılama Usulü Kanunu ve ilgili mevzuat.
- SONUÇ VE İSTEM bölümü şu anlamı taşısın:
  Hukuka aykırı cezanın iptaline karar verilmesini saygılarımla arz ve talep ederim.
- Metin öz, profesyonel ve tek sayfaya sığabilecek yoğunlukta olsun.

Veriler:
Ad Soyad: ${data.fullName}
TCKN: ${data.tckn || "Belirtilmedi"}
Plaka: ${data.plate}
Ceza Tarihi: ${data.penaltyDate}
Tebliğ Tarihi: ${data.notificationDate}
Ceza Türü: ${data.penaltyType}
Ceza Yeri: ${data.location}
Kamera / Radar Durumu: ${data.cameraStatus}
Kurum Adı: ${resolvedInstitution}
Açıklama:
${data.explanation}
`.trim();
}

export function buildFallbackTrafficResult(
  data: TrafficFormData
): TrafficGenerationResult {
  const institution = resolveInstitution(data.institution, data.location);
  const institutionUpper = toTurkishUppercase(institution);
  const professionalExplanation = professionalizeExplanation(data.explanation);
  const cameraReason = buildCameraReason(data.cameraStatus);
  const penaltyReason = buildPenaltyReason(data.penaltyType);
  const hasSupportiveFacts =
    data.cameraStatus !== "Var" ||
    /tebliğ|usul|yanlış|haksız|delil|kamera|radar|eksik|ispat/i.test(
      data.explanation
    );

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
      professionalExplanation,
      "",
      "Hukuki Nedenler",
      "Karayolları Trafik Kanunu, İdari Yargılama Usulü Kanunu ve ilgili mevzuat.",
      cameraReason,
      penaltyReason || null,
      "",
      "Sonuç ve İstem",
      "Hukuka aykırı cezanın iptaline karar verilmesini saygılarımla arz ve talep ederim.",
      "",
      "Tarih: .... / .... / ........",
      `İmza: ${data.fullName}`,
    ]
      .filter(Boolean)
      .join("\n"),
    evaluationLevel: hasSupportiveFacts ? "Orta" : "Düşük",
    evaluationComment: hasSupportiveFacts
      ? "Girilen bilgiler, delil yapısı ve usul yönünden tartışmaya açık noktalar içeriyor. Özellikle ispat yükü, teknik kayıtlar ve tebliğ süreci itirazı güçlendirebilir."
      : "Mevcut açıklama temel bir itiraz zemini sunuyor. İtiraz gücü, somut delil ve usul eksikliği daha net ortaya konulduğunda artacaktır.",
    source: "fallback",
  };
}
