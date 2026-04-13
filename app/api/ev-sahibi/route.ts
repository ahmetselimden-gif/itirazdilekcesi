import { NextResponse } from "next/server";

type EvSahibiRequest = {
  fullName?: string;
  address?: string;
  counterpartyName?: string;
  rentedAddress?: string;
  problemType?: string;
  explanation?: string;
  institution?: string;
};

const requiredFields: Array<keyof EvSahibiRequest> = [
  "fullName",
  "address",
  "counterpartyName",
  "rentedAddress",
  "problemType",
  "explanation",
  "institution",
];

function generateDocumentNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `EV-${timestamp.toString().slice(-6)}-${random.toString().padStart(4, '0')}`;
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('tr-TR', options);
}

export async function POST(request: Request) {
  const body = (await request.json()) as EvSahibiRequest;

  const hasMissingField = requiredFields.some((field) => !body[field]?.trim());
  if (hasMissingField) {
    return NextResponse.json({ error: "Lütfen tüm alanları doldurun." }, { status: 400 });
  }

  const documentNumber = generateDocumentNumber();
  const today = new Date();
  const todayFormatted = formatDate(today);

  const petition = `═══════════════════════════════════════════════════════════════

                       SULH HUKUK MAHKEMESİ
                       İTİRAZ DİLEKÇESİ

═══════════════════════════════════════════════════════════════

Belge No:                    ${documentNumber}
Sunuş Tarihi:                ${todayFormatted}


BAŞVURU SAHİBİ BİLGİLERİ
───────────────────────────────────────────────────────────────

Ad Soyad:                    ${body.fullName}
Adresi:                      ${body.address}


MUHATAP (KİRACı) BİLGİLERİ
───────────────────────────────────────────────────────────────

Adı Soyadı:                  ${body.counterpartyName}
Kiralanan Taşınmaz Adresi:   ${body.rentedAddress}


KONU
───────────────────────────────────────────────────────────────

${body.problemType} nedeniyle ev sahibi tarafından itiraz dilekçesi


AÇIKLAMALAR VE HUKUKİ DAYANAK
───────────────────────────────────────────────────────────────

1. TARAFLAR VE İLİŞKİ:

   Ben, ${body.fullName}, ${body.address} adresinde ikamet etmektedir.
   ${body.counterpartyName} ile aramızdaki kiracılık ilişkisi kapsamında
   kiralanan taşınmazın adresi ${body.rentedAddress} olup, taraflar
   arasında yazılı kira sözleşmesi mevcuttur.


2. UYUŞMAZLIĞIN ÖZÜ:

   ${body.problemType} konusu nedeniyle önemli uyuşmazlık ortaya çıkmıştır.
   Belirtilen konu, kiracılık ilişkisinin düzenlenmesi ve korunması açısından
   ev sahibinin temel haklarının kullanılması için önem taşımaktadır.


3. YAŞANAN SORUNUN DETAYLARı:

   ${body.explanation}


4. HUKUKİ TALEP VE SONUÇ:

   Yukarıda arz edilen tüm nedenlerle itirazımın kabulünü, konu hakkında
   gerekli incelemenin yapılmasını ve yaşanan durumun olumsuz
   sonuçlarının ortadan kaldırılmasını talep ederim.


───────────────────────────────────────────────────────────────

Gereğini arz ve takdim ederim.


İmza Alanı:                  _______________________________


Yazılı Ad Soyad:             ${body.fullName}


Sunuş Tarihi:                _______________________________


═══════════════════════════════════════════════════════════════

DİLEKÇE SUNMA BİLGİLERİ

Mahkeme:       ${body.institution}
Sunma Süresi:  15 gün içinde
Bilgi:         Dilekçe imzalanmalı ve ekli belgelerle birlikte
               sunulmalıdır.

═══════════════════════════════════════════════════════════════`;

  return NextResponse.json({ petition });
}
