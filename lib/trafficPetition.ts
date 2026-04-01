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

function sentenceCase(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase("tr-TR") + value.slice(1);
}

function includesAny(haystack: string, words: string[]) {
  return words.some((word) => haystack.includes(word));
}

function buildSituationSummary(data: TrafficFormData) {
  const explanation = normalizeExplanation(data.explanation).toLocaleLowerCase("tr-TR");
  const cleanOriginal = normalizeExplanation(data.explanation);

  if (!cleanOriginal) {
    return "Başvuruya konu idari para cezasına ilişkin maddi vakıanın ve isnadın dayanaklarının somut biçimde ortaya konulması gerektiği değerlendirilmektedir.";
  }

  if (includesAny(explanation, ["sarı ışık", "sari ışık", "kırmızı değildi", "kirmizi degildi"])) {
    return "Başvuran, kavşak geçişi sırasında ihlalin gerçekleşmediğini; olay anındaki trafik ışığı fazının ceza tutanağında gösterildiği şekilde olmadığını ileri sürmektedir.";
  }

  if (includesAny(explanation, ["yanlış plaka", "yanlis plaka", "plaka yanlış", "plaka yanlis"])) {
    return "Başvuran, cezanın dayanağını oluşturan tespit ile araç/plaka bilgileri arasında uyumsuzluk bulunduğunu ve işlemin yanlış araca yönelmiş olabileceğini ileri sürmektedir.";
  }

  if (includesAny(explanation, ["tebliğ", "teblig", "geç geldi", "eve gelmedi"])) {
    return "Başvuran, tebliğ ve bildirim sürecinin sağlıklı işletilmediğini, bu nedenle savunma ve başvuru hakkının olumsuz etkilenmiş olabileceğini belirtmektedir.";
  }

  if (includesAny(explanation, ["radar yok", "kamera yok", "fotoğraf yok", "fotograf yok", "delil yok"])) {
    return "Başvuran, isnadın teknik veya görsel delillerle yeterince desteklenmediğini ve ceza işleminin bu yönüyle denetime muhtaç olduğunu ifade etmektedir.";
  }

  if (includesAny(explanation, ["park", "durak", "durma", "bekleme"])) {
    return "Başvuran, park veya durma eylemine ilişkin tespitin somut olayla tam örtüşmediğini ve işlemin maddi vakıa yönünden yeniden incelenmesi gerektiğini savunmaktadır.";
  }

  return `Başvuran, olayın özünü "${cleanOriginal}" şeklinde açıklamakta; bu anlatımın ceza tutanağındaki tespit ile tam olarak örtüşmediğini ileri sürmektedir.`;
}

function buildUserFocusedReasoning(data: TrafficFormData) {
  const explanation = normalizeExplanation(data.explanation).toLocaleLowerCase("tr-TR");
  const reasons: string[] = [];

  reasons.push(
    "İdari yaptırıma dayanak teşkil eden tespitlerin somut, denetlenebilir ve yeterli delillerle desteklenmesi; isnadın kişi, araç, yer ve zaman bakımından tereddüde yer bırakmayacak açıklıkta ortaya konulması gerekir."
  );

  if (data.cameraStatus === "Bilmiyorum") {
    reasons.push(
      "Dosyada açık ve denetlenebilir teknik kayıt bulunup bulunmadığının ortaya konulması önem arz etmektedir. İspat yükünün idarede olduğu gözetildiğinde, yeterli delil ortaya konulamaması halinde işlemin hukuki denetimi zorunlu hale gelir."
    );
  } else if (data.cameraStatus === "Yok") {
    reasons.push(
      "İsnadın kamera, radar veya benzeri teknik kayıtlarla desteklenmemesi halinde tespitin hangi somut verilere dayandığının ayrıca açıklanması gerekir. Bu husus açıklığa kavuşturulmadan tesis edilen işlem tartışmalı hale gelir."
    );
  }

  if (data.penaltyType === "Hız ihlali") {
    reasons.push(
      "Hız ölçümüne dayanılan hallerde cihazın son kalibrasyon durumu, tolerans hesabı ve ölçüm koşullarının mevzuata uygunluğu incelenmeden sağlıklı bir hukuki değerlendirme yapılamaz."
    );
  }

  if (includesAny(explanation, ["sarı ışık", "sari ışık", "kırmızı değildi", "kirmizi degildi"])) {
    reasons.push(
      "Olay anındaki ışık fazının ve aracın kavşağa giriş zamanlamasının hiçbir kuşkuya yer vermeyecek şekilde ortaya konulması gerekir. Aksi halde ihlalin maddi unsurlarının oluşup oluşmadığı tartışmalı kalır."
    );
  }

  if (includesAny(explanation, ["yanlış plaka", "yanlis plaka", "plaka yanlış", "plaka yanlis"])) {
    reasons.push(
      "Plaka veya araç tespitine ilişkin hata ihtimali bulunan hallerde işlemin kişiselleştirilmesi ve doğru araca yöneltilmesi şarttır. Bu konuda tereddüt bulunması işlemin iptali sonucunu doğurabilir."
    );
  }

  if (includesAny(explanation, ["tebliğ", "teblig", "geç geldi", "eve gelmedi"])) {
    reasons.push(
      "Tebliğ sürecine ilişkin usuli eksiklik iddiası, başvuru hakkının kullanılması bakımından ayrıca değerlendirilmelidir. Bildirim süreçlerinin mevzuata uygunluğu denetlenmeden sağlıklı sonuca varılamaz."
    );
  }

  return reasons.join(" ");
}

function professionalizeExplanation(data: TrafficFormData) {
  const situationSummary = buildSituationSummary(data);

  return `${situationSummary} Başvuranın anlatımı birlikte değerlendirildiğinde, ceza işlemine esas alınan maddi vakıanın tüm yönleriyle açıklığa kavuşturulması ve tutanağın hukuki denetime tabi tutulması gerektiği anlaşılmaktadır.`;
}

function inferEvaluation(data: TrafficFormData) {
  const explanation = normalizeExplanation(data.explanation).toLocaleLowerCase("tr-TR");
  let score = 0;

  if (data.cameraStatus !== "Var") score += 1;
  if (data.penaltyType === "Hız ihlali") score += 1;
  if (includesAny(explanation, ["yanlış", "yanlis", "haksız", "haksiz", "eksik", "usul", "tebliğ", "teblig", "delil", "kamera", "radar"])) {
    score += 2;
  }
  if (includesAny(explanation, ["sarı ışık", "sari ışık", "yanlış plaka", "yanlis plaka", "eve gelmedi", "geç geldi"])) {
    score += 1;
  }

  if (score >= 4) {
    return {
      level: "Yüksek" as const,
      comment:
        "Girilen olay anlatımı ve seçilen veriler, maddi tespit ve usul yönünden ciddi tartışma alanı oluşturuyor. Somut delil incelemesiyle itiraz zemini güçlenebilir.",
    };
  }

  if (score >= 2) {
    return {
      level: "Orta" as const,
      comment:
        "Başvuru içeriği, ceza işlemine esas alınan tespit ve tebliğ sürecinin yeniden değerlendirilmesini gerektirebilecek noktalar içeriyor.",
    };
  }

  return {
    level: "Düşük" as const,
    comment:
      "Mevcut anlatım temel bir itiraz zemini sunuyor. Somut delil, tutanak hatası veya usul eksikliği daha açık belirtilirse başvuru gücü artabilir.",
  };
}

export function buildTrafficPrompt(data: TrafficFormData) {
  const resolvedInstitution = resolveInstitution(data.institution, data.location);

  return `
Sen trafik cezası itiraz dilekçeleri hazırlayan deneyimli bir hukuk asistanısın.
Kullanıcının anlattığı mevcut durumu dikkatle analiz et ve yalnızca verilen bilgilere dayanarak resmi Türkçe ile dilekçe üret.

Kurallar:
- Cevabı yalnızca JSON ver.
- JSON dışında hiçbir açıklama yazma.
- Anahtarlar: petition, evaluationLevel, evaluationComment.
- evaluationLevel yalnızca şu üç değerden biri olsun: Düşük, Orta, Yüksek.
- petition alanı yalnızca dilekçe metni olsun.
- Kullanıcının anlatmadığı hiçbir olguyu uydurma.
- Kamera kaydı, tutanak hatası, tebligat eksikliği veya olay anı detayları açıkça verilmediyse bunları kesin olmuş gibi yazma.
- Belirsiz konularda ölçülü dil kullan: "incelenmesi gerekmektedir", "denetime muhtaçtır", "iddia edilmektedir" gibi.
- Kullanıcının yazdığı durumu hukuk diline çevir ama anlamını bozma.
- Saçma, mekanik, yapay veya tekrar eden cümleler kurma.
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
- HUKUKİ NEDENLER bölümünde yalnızca kullanıcının anlattığı olaya mantıken uygun gerekçeleri yaz.
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
  const explanationText = professionalizeExplanation(data);
  const legalReasoning = buildUserFocusedReasoning(data);
  const evaluation = inferEvaluation(data);

  return {
    petition: [
      "T.C.",
      institutionUpper,
      "",
      `KONU: ${sentenceCase(data.penaltyType)} nedeniyle düzenlenen trafik idari para cezasına itirazı ve iptali istemi.`,
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
