import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";

type PdfRequest = {
  fullName?: string;
  address?: string;
  counterpartyName?: string;
  rentedAddress?: string;
  problemType?: string;
  explanation?: string;
  institution?: string;
};

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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PdfRequest;

    // Validate required fields
    const requiredFields = ['fullName', 'address', 'counterpartyName', 'rentedAddress', 'problemType', 'explanation', 'institution'];
    const hasMissingField = requiredFields.some((field) => !body[field as keyof PdfRequest]?.toString().trim());

    if (hasMissingField) {
      return NextResponse.json({ error: "Eksik bilgi. Lütfen tüm alanları kontrol edin." }, { status: 400 });
    }

    const documentNumber = generateDocumentNumber();
    const today = new Date();
    const todayFormatted = formatDate(today);

    // Create PDF document
    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
    });

    // Collect PDF data
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // Header
    doc.fontSize(12).font('Helvetica-Bold').text('SULH HUKUK MAHKEMESİ', { align: 'center' });
    doc.fontSize(12).font('Helvetica-Bold').text('İTİRAZ DİLEKÇESİ', { align: 'center' });
    doc.moveDown(0.5);

    // Separator line
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Document info
    doc.fontSize(10).font('Helvetica').text(`Belge No: ${documentNumber}`);
    doc.text(`Sunuş Tarihi: ${todayFormatted}`);
    doc.moveDown(1);

    // Applicant info
    doc.fontSize(11).font('Helvetica-Bold').text('BAŞVURU SAHİBİ BİLGİLERİ');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Ad Soyad: ${body.fullName}`);
    doc.text(`Adresi: ${body.address}`);
    doc.moveDown(0.8);

    // Counterparty info
    doc.fontSize(11).font('Helvetica-Bold').text('MUHATAP (KİRACı) BİLGİLERİ');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Adı Soyadı: ${body.counterpartyName}`);
    doc.text(`Kiralanan Taşınmaz Adresi: ${body.rentedAddress}`);
    doc.moveDown(0.8);

    // Subject
    doc.fontSize(11).font('Helvetica-Bold').text('KONU');
    doc.fontSize(10).font('Helvetica').text(`${body.problemType} nedeniyle ev sahibi tarafından itiraz dilekçesi`);
    doc.moveDown(0.8);

    // Explanations
    doc.fontSize(11).font('Helvetica-Bold').text('AÇIKLAMALAR VE HUKUKİ DAYANAK');
    doc.fontSize(10).font('Helvetica');

    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').text('1. TARAFLAR VE İLİŞKİ:', { continued: false });
    doc.font('Helvetica').text(
      `Ben, ${body.fullName}, ${body.address} adresinde ikamet etmektedir. ${body.counterpartyName} ile aramızdaki kiracılık ilişkisi kapsamında kiralanan taşınmazın adresi ${body.rentedAddress} olup, taraflar arasında yazılı kira sözleşmesi mevcuttur.`,
      { align: 'justify' }
    );

    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').text('2. UYUŞMAZLIĞIN ÖZÜ:', { continued: false });
    doc.font('Helvetica').text(
      `${body.problemType} konusu nedeniyle önemli uyuşmazlık ortaya çıkmıştır. Belirtilen konu, kiracılık ilişkisinin düzenlenmesi ve korunması açısından ev sahibinin temel haklarının kullanılması için önem taşımaktadır.`,
      { align: 'justify' }
    );

    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').text('3. YAŞANAN SORUNUN DETAYLARı:', { continued: false });
    doc.font('Helvetica').text(body.explanation, { align: 'justify' });

    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').text('4. HUKUKİ TALEP VE SONUÇ:', { continued: false });
    doc.font('Helvetica').text(
      `Yukarıda arz edilen tüm nedenlerle itirazımın kabulünü, konu hakkında gerekli incelemenin yapılmasını ve yaşanan durumun olumsuz sonuçlarının ortadan kaldırılmasını talep ederim.`,
      { align: 'justify' }
    );

    doc.moveDown(1);

    // Separator line
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Closing statement
    doc.fontSize(10).font('Helvetica-Bold').text('Gereğini arz ve takdim ederim.');
    doc.moveDown(1.5);

    // Signature area
    doc.fontSize(10).font('Helvetica').text('İmza Alanı: _________________________________');
    doc.moveDown(0.8);
    doc.text(`Yazılı Ad Soyad: ${body.fullName}`);
    doc.moveDown(0.8);
    doc.text('Sunuş Tarihi: _________________________________');

    doc.moveDown(1);

    // Footer separator
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Court submission info
    doc.fontSize(10).font('Helvetica-Bold').text('DİLEKÇE SUNMA BİLGİLERİ');
    doc.fontSize(9).font('Helvetica');
    doc.text(`Mahkeme: ${body.institution}`);
    doc.text('Sunma Süresi: 15 gün içinde');
    doc.text('Bilgi: Dilekçe imzalanmalı ve ekli belgelerle birlikte sunulmalıdır.');

    // End document
    doc.end();

    // Wait for PDF generation to complete
    return new Promise((resolve) => {
      doc.on('finish', () => {
        const buffer = Buffer.concat(chunks);
        resolve(
          new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="Dilekce-${documentNumber}.pdf"`,
              'Content-Length': buffer.length.toString(),
            },
          })
        );
      });
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF oluşturulurken hata meydana geldi.' },
      { status: 500 }
    );
  }
}
