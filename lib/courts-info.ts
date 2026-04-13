export type CourtInfo = {
  name: string;
  address: string;
  phone: string;
  note?: string;
};

export const COURTS_BY_ISSUE = {
  kiraci: {
    "Haksız kira artışı": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Kira artışı itirazı için başvuru süresi 15 gündür.",
    },
    "Tahliye baskısı": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Acele talep prosedürü uygulanabilir.",
    },
    "Depozito iadesi": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Depozito iadesinde teslim tutanağı önemlidir.",
    },
    "Sözleşme ihlali": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Sözleşme ihlali için somut deliller sunmalısınız.",
    },
    "Diğer": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Detaylar için mahkeme kalemini arayın.",
    },
  },
  evsahibi: {
    "Kira ödememe": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Ödeme dönemini ve tutarını açıkça belirtin.",
    },
    "Tahliye talebi": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Tahliye talebinde yasal sebepleri açıkça yazın.",
    },
    "Sözleşme ihlali": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Sözleşme maddesini ve ihlalin nedenini belirtin.",
    },
    "Eve zarar verme": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Hasar fotoğrafları ve tamirat faturalarını ekleyin.",
    },
    "Diğer": {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
      note: "Detaylar için mahkeme kalemini arayın.",
    },
  },
};

export const getCourtInfo = (
  type: "kiraci" | "evsahibi",
  issue: string
): CourtInfo => {
  const courts = COURTS_BY_ISSUE[type];
  return (
    courts[issue as keyof typeof courts] || courts["Diğer"] || {
      name: "Sulh Hukuk Mahkemesi",
      address: "Kiralanan taşınmazın bulunduğu yer mahkemesi",
      phone: "İlgili adliyeye danışınız",
    }
  );
};
