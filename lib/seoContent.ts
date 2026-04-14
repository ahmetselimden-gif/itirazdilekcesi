export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoSection = {
  heading: string;
  paragraphs: string[];
};

export type SeoPageContent = {
  slug: string;
  path: string;
  panelPath: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  ctaLabel: string;
  sections: SeoSection[];
  faqs: SeoFaq[];
};

export const coreSeoPages: SeoPageContent[] = [
  {
    slug: "trafik-cezasi-itiraz-dilekcesi",
    path: "/trafik-cezasi-itiraz-dilekcesi",
    panelPath: "/trafik-cezasi-itiraz",
    title: "Trafik Cezası İtiraz Dilekçesi Nasıl Yazılır?",
    metaTitle: "Trafik Cezası İtiraz Dilekçesi Hazırla | 2026",
    description:
      "Trafik cezası itiraz dilekçesi nasıl yazılır, kimler başvurabilir ve gerekli bilgiler nelerdir? Radar, kırmızı ışık ve park cezaları için rehber.",
    keywords: [
      "trafik cezası itiraz dilekçesi",
      "trafik cezasına itiraz",
      "radar cezası itiraz dilekçesi",
      "kırmızı ışık cezası itiraz",
      "trafik cezası iptali",
    ],
    eyebrow: "Trafik cezası rehberi",
    ctaLabel: "Trafik cezası itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Trafik cezası itiraz dilekçesi nasıl yazılır?",
        paragraphs: [
          "Trafik cezası itiraz dilekçesi, cezanın neden hatalı veya hukuka aykırı olduğunu açık biçimde anlatan resmi başvuru metnidir. Dilekçede ceza tarihi, tebliğ tarihi, plaka, ceza türü, cezanın kesildiği yer ve itiraz gerekçesi düzenli şekilde yazılmalıdır.",
          "Dilekçe kısa, somut ve belgeye dayalı olmalıdır. Sadece cezanın haksız olduğunu söylemek yerine, radar kaydı, kamera görüntüsü, yanlış plaka, hatalı yer bilgisi veya tebligat sorunu gibi noktalar açıkça belirtilmelidir.",
        ],
      },
      {
        heading: "Kimler trafik cezasına itiraz edebilir?",
        paragraphs: [
          "Cezanın muhatabı olan araç sahibi, sürücü veya ceza tutanağıyla doğrudan ilgisi bulunan kişi trafik cezasına itiraz edebilir. Başvuru yapılırken kimlik bilgileri ve ceza tutanağı bilgileri doğru yazılmalıdır.",
          "Başvuru yapacak kişi, dilekçede kendi olayını anlatmalı ve varsa ek belgelerini belirtmelidir. Araç sahibi ile sürücü farklıysa bu durum dilekçede netleştirilmelidir.",
        ],
      },
      {
        heading: "Süreç nasıl işler?",
        paragraphs: [
          "Trafik cezasına itirazda süre çoğu durumda tebliğ tarihinden itibaren değerlendirilir. Başvuru süresi kaçırıldığında cezanın kesinleşmesi gündeme gelebileceği için dilekçe hazırlığı geciktirilmemelidir.",
          "Dilekçe hazırlandıktan sonra ilgili sulh ceza hakimliğine veya yetkili başvuru birimine sunulur. Başvuruya ceza tutanağı, tebligat, fotoğraf, video veya diğer destekleyici belgeler eklenebilir.",
        ],
      },
      {
        heading: "Gerekli bilgiler nelerdir?",
        paragraphs: [
          "Ad soyad, plaka, ceza tarihi, tebliğ tarihi, ceza türü, ceza yeri ve olay açıklaması temel bilgiler arasındadır. Radar veya kamera durumu biliniyorsa dilekçede ayrıca belirtilmesi faydalı olur.",
          "Dilekçenin sonunda talep açıkça yazılmalıdır. Talep genellikle trafik idari para cezasının iptali ve ceza işleminin hukuka uygunluk yönünden incelenmesidir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Trafik cezası itiraz dilekçesi nereye verilir?",
        answer:
          "Uygulamada trafik idari para cezalarına itiraz çoğunlukla sulh ceza hakimliğine yapılır. Yetkili yer ve başvuru şekli somut dosyaya göre kontrol edilmelidir.",
      },
      {
        question: "Trafik cezasına itiraz süresi kaç gündür?",
        answer:
          "Süre genellikle tebliğ tarihinden itibaren 15 gün olarak değerlendirilir. Hak kaybı yaşamamak için tebliğ tarihi dikkatle kontrol edilmelidir.",
      },
      {
        question: "Ödeme yaptıktan sonra itiraz edilebilir mi?",
        answer:
          "Ödeme durumu her dosyada farklı sonuç doğurabilir. Ödeme yaptıysanız dilekçede bu bilgiyi ve ödeme makbuzunu belirtmeniz faydalı olur.",
      },
    ],
  },
  {
    slug: "kiraci-itiraz-dilekcesi",
    path: "/kiraci-itiraz-dilekcesi",
    panelPath: "/kiraci",
    title: "Kiracı İtiraz Dilekçesi Nasıl Yazılır?",
    metaTitle: "Kiracı İtiraz Dilekçesi Hazırla | Kira Artışı ve Tahliye",
    description:
      "Kiracı itiraz dilekçesi nasıl yazılır? Haksız kira artışı, tahliye baskısı, depozito iadesi ve sözleşme ihlali için gerekli bilgiler.",
    keywords: [
      "kiracı itiraz dilekçesi",
      "kira artışı itiraz dilekçesi",
      "tahliye itiraz dilekçesi",
      "depozito iade dilekçesi",
      "kiracı hakları",
    ],
    eyebrow: "Kiracı rehberi",
    ctaLabel: "Kiracı itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Kiracı itiraz dilekçesi nasıl yazılır?",
        paragraphs: [
          "Kiracı itiraz dilekçesi, kiracının kira ilişkisi içinde yaşadığı sorunu resmi bir dille anlatmak için hazırlanır. Haksız kira artışı, tahliye baskısı, depozito iadesi veya sözleşmeye aykırı talepler dilekçede açık şekilde yazılmalıdır.",
          "Metinde tarafların adı, kiralanan evin adresi, sözleşme bilgisi, olayın tarihi ve kiracının talebi bulunmalıdır. Açıklama bölümü sade olmalı ve mümkünse belge, dekont, mesaj veya ihtar gibi kayıtlarla desteklenmelidir.",
        ],
      },
      {
        heading: "Kimler başvurabilir?",
        paragraphs: [
          "Kiralanan taşınmazda kiracı olan kişi, kira sözleşmesinden kaynaklanan uyuşmazlık için dilekçe hazırlayabilir. Başvuruda kiracının kimlik ve adres bilgileri ile ev sahibinin adı açıkça yazılmalıdır.",
          "Kiracı aile bireyi veya temsilci aracılığıyla hareket ediyorsa temsil ilişkisi ve dosyadaki belge durumu ayrıca değerlendirilmelidir.",
        ],
      },
      {
        heading: "Süreç nasıl işler?",
        paragraphs: [
          "Önce olay ve talep netleştirilir. Daha sonra kira sözleşmesi, ödeme kayıtları, yazışmalar ve varsa ihtarname gibi belgeler hazırlanır. Dilekçe ilgili kurum veya mahkemeye sunulmadan önce tarih, adres ve talep bölümleri kontrol edilmelidir.",
          "Kira uyuşmazlıklarında başvuru yolu ve süre her konuya göre değişebilir. Bu nedenle dilekçe oluşturulduktan sonra somut dosyadaki süre ve görevli kurum ayrıca kontrol edilmelidir.",
        ],
      },
      {
        heading: "Gerekli bilgiler nelerdir?",
        paragraphs: [
          "Ad soyad, adres, ev sahibi adı, kiralanan ev adresi, problem türü, açıklama ve itiraz edilen kurum temel alanlardır. Kira artışı veya depozito gibi konularda tutar, tarih ve ödeme bilgisi de eklenmelidir.",
          "Dilekçede talep net olmalıdır. Örneğin haksız artışın kabul edilmediği, depozitonun iadesinin istendiği veya tahliye baskısının durdurulmasının talep edildiği açıkça yazılabilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kiracı haksız kira artışına nasıl itiraz eder?",
        answer:
          "Kiracı, artış bildirimi, mevcut kira bedeli, talep edilen yeni bedel ve itiraz gerekçesini dilekçede açıkça yazarak ilgili kuruma başvurabilir.",
      },
      {
        question: "Depozito iadesi için dilekçe yazılır mı?",
        answer:
          "Evet. Depozitonun ne zaman ödendiği, taşınmazın ne zaman teslim edildiği ve iadenin neden istendiği dilekçede belirtilmelidir.",
      },
      {
        question: "Kiracı dilekçesine hangi belgeler eklenir?",
        answer:
          "Kira sözleşmesi, ödeme dekontu, teslim tutanağı, yazışmalar, ihtarname ve fotoğraflar dilekçeyi destekleyebilir.",
      },
    ],
  },
  {
    slug: "ev-sahibi-itiraz-dilekcesi",
    path: "/ev-sahibi-itiraz-dilekcesi",
    panelPath: "/ev-sahibi",
    title: "Ev Sahibi İtiraz Dilekçesi Nasıl Yazılır?",
    metaTitle: "Ev Sahibi İtiraz Dilekçesi Hazırla | Kira ve Tahliye",
    description:
      "Ev sahibi itiraz dilekçesi nasıl yazılır? Kira ödememe, tahliye talebi, sözleşme ihlali ve eve zarar verme durumları için rehber.",
    keywords: [
      "ev sahibi itiraz dilekçesi",
      "kira ödememe dilekçesi",
      "tahliye talebi dilekçesi",
      "eve zarar veren kiracı",
      "ev sahibi hakları",
    ],
    eyebrow: "Ev sahibi rehberi",
    ctaLabel: "Ev sahibi itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Ev sahibi itiraz dilekçesi nasıl yazılır?",
        paragraphs: [
          "Ev sahibi itiraz dilekçesi, kira ilişkisinde yaşanan uyuşmazlığı düzenli ve resmi bir anlatımla sunmak için hazırlanır. Kira ödememe, sözleşme ihlali, tahliye talebi veya eve zarar verme gibi konular dilekçede somut olay sırasıyla açıklanmalıdır.",
          "Dilekçede ev sahibinin adı, adresi, kiracı adı, kiralanan taşınmazın adresi, problem türü ve talep edilen işlem yer almalıdır. Varsa kira sözleşmesi, ödeme kayıtları, ihtarname ve fotoğraflar belirtilmelidir.",
        ],
      },
      {
        heading: "Kimler başvurabilir?",
        paragraphs: [
          "Kiraya veren kişi veya hukuken yetkili temsilcisi, kira ilişkisinden doğan uyuşmazlık için dilekçe hazırlayabilir. Başvuruda kiracı bilgileri ve taşınmaz adresi doğru yazılmalıdır.",
          "Birden fazla malik varsa başvuru yetkisi ve temsil durumu ayrıca kontrol edilmelidir. Dilekçe metni bu bilgileri açık gösterecek şekilde hazırlanmalıdır.",
        ],
      },
      {
        heading: "Süreç nasıl işler?",
        paragraphs: [
          "Ev sahibi önce uyuşmazlığın türünü belirler. Kira ödememe dosyasında ödeme dönemi ve tutar, tahliye talebinde dayanak sebep, zarar iddiasında ise zarar tarihi ve deliller önemlidir.",
          "Dilekçe oluşturulduktan sonra görevli kurum, başvuru yolu ve varsa ihtar şartı kontrol edilmelidir. Her kira uyuşmazlığı aynı süreçle ilerlemediği için dilekçe somut olaya göre düzenlenmelidir.",
        ],
      },
      {
        heading: "Gerekli bilgiler nelerdir?",
        paragraphs: [
          "Ad soyad, adres, kiracı adı, kiralanan ev adresi, problem türü, açıklama ve itiraz edilen kurum temel bilgilerdir. Ödeme yapılmadıysa dönem ve tutar, zarar varsa fotoğraf veya fatura bilgisi eklenebilir.",
          "Sonuç bölümünde talep açık yazılmalıdır. Örneğin kira borcunun ödenmesi, tahliye sürecinin değerlendirilmesi veya zararın tazmini gibi talepler netleştirilebilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kira ödemeyen kiracı için dilekçe yazılır mı?",
        answer:
          "Evet. Ödenmeyen dönem, tutar, ödeme kayıtları ve kiracıya yapılan bildirimler dilekçede açıkça yazılmalıdır.",
      },
      {
        question: "Ev sahibi tahliye talebini nasıl açıklar?",
        answer:
          "Tahliye sebebi, sözleşme tarihi, varsa ihtar veya bildirim bilgisi ve talep edilen işlem dilekçede somut şekilde anlatılmalıdır.",
      },
      {
        question: "Eve zarar veren kiracı için hangi belgeler gerekir?",
        answer:
          "Fotoğraf, video, teslim tutanağı, ekspertiz veya tamirat faturası gibi belgeler zarar iddiasını destekleyebilir.",
      },
    ],
  },
];

export const programmaticSeoPages: SeoPageContent[] = [
  {
    slug: "kira-artisi-itiraz",
    path: "/dilekce/kira-artisi-itiraz",
    panelPath: "/kiraci",
    title: "Kira Artışı İtiraz Dilekçesi (2026 Güncel)",
    metaTitle: "Kira Artışı İtiraz Dilekçesi (2026 Güncel)",
    description:
      "Kira artışı itiraz dilekçesi, ev sahibi tarafından yapılan yüksek kira artışlarına karşı kiracıların başvurabileceği resmi bir belgedir.",
    keywords: ["kira artışı itiraz dilekçesi", "haksız kira artışı", "kiracı kira artışı itiraz"],
    eyebrow: "Kira artışı",
    ctaLabel: "Kira artışı itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Kira Artışı İtiraz Dilekçesi",
        paragraphs: [
          "Kira artışı itiraz dilekçesi, ev sahibi tarafından yapılan yüksek kira artışlarına karşı kiracıların başvurabileceği resmi bir belgedir. Türkiye’de kira artış oranları yasal sınırlar içerisinde belirlenir ve bu sınırların üzerinde yapılan artışlar için itiraz hakkı bulunmaktadır.",
          "Kiracılar, haksız kira artışı durumunda mahkemeye başvurmadan önce dilekçe ile itiraz sürecini başlatabilirler. Bu dilekçe, ilgili kurumlara sunularak hukuki sürecin ilk adımı olarak kullanılabilir.",
          "Aşağıdaki formu doldurarak kendi durumunuza uygun kira artışı itiraz dilekçesini hızlıca oluşturabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kira artışı ne kadar olabilir?",
        answer: "Yasal olarak kira artışları TÜFE oranına göre belirlenir.",
      },
      {
        question: "Kira artışına nasıl itiraz edilir?",
        answer: "Hazırlanan dilekçe ile ilgili kurumlara başvuru yapılabilir.",
      },
      {
        question: "İtiraz süresi var mı?",
        answer: "Duruma göre değişmekle birlikte gecikmeden başvuru yapılması önerilir.",
      },
    ],
  },
  {
    slug: "tahliye-itiraz",
    path: "/dilekce/tahliye-itiraz",
    panelPath: "/kiraci",
    title: "Tahliye İtiraz Dilekçesi (2026 Güncel)",
    metaTitle: "Tahliye İtiraz Dilekçesi (2026 Güncel)",
    description:
      "Tahliye itiraz dilekçesi, kiracıların tahliye talebi veya tahliye baskısına karşı itirazlarını resmi şekilde sunmak için kullanabileceği bir belgedir.",
    keywords: ["tahliye itiraz dilekçesi", "tahliye baskısı", "kiracı tahliye itiraz"],
    eyebrow: "Tahliye itirazı",
    ctaLabel: "Tahliye itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Tahliye İtiraz Dilekçesi",
        paragraphs: [
          "Tahliye itiraz dilekçesi, kiracıların tahliye talebi veya tahliye baskısına karşı itirazlarını resmi şekilde sunmak için kullanabileceği bir belgedir. Kiracının tahliye talebine neden karşı çıktığı, olayın tarihleri ve varsa yazılı bildirimler dilekçede açıkça belirtilmelidir.",
          "Tahliye sürecinde dilekçe hazırlanırken kira sözleşmesi, bildirim tarihi, tahliye gerekçesi ve tarafların bilgileri dikkatle yazılmalıdır. Bu bilgiler, itirazın anlaşılır ve düzenli şekilde değerlendirilmesine yardımcı olur.",
          "Aşağıdaki formu doldurarak kendi durumunuza uygun tahliye itiraz dilekçesini hızlıca oluşturabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Tahliye talebine itiraz edilebilir mi?",
        answer:
          "Kiracı, haksız veya hukuki dayanağı tartışmalı tahliye taleplerine karşı dilekçe ile itiraz edebilir.",
      },
      {
        question: "Tahliye itiraz dilekçesinde hangi bilgiler yer alır?",
        answer:
          "Kira sözleşmesi bilgileri, tahliye bildirimi, kiralanan adres, taraf bilgileri ve itiraz açıklaması yer almalıdır.",
      },
      {
        question: "Tahliye itirazı ne zaman yapılmalıdır?",
        answer:
          "Hak kaybı yaşanmaması için tahliye talebi öğrenildikten sonra gecikmeden başvuru yapılması önerilir.",
      },
    ],
  },
  {
    slug: "kira-artisi-itiraz-dilekcesi",
    path: "/dilekce/kira-artisi-itiraz-dilekcesi",
    panelPath: "/kiraci",
    title: "Kira Artışı İtiraz Dilekçesi",
    metaTitle: "Kira Artışı İtiraz Dilekçesi Nasıl Yazılır?",
    description:
      "Kira artışı itiraz dilekçesi için gerekli bilgiler, süreç ve kiracıların dikkat etmesi gereken noktalar.",
    keywords: ["kira artışı itiraz dilekçesi", "haksız kira artışı", "kiracı kira artışı itiraz"],
    eyebrow: "Kira artışı",
    ctaLabel: "Kira artışı itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Kira artışı itiraz dilekçesi nasıl yazılır?",
        paragraphs: [
          "Kira artışı itiraz dilekçesinde mevcut kira bedeli, talep edilen yeni kira, artış bildiriminin tarihi ve itiraz sebebi açıkça yazılmalıdır.",
          "Kiracı, artışın neden kabul edilmediğini sade bir dille anlatmalı ve varsa sözleşme, mesaj veya ödeme dekontu gibi belgeleri belirtmelidir.",
        ],
      },
      {
        heading: "Kimler başvurabilir?",
        paragraphs: [
          "Haksız veya tartışmalı kira artışıyla karşılaşan kiracı, kendi kira ilişkisine ait bilgileri kullanarak dilekçe hazırlayabilir.",
        ],
      },
      {
        heading: "Süreç nasıl işler?",
        paragraphs: [
          "Önce artış talebi ve sözleşme incelenir. Sonra itiraz gerekçesi yazılır ve ilgili kurum veya mahkeme için dilekçe hazırlanır.",
        ],
      },
      {
        heading: "Gerekli bilgiler",
        paragraphs: [
          "Kiracı adı, ev sahibi adı, kiralanan adres, mevcut kira, talep edilen kira, bildirim tarihi ve açıklama temel bilgilerdir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kira artışına itiraz dilekçesinde TÜFE yazılmalı mı?",
        answer:
          "Artış oranı tartışılıyorsa mevcut kira ve talep edilen artış oranı dilekçede belirtilmelidir.",
      },
      {
        question: "Kira artışı itiraz dilekçesi tek başına yeterli mi?",
        answer:
          "Dilekçe temel metindir; sözleşme, ödeme dekontu ve yazışmalarla desteklenmesi faydalı olur.",
      },
    ],
  },
  {
    slug: "tahliye-itiraz-dilekcesi",
    path: "/dilekce/tahliye-itiraz-dilekcesi",
    panelPath: "/kiraci",
    title: "Tahliye İtiraz Dilekçesi",
    metaTitle: "Tahliye İtiraz Dilekçesi Nasıl Hazırlanır?",
    description:
      "Tahliye baskısı veya tahliye talebine karşı dilekçe hazırlarken yazılması gereken bilgiler.",
    keywords: ["tahliye itiraz dilekçesi", "tahliye baskısı", "kiracı tahliye itiraz"],
    eyebrow: "Tahliye itirazı",
    ctaLabel: "Tahliye itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Tahliye itiraz dilekçesi nasıl yazılır?",
        paragraphs: [
          "Tahliye itiraz dilekçesinde tahliye talebinin hangi gerekçeyle ileri sürüldüğü, kiracının buna neden itiraz ettiği ve olayın tarihleri açıkça yazılmalıdır.",
          "Metinde duygusal ifadeler yerine sözleşme, bildirim ve olay sırası anlatılmalıdır.",
        ],
      },
      {
        heading: "Kimler başvurabilir?",
        paragraphs: ["Tahliye talebiyle karşılaşan kiracı veya yetkili temsilcisi dilekçe hazırlayabilir."],
      },
      {
        heading: "Süreç nasıl işler?",
        paragraphs: ["Önce tahliye sebebi incelenir, ardından kiracı savunması ve talebi düzenli biçimde dilekçeye aktarılır."],
      },
      {
        heading: "Gerekli bilgiler",
        paragraphs: ["Sözleşme tarihi, tahliye bildirimi, kiralanan adres, taraf bilgileri ve itiraz açıklaması gereklidir."],
      },
    ],
    faqs: [
      {
        question: "Sözleşme süresi bitince kiracı hemen çıkarılır mı?",
        answer:
          "Konut ve çatılı işyeri kiralarında bu konu somut dosyaya göre değerlendirilir. Dilekçede sözleşme ve bildirim bilgileri yazılmalıdır.",
      },
    ],
  },
  {
    slug: "depozito-iade-dilekcesi",
    path: "/dilekce/depozito-iade-dilekcesi",
    panelPath: "/kiraci",
    title: "Depozito İade Dilekçesi",
    metaTitle: "Depozito İade Dilekçesi Örneği ve Hazırlama",
    description:
      "Depozito iadesi için dilekçe nasıl yazılır? Kiracılar için gerekli bilgiler ve başvuru adımları.",
    keywords: ["depozito iade dilekçesi", "depozito iadesi", "kiracı depozito dilekçesi"],
    eyebrow: "Depozito iadesi",
    ctaLabel: "Depozito iade dilekçesi oluştur",
    sections: [
      {
        heading: "Depozito iade dilekçesi nasıl yazılır?",
        paragraphs: [
          "Depozito iade dilekçesinde depozitonun ne zaman ve nasıl ödendiği, evin hangi tarihte teslim edildiği ve iadenin neden istendiği yazılır.",
        ],
      },
      {
        heading: "Kimler başvurabilir?",
        paragraphs: ["Depozito ödeyen kiracı, kira ilişkisi sona erdiğinde iade talebi için dilekçe hazırlayabilir."],
      },
      {
        heading: "Süreç nasıl işler?",
        paragraphs: ["Ödeme kaydı, teslim tutanağı ve yazışmalar hazırlanır; iade talebi dilekçede açıkça belirtilir."],
      },
      {
        heading: "Gerekli bilgiler",
        paragraphs: ["Depozito tutarı, ödeme tarihi, teslim tarihi, ev sahibi adı ve kiralanan adres yazılmalıdır."],
      },
    ],
    faqs: [
      {
        question: "Depozito iadesi için dekont gerekir mi?",
        answer: "Dekont veya ödeme kaydı talebi güçlendirebilir. Varsa dilekçede belirtilmelidir.",
      },
    ],
  },
  {
    slug: "trafik-cezasi-radar-itiraz-dilekcesi",
    path: "/dilekce/trafik-cezasi-radar-itiraz-dilekcesi",
    panelPath: "/trafik-cezasi-itiraz",
    title: "Trafik Cezası Radar İtiraz Dilekçesi",
    metaTitle: "Radar Cezası İtiraz Dilekçesi Nasıl Yazılır?",
    description:
      "Radar cezasına itiraz dilekçesi için ölçüm, kalibrasyon, hız sınırı ve delil bilgileri nasıl yazılır?",
    keywords: ["radar cezası itiraz dilekçesi", "hız cezası itiraz", "trafik cezası radar itiraz"],
    eyebrow: "Radar cezası",
    ctaLabel: "Radar cezası itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Radar cezası itiraz dilekçesi nasıl yazılır?",
        paragraphs: [
          "Radar cezası itiraz dilekçesinde ölçüm yeri, hız sınırı, ceza tarihi, tebliğ tarihi ve itiraz gerekçesi açıkça yazılmalıdır.",
        ],
      },
      {
        heading: "Kimler başvurabilir?",
        paragraphs: ["Radar cezasının muhatabı olan sürücü veya araç sahibi başvuru yapabilir."],
      },
      {
        heading: "Süreç nasıl işler?",
        paragraphs: ["Dilekçe hazırlanır, varsa radar fotoğrafı veya tebligat eklenir ve ilgili makama sunulur."],
      },
      {
        heading: "Gerekli bilgiler",
        paragraphs: ["Plaka, ceza tarihi, tebliğ tarihi, lokasyon, hız sınırı ve olay açıklaması gereklidir."],
      },
    ],
    faqs: [
      {
        question: "Radar cezasında kalibrasyon yazılır mı?",
        answer:
          "Ölçüm cihazının güvenilirliği tartışılıyorsa kalibrasyon ve ölçüm koşulları dilekçede belirtilebilir.",
      },
    ],
  },
  {
    slug: "kirmizi-isik-cezasi-itiraz-dilekcesi",
    path: "/dilekce/kirmizi-isik-cezasi-itiraz-dilekcesi",
    panelPath: "/trafik-cezasi-itiraz",
    title: "Kırmızı Işık Cezası İtiraz Dilekçesi",
    metaTitle: "Kırmızı Işık Cezası İtiraz Dilekçesi Hazırla",
    description:
      "Kırmızı ışık cezasına itiraz için kamera kaydı, olay yeri, plaka ve tebligat bilgileriyle dilekçe hazırlama rehberi.",
    keywords: ["kırmızı ışık cezası itiraz", "kırmızı ışık itiraz dilekçesi", "trafik cezası itiraz"],
    eyebrow: "Kırmızı ışık cezası",
    ctaLabel: "Kırmızı ışık cezası itiraz dilekçesi oluştur",
    sections: [
      {
        heading: "Kırmızı ışık cezası itiraz dilekçesi nasıl yazılır?",
        paragraphs: [
          "Dilekçede cezanın kesildiği yer, tarih, plaka, tebliğ bilgisi ve ihlalin neden tartışmalı olduğu açıkça anlatılır.",
        ],
      },
      {
        heading: "Kimler başvurabilir?",
        paragraphs: ["Cezanın muhatabı olan kişi veya araç sahibi başvuru hazırlayabilir."],
      },
      {
        heading: "Süreç nasıl işler?",
        paragraphs: ["Tebligat ve ceza tutanağı incelenir, itiraz gerekçesi yazılır ve başvuru ilgili merciye sunulur."],
      },
      {
        heading: "Gerekli bilgiler",
        paragraphs: ["Ceza tarihi, tebliğ tarihi, olay yeri, kamera durumu ve açıklama temel bilgilerdir."],
      },
    ],
    faqs: [
      {
        question: "Kırmızı ışık cezasında kamera kaydı istenir mi?",
        answer:
          "Kamera kaydı veya fotoğraf delili varsa dilekçede bu kaydın incelenmesi talep edilebilir.",
      },
    ],
  },
];

const legacyProgrammaticSeoSlugs = new Set([
  "kira-artisi-itiraz-dilekcesi",
  "tahliye-itiraz-dilekcesi",
]);

export const publishedProgrammaticSeoPages = programmaticSeoPages.filter(
  (page) => !legacyProgrammaticSeoSlugs.has(page.slug),
);

export const allSeoPages = [...coreSeoPages, ...publishedProgrammaticSeoPages];

export function getProgrammaticSeoPage(slug: string) {
  return publishedProgrammaticSeoPages.find((page) => page.slug === slug);
}
