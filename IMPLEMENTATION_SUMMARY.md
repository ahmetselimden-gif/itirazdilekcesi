# Kiracı/Ev Sahibi Dilekçe Sistemi - İmplementasyon Özeti

## 📦 Yeni Dosyalar

### 1. **components/FormField.tsx** ✅
Reusable form field bileşeni. Tüm form alanlarının standart yapısını sağlar.

**Özellikler:**
- Label, placeholder, hint, example desteği
- Error mesajı gösterimi
- Input, textarea, select türleri
- Gerekli alan işareti (red asterisk)

```typescript
<FormField
  id="fullName"
  label="Ad Soyad"
  placeholder="Ali Yılmaz"
  hint="Dilekçeyi sunacak kişinin tam adı"
  example="Örnek: Mehmet Ahmet Çelik"
  value={form.fullName}
  onChange={(val) => updateField("fullName", val)}
  error={formErrors.fullName}
/>
```

---

### 2. **lib/courts-info.ts** ✅
Mahkeme bilgileri veritabanı. Problem türüne göre dinamik mahkeme bilgileri sağlar.

**İçeriği:**
- Kiracı (kiraci) için 5 problem türü
- Ev Sahibi (evsahibi) için 5 problem türü
- Her tür için: adı, adresi, telefonu, özel notu

```typescript
COURTS_BY_ISSUE = {
  kiraci: {
    "Haksız kira artışı": {
      name: "Sulh Hukuk Mahkemesi",
      address: "...",
      phone: "...",
      note: "Kira artışı itirazı için başvuru süresi 15 gündür."
    }
    // ... more
  }
}
```

---

### 3. **app/api/kiraci/pdf/route.ts** ✅
Kiracı PDF generation API route. PostScript'ten PDF dosyası oluşturur.

**Özellikleri:**
- A4 formatında professional PDF
- Belge numarası (KRC-xxxxx-xxxx)
- Tarih otomatik olarak ekleniyor
- İmza alanları ve mahkeme bilgileri

---

### 4. **app/api/ev-sahibi/pdf/route.ts** ✅
Ev Sahibi PDF generation API route. (Kiracı ile aynı yapı, EV- prefix ile)

---

### 5. **app/api/odeme/paytr/route.ts** ✅
PayTR ödeme başlatma API route.

**POST Endpoint Parametreleri:**
```json
{
  "type": "kiraci" | "evsahibi",
  "product": "housing-pdf",
  "formData": { fullName, address, ... }
}
```

**Yanıt:**
```json
{
  "success": true,
  "token": "paytr_token_...",
  "redirectUrl": "/odeme/paytr?token=..."
}
```

---

### 6. **app/api/odeme/paytr-callback/route.ts** ✅
PayTR callback verificatio. Ödeme sonucunu doğrular ve kaydeder.

**Özellikleri:**
- Hash imza doğrulması
- PayTR status query
- Ödeme kaydı (veritabanı entegrasyonu için hazır)

---

### 7. **app/api/odeme/paytr-sonuc/route.ts** ✅
PayTR başarı sonucu işleme. Ödeme başarılıysa PDF'i direkt oluşturarak indirir.

---

### 8. **app/odeme/housing-pdf/page.tsx** ✅
PayTR ödeme başarısı sayfası. Formu decoding ederek PDF'i oluşturur ve otomatik olarak indirir.

**Akış:**
1. Ödeme sonrası bu sayfaya yönlendir
2. Form data'sını base64'ten decode et
3. PDF generation API'yi çağır
4. Blob URL oluştur
5. Otomatik download başlat
6. Success mesajı göster

---

## 📝 Değiştirilmiş Dosyalar

### 1. **components/HousingPetitionTool.tsx** ✅
Büyük refactoring yapıldı.

**Değişiklikler:**
- Raw HTML input'lar → FormField bileşenleri
- Form validation sistemi eklendi
- Dynamic court info display eklendi
- TALIMATLAR (instructions) bölümü eklendi
- İki kolulu layout (form | preview)
- Kişisel Bilgiler ve Uyuşmazlık Detayları grup isimleri
- Copy button ve PDF Download button eklendi
- Court info box preview'da gösteriliyor
- PDF indir → PayTR payment flow'a güncellendi

**Form Alanları:**
- fullName (text)
- address (text)
- counterpartyName (text)
- rentedAddress (text)
- problemType (select) → Dinamik mahkeme bilgisi trigger'ı
- institution (text) → Example dinamik olarak güncelleniyor
- explanation (textarea)

**UI Bölümleri:**
1. TALIMATLAR (başta)
2. Kişisel Bilgiler (Ad Soyad, Adres)
3. Uyuşmazlık Detayları (5 alan)
4. Dilekçe Önizleme (sağ panel)
   - Mahkeme Bilgileri (dinamik)
   - TEXT Preview
   - Copy + PDF İndir Buttons

---

### 2. **app/api/kiraci/route.ts** ✅
Professional petition template'i eklendi.

**Yeni Yapı:**
```
SULH HUKUK MAHKEMESİ
İTİRAZ DİLEKÇESİ
────────────────
Belge No: KRC-xxxxx-xxxx
Sunuş Tarihi: [Tarih]

BAŞVURU SAHİBİ BİLGİLERİ
MUHATAP (KARŞI TARAF) BİLGİLERİ
KONU

AÇIKLAMALAR VE HUKUKİ DAYANAK
1. TARAFLAR VE İLİŞKİ
2. UYUŞMAZLIĞIN ÖZÜ
3. YAŞANAN SORUNUN DETAYLARı
4. HUKUKİ TALEP VE SONUÇ

Gereğini arz ve takdim ederim.

İmza Alanı: _____
Yazılı Ad Soyad: [Ad]
Sunuş Tarihi: _____

DİLEKÇE SUNMA BİLGİLERİ
Mahkeme: [Kurum]
Sunma Süresi: 15 gün içinde
```

**Helper Functions:**
- `generateDocumentNumber()` → Unique belge numarası
- `formatDate()` → Türkçe tarih formatı

---

### 3. **app/api/ev-sahibi/route.ts** ✅
Kiracı ile aynı yapı, ev sahibi-spesifik mesajlarla.

**Farklılıklar:**
- "ev sahibi tarafından itiraz" ifadesi
- "MUHATAP (KİRACı)" başlığı
- Ev sahibi-spesifik paragraph 2 metni
- Document number: EV-xxxxx-xxxx

---

## 🔄 System Flow

### 1️⃣ Form Doldurma
```
User → Kiracı/Ev Sahibi Page → FormField'lar doldur → Validation
```

### 2️⃣ Dilekçe Oluşturma
```
"Dilekçemi Oluştur" → POST /api/kiraci (atau /api/ev-sahibi)
→ Professional template generate → TEXT preview göster
```

### 3️⃣ Mahkeme Bilgisi
```
Problem Türü seç → getCourtInfo() → Dynamic court box update
```

### 4️⃣ PDF İndir & Ödeme
```
"PDF İndir (19.99₺)" → POST /api/odeme/paytr 
→ PayTR iframe → User payment 
→ /odeme/housing-pdf (success) 
→ PDF generate + auto download
```

---

## 🔐 Security & Validation

### Client-side Validation
- All required fields checked
- FormField component'i hata gösterimi
- Loading state während API call

### Server-side Validation
- POST routes'ta required fields kontrol
- Form data validation
- Error response handling

### PayTR Security
- Hash verification (verifyPaytrCallbackHash)
- Payment status query double-check
- HTTPS enforced (production'da)

---

## 📦 Dependencies

**Yeni bağımlılıklar - ZATEN YÜKLÜ:**
- `pdfkit` (^0.18.0) - PDF generation
- `@types/pdfkit` (^0.17.5) - TypeScript types

---

## 🌍 Environment Variables

Gerekli `.env.local` değişkenleri:

```env
# PayTR Credentials
PAYTR_MERCHANT_ID=xxxxx
PAYTR_MERCHANT_KEY=xxxxx
PAYTR_MERCHANT_SALT=xxxxx

# Mode
PAYTR_TEST_MODE=true (development için)
PAYTR_TEST_MODE=false (production için)

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000 (development)
NEXT_PUBLIC_APP_URL=https://www.yourdomain.com (production)
```

---

## 📊 File Structure

```
app/
├── api/
│   ├── kiraci/
│   │   ├── route.ts (updated) ✅
│   │   └── pdf/
│   │       └── route.ts (new) ✅
│   ├── ev-sahibi/
│   │   ├── route.ts (updated) ✅
│   │   └── pdf/
│   │       └── route.ts (new) ✅
│   └── odeme/
│       ├── paytr/
│       │   └── route.ts (new) ✅
│       ├── paytr-callback/
│       │   └── route.ts (new) ✅
│       └── paytr-sonuc/
│           └── route.ts (new) ✅
├── odeme/
│   ├── paytr/ (existing)
│   ├── paytr-sonuc/ (existing)
│   └── housing-pdf/ (new) ✅
│       └── page.tsx (new) ✅
├── kiraci/ (existing)
│   └── page.tsx (unchanged)
└── ev-sahibi/ (existing)
    └── page.tsx (unchanged)

components/
├── HousingPetitionTool.tsx (updated) ✅
├── FormField.tsx (new) ✅
└── ... (other existing components)

lib/
├── courts-info.ts (new) ✅
├── paytr.ts (existing)
└── ... (other existing libs)
```

---

## ✅ Implementation Checklist

- [x] FormField reusable component
- [x] Courts info database
- [x] HousingPetitionTool refactor
- [x] Professional petition templates
- [x] PDF generation routes
- [x] PayTR payment initialization
- [x] PayTR callback handling
- [x] PDF success page
- [x] Document numbering system
- [x] Dynamic court information
- [x] Form validation
- [x] Error handling

---

## 🧪 Testing

### Local Testing
```bash
npm run dev
# Visit http://localhost:3000/kiraci or /ev-sahibi
# Test with .env.local PAYTR_TEST_MODE=true
# Use PayTR test card: 4111 1111 1111 1111 / 12/25 / 123
```

### Production Checklist
- [ ] PAYTR_TEST_MODE=false
- [ ] Real PayTR credentials
- [ ] HTTPS enabled
- [ ] Callback URLs verified
- [ ] Email notifications (optional)
- [ ] Database backup (if applicable)

---

## 🎯 Sonraki Adımlar (Future)

1. **Database Integration**
   - Payment records store
   - PDF history tracking
   - User accounts (optional)

2. **Email Notifications**
   - Payment success email
   - PDF delivery email
   - Receipt generation

3. **Analytics**
   - Payment tracking
   - Form submission metrics
   - PDF download stats

4. **Admin Panel**
   - Court info management
   - Problem type management
   - Payment monitoring
   - PDF download history

5. **Additional Features**
   - Multiple language support
   - Digital signature integration
   - Document archiving
   - Lawyer review system

---

## 📞 Support

Herhangi bir sorun veya soru için:
1. TEST_CHECKLIST.md'deki kontrol listesini tamamla
2. Hata mesajlarını console'dan kontrol et
3. Network tab'ında API responses kontrol et
4. PayTR test mode'unun aktif olduğunu doğrula

---

**Son Güncelleme:** 2026-04-13  
**Version:** 1.0.0  
**Status:** Ready for Testing ✅
