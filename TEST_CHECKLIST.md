# Kiracı/Ev Sahibi Dilekçe Sistemi - Test Kontrol Listesi

## 🚀 Uygulama Başlatma
- [ ] `npm install` komutu ile bağımlılıkları yükle
- [ ] `.env.local` dosyasında PayTR anahtarlarını kontrol et:
  - `PAYTR_MERCHANT_ID`
  - `PAYTR_MERCHANT_KEY`
  - `PAYTR_MERCHANT_SALT`
  - `PAYTR_TEST_MODE=true` (test ortamı için)
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000` (geliştirme ortamı için)
- [ ] `npm run dev` ile geliştirme sunucusunu başlat
- [ ] http://localhost:3000/kiraci ve http://localhost:3000/ev-sahibi sayfalarına erişebilini kontrol et

---

## 📋 Form UX Testleri

### Form Alanları ve Rehberlik
- [ ] **Ad Soyad** alanı:
  - ℹ️ Hint gösteriyor mu? "Dilekçeyi sunacak kişinin tam adı"
  - Placeholder var mı? "Ali Yılmaz"
  - Example gösteriyor mu? "Örnek: Mehmet Ahmet Çelik"
  - Gerekli alanı işaret var mı? (kırmızı yıldız)

- [ ] **Adres** alanı:
  - ℹ️ Hint doğru mu? "Başvuranın ikametgahı (tam adres)"
  - Placeholder var mı? "Mahallesi, Sokağı, No:..."
  - Example gösteriyor mu? "Örnek: Çemberlitaş Mah. Divan Yolu Cad. No:25 Fatih/İstanbul"

- [ ] **Ev Sahibi/Kiracı Adı** alanı:
  - Kiracı sayfasında "Ev Sahibi Adı" gösteriyor mu?
  - Ev Sahibi sayfasında "Kiracı Adı" gösteriyor mu?
  - Hint ve example gösteriyor mu?

- [ ] **Kiralanan Ev Adresi** alanı:
  - Placeholder ve example doğru mu?
  - Hint yardımcı mı?

- [ ] **Problem Türü** dropdown:
  - Kiracı sayfasında doğru seçenekler var mı?
    - Haksız kira artışı
    - Tahliye baskısı
    - Depozito iadesi
    - Sözleşme ihlali
    - Diğer
  - Ev Sahibi sayfasında doğru seçenekler var mı?
    - Kira ödememe
    - Tahliye talebi
    - Sözleşme ihlali
    - Eve zarar verme
    - Diğer

- [ ] **İtiraz Edilen Kurum** alanı:
  - Example dinamik olarak güncelleniyor mu?
  - Problem türü değişince örnek mahkeme adı değişiyor mu?

- [ ] **Açıklama** textarea:
  - min-h-40 yüksekliği uygun mu?
  - Placeholder gösteriyor mu?

### Form Talimatları (TALIMATLAR)
- [ ] Sayfanın üst kısmında talimatlar kutusu görünüyor mu?
- [ ] 📋 TALIMATLAR başlığı var mı?
- [ ] 5 madde talimatlar gösteriyor mu?
- [ ] ⚠️ ÖNEMLİ uyarısı gösteriyor mu?

### Form Layout
- [ ] Form solda, preview sağda 2 kolonlu layout görünüyor mu?
- [ ] Kişisel Bilgiler ve Uyuşmazlık Detayları grupları var mı?
- [ ] Responsive tasarım mobilde tek kolonda görünüyor mu?

---

## 🏛️ Dinamik Mahkeme Bilgileri Testleri

### Mahkeme Bilgisi Gösterimi
- [ ] Problem türü seçilmeden mahkeme bilgisi gösteriyor mu?
- [ ] Problem türü seçince sağ panelde "Dilekçe Sunma Bilgileri" kutusu görünüyor mu?
- [ ] Mahkeme adı gösteriyor mu?
- [ ] Mahkeme adresi gösteriyor mu? "Kiralanan taşınmazın bulunduğu yer mahkemesi"
- [ ] Telefon gösteriyor mu? "İlgili adliyeye danışınız"
- [ ] Not (açıklama) gösteriyor mu?

### Kiracı Sayfası - Problem Türüne Göre Mahkeme
- [ ] "Haksız kira artışı" → Not: "Kira artışı itirazı için başvuru süresi 15 gündür."
- [ ] "Tahliye baskısı" → Not: "Acele talep prosedürü uygulanabilir."
- [ ] "Depozito iadesi" → Not: "Depozito iadesinde teslim tutanağı önemlidir."
- [ ] "Sözleşme ihlali" → Not: "Sözleşme ihlali için somut deliller sunmalısınız."

### Ev Sahibi Sayfası - Problem Türüne Göre Mahkeme
- [ ] "Kira ödememe" → Not: "Ödeme dönemini ve tutarını açıkça belirtin."
- [ ] "Tahliye talebi" → Not: "Tahliye talebinde yasal sebepleri açıkça yazın."
- [ ] "Sözleşme ihlali" → Not: "Sözleşme maddesini ve ihlalin nedenini belirtin."
- [ ] "Eve zarar verme" → Not: "Hasar fotoğrafları ve tamirat faturalarını ekleyin."

---

## 📝 Dilekçe TEXT Preview Testleri

### Form Doldurma ve Submission
- [ ] Boş form ile "Dilekçemi Oluştur" butonuna tıklayınca hata gösteriyor mu?
- [ ] "❌ Lütfen tüm alanları doldurun" mesajı görünüyor mu?
- [ ] Tüm alanları dolduranca button aktif oluyor mu?

### Dilekçe Format - Professional Structure
- [ ] Dilekçe TEXT preview sağ panelde görünüyor mu?
- [ ] Başlık "SULH HUKUK MAHKEMESİ / İTİRAZ DİLEKÇESİ" var mı?
- [ ] Belge numarası gösteriyor mu? (KRC-xxxxx-xxxx veya EV-xxxxx-xxxx)
- [ ] Tarih gösteriyor mu? (Türkçe format: "Pazartesi, 13 Nisan 2026")

### Dilekçe İçeriği - Yapılandırılmış Bölümler
- [ ] BAŞVURU SAHİBİ BİLGİLERİ bölümü var mı?
- [ ] MUHATAP (KARŞI TARAF) BİLGİLERİ bölümü var mı?
- [ ] KONU bölümü var mı?
- [ ] AÇIKLAMALAR VE HUKUKİ DAYANAK bölümü var mı?
- [ ] Bölüm 1: TARAFLAR VE İLİŞKİ - numaralandırılmış mı?
- [ ] Bölüm 2: UYUŞMAZLIĞIN ÖZÜ - numaralandırılmış mı?
- [ ] Bölüm 3: YAŞANAN SORUNUN DETAYLARı - numaralandırılmış mı?
- [ ] Bölüm 4: HUKUKİ TALEP VE SONUÇ - numaralandırılmış mı?

### Dilekçe Sonlandırma Bölümü
- [ ] "Gereğini arz ve takdim ederim." ifadesi var mı?
- [ ] İmza Alanı: _______________________ var mı?
- [ ] Yazılı Ad Soyad gösteriyor mu?
- [ ] Sunuş Tarihi: _______________________ var mı?

### Dilekçe Altbilgisi
- [ ] DİLEKÇE SUNMA BİLGİLERİ bölümü var mı?
- [ ] Mahkeme adı gösteriyor mu?
- [ ] Sunma Süresi: 15 gün içinde gösteriyor mu?

### Kiracı vs Ev Sahibi Farklılıkları
- [ ] Kiracı sayfasında "kiracı tarafından itiraz" ifadesi var mı?
- [ ] Ev Sahibi sayfasında "ev sahibi tarafından itiraz" ifadesi var mı?
- [ ] Kiracı sayfasında document number KRC- ile başlıyor mu?
- [ ] Ev Sahibi sayfasında document number EV- ile başlıyor mu?

---

## 📋 Copy ve PDF İndir Butonu Testleri

### Copy Butonu
- [ ] "📋 Kopyala" butonu görünüyor mu?
- [ ] Butona tıklayınca dilekçe metni klibinde kopyalanıyor mu?
- [ ] "✅ Dilekçe kopyalandı!" uyarısı görünüyor mu?

### PDF İndir Butonu ve Ödeme Akışı
- [ ] "📥 PDF İndir (19.99₺)" butonu görünüyor mu?
- [ ] Butona tıklayınca loading durumu gösteriyor mu?
- [ ] Loading sırasında "⏳ Dilekçe oluşturuluyor..." mesajı görünüyor mu?

---

## 💳 PayTR Ödeme Testleri

### Ödeme Akışı Başlatma
- [ ] "PDF İndir" butonuna tıklanınca hata olmadan işlem başlıyor mu?
- [ ] /odeme/paytr sayfasına yönlendiriliyor mu?
- [ ] PayTR güvenli ödeme iframe'i yükleniyor mu?

### PayTR Ödeme Sayfası
- [ ] Sayfada "Güvenli ödeme ekranı" başlığı görünüyor mu?
- [ ] PayTR iframe'i yükleniyor mu?
- [ ] "Ödemenizi PayTR güvenli altyapısı üzerinden tamamlayın" açıklaması var mı?

### Test Ödeme (PayTR Test Kartı)
- [ ] TEST_MODE=true ile test kartı kullanabiliyor mu?
- [ ] Test kart numarası: 4111 1111 1111 1111
- [ ] Ay/Yıl: 12/25, CVV: 123
- [ ] Test ödeme başarıyla geçiyor mu?

### Ödeme Başarısı Sonrası
- [ ] /odeme/housing-pdf sayfasına yönlendiriliyor mu?
- [ ] "PDF oluşturuluyor..." loading gösteriyor mu?
- [ ] PDF otomatik olarak indirilmeye başlıyor mu?
- [ ] "✅ İndirme başarılı" mesajı gösteriyor mu?
- [ ] "📥 Yeniden İndir" butonu görünüyor mu?

### PDF Dosyası Kontrol
- [ ] PDF başarıyla indirildi mi?
- [ ] PDF dosya adı "Dilekce-[oid].pdf" formatında mı?
- [ ] PDF açılıyor mu?
- [ ] PDF içeriği professional görünüyor mu?
- [ ] PDF'de tüm bilgiler doğru sırada mı?

---

## ❌ Hata Durumları ve Edge Cases

### Validation Hataları
- [ ] Hiçbir alan doldurmadan submit → "Lütfen tüm alanları doldurun" gösteriyor mu?
- [ ] Sadece Ad Soyad doldurarak submit → Hata gösteriyor mu?
- [ ] Problem türü seçmeden submit → Hata gösteriyor mu?

### Form Alanlarını Temizleme
- [ ] Bir alana yazı yazıp hata gösterildikten sonra, alana yeniden yazınca hata temizleniyor mu?
- [ ] Hata mesajı inline olarak siliniyor mu?

### Ödeme Hataları
- [ ] Geçersiz test kartı ile ödeme başarısız mı?
- [ ] "❌ Ödeme başarısız oldu" hatası gösteriyor mu?
- [ ] Hata sonrası ana sayfaya dönülebiliyor mu?

### Browser Uyumluluğu
- [ ] Chrome'da sorunsuz çalışıyor mu?
- [ ] Firefox'ta sorunsuz çalışıyor mu?
- [ ] Safari'de sorunsuz çalışıyor mu?
- [ ] Edge'de sorunsuz çalışıyor mu?

### Responsive Tasarım
- [ ] Mobilde (375px) sorunsuz görünüyor mu?
- [ ] Tablete (768px) sorunsuz görünüyor mu?
- [ ] Desktopta (1280px) sorunsuz görünüyor mu?

---

## 🎯 Kritik Test Yolları

### Yol 1: Tam Kiracı Akışı
1. http://localhost:3000/kiraci sayfasına git
2. Tüm alanları doldur (örnekler kopyala)
3. "Haksız kira artışı" problem türünü seç
4. Mahkeme bilgisi güncellendiğini kontrol et
5. "Dilekçemi Oluştur" tıkla
6. Dilekçe TEXT preview görüntüle
7. "Kopyala" tıkla ve kopyalandığını kontrol et
8. "PDF İndir (19.99₺)" tıkla
9. PayTR ödeme sayfasına yönlendir
10. Test kartı ile ödeme yap
11. PDF indir
12. PDF içeriğini kontrol et

### Yol 2: Tam Ev Sahibi Akışı
1. http://localhost:3000/ev-sahibi sayfasına git
2. Tüm alanları doldur
3. "Kira ödememe" problem türünü seç
4. Dilekçe oluştur
5. PDF indir ve ödeme yap
6. PDF'i kontrol et

### Yol 3: Farklı Problem Türleri
- Kiracı: "Tahliye baskısı" seç ve mahkeme notu kontrol et
- Kiracı: "Depozito iadesi" seç
- Ev Sahibi: "Tahliye talebi" seç
- Ev Sahibi: "Eve zarar verme" seç

---

## 📊 Sonuç ve Raporlama

### ✅ Başarıya İşaretler
- Tüm form alanları placeholder ve hint gösteriyor
- Dilekçe professional format'ta görünüyor
- Mahkeme bilgileri dinamik olarak güncelleniyor
- PayTR ödeme akışı sorunsuz çalışıyor
- PDF başarıyla oluşturuluyor ve indiriliyor
- Kiracı ve ev sahibi sayfaları bağımsız çalışıyor

### 🐛 Bulunursa Düzeltilecekler
- Herhangi bir UI sorunu (layout, alignment, color)
- Form validation sorunları
- Mahkeme bilgisi hataları
- PDF generation sorunları
- PayTR ödeme akışı sorunları
- Responsive design sorunları

---

## 📝 Test Notları

Testle karşılaştığınız sorunları buraya yazın:

```
[Tarih]: [Sayfa]: [Sorun Açıklaması]
Örnek: 2026-04-13 - Kiracı Sayfası - Ad Soyad inputu placeholder göstermiyor
```

---

## 🚀 Deployment Sonrası

Canlı ortamda test ederken:
- [ ] `PAYTR_TEST_MODE=false` olarak ayarlandı mı?
- [ ] `NEXT_PUBLIC_APP_URL` doğru domain'i gösteriyor mu?
- [ ] Gerçek PayTR anahtarları kullanılıyor mu?
- [ ] SSL certificate kurulu mu? (HTTPS zorunlu)
- [ ] Callback URL'leri doğru kurulu mu?

---

Bu kontrol listesini tamamladıktan sonra sistem production'a hazır hale gelebilir! 🎉
