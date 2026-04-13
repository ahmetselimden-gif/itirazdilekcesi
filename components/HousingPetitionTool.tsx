"use client";

import { FormEvent, useId, useState } from "react";
import FormField from "./FormField";
import { getCourtInfo } from "@/lib/courts-info";

type HousingFormData = {
  fullName: string;
  address: string;
  counterpartyName: string;
  rentedAddress: string;
  problemType: string;
  explanation: string;
  institution: string;
};

type HousingPetitionToolProps = {
  apiPath: "/api/kiraci" | "/api/ev-sahibi";
  eyebrow: string;
  title: string;
  description: string;
  counterpartyLabel: string;
  problemOptions: string[];
};

const defaultForm = (problemType: string): HousingFormData => ({
  fullName: "",
  address: "",
  counterpartyName: "",
  rentedAddress: "",
  problemType,
  explanation: "",
  institution: "",
});

const primaryButtonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-navy px-5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-gold bg-gold px-5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-55";

export default function HousingPetitionTool({
  apiPath,
  eyebrow,
  title,
  description,
  counterpartyLabel,
  problemOptions,
}: HousingPetitionToolProps) {
  const [form, setForm] = useState<HousingFormData>(() => defaultForm(problemOptions[0]));
  const [petition, setPetition] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const updateField = (key: keyof HousingFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((current) => ({ ...current, [key]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = "Ad Soyad boş geçilemez";
    if (!form.address.trim()) errors.address = "Adres boş geçilemez";
    if (!form.counterpartyName.trim()) errors.counterpartyName = "Karşı taraf adı boş geçilemez";
    if (!form.rentedAddress.trim()) errors.rentedAddress = "Kiralanan ev adresi boş geçilemez";
    if (!form.problemType) errors.problemType = "Problem türü seçiniz";
    if (!form.institution.trim()) errors.institution = "İtiraz edilen kurum boş geçilemez";
    if (!form.explanation.trim()) errors.explanation = "Açıklama boş geçilemez";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPetition("");

    if (!validateForm()) {
      setError("❌ Lütfen tüm alanları doldurun");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { petition?: string; error?: string };

      if (!response.ok || !data.petition) {
        throw new Error(data.error || "Dilekçe oluşturulamadı.");
      }

      setPetition(data.petition);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Beklenmeyen bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfDownload = async () => {
    try {
      setError("");
      setIsLoading(true);

      const type = apiPath === "/api/kiraci" ? "kiraci" : "evsahibi";

      // Initialize PayTR payment
      const response = await fetch("/api/odeme/paytr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          product: "housing-pdf",
          formData: form,
        }),
      });

      if (!response.ok) {
        throw new Error("Ödeme sistemi başlatılamadı");
      }

      const data = (await response.json()) as { success?: boolean; redirectUrl?: string; error?: string };

      if (!data.success || !data.redirectUrl) {
        throw new Error(data.error || "Ödeme başlatılamadı");
      }

      window.location.href = data.redirectUrl;
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "PDF indirme işlemi başarısız oldu. Lütfen tekrar deneyin."
      );
      setIsLoading(false);
    }
  };

  const courtInfo =
    form.problemType && (getCourtInfo(
      apiPath === "/api/kiraci" ? "kiraci" : "evsahibi",
      form.problemType
    ) || null);

  return (
    <section className="overflow-hidden rounded-[28px] border border-line/80 bg-surface shadow-[0_24px_60px_rgba(17,34,51,0.08)]">
      <div className="border-b border-line/70 px-5 py-6 sm:px-8">
        <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
          <span className="h-px w-8 bg-navy/30" />
          {eyebrow}
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-navy-deep sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-8 text-muted">{description}</p>
      </div>

      <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
        {/* FORM SECTION */}
        <div className="rounded-[24px] border border-line/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f9f6ef_100%)] p-5 sm:p-6">
          {/* TALIMATLAR */}
          <div className="mb-6 rounded-lg border border-gold/30 bg-gold-soft/30 p-4">
            <p className="text-sm font-bold text-navy">📋 TALIMATLAR</p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>✓ Tüm alanları doldurun (hepsi zorunlu)</li>
              <li>✓ Her alana doğru bilgi girin</li>
              <li>✓ Dilekçeyi kontrol edin</li>
              <li>✓ PDF'i indirin veya kopyalayıp mahkemeye gönderin</li>
              <li>⚠️ Dilekçe imzalanmalıdır ve 15 gün içinde sunulmalıdır</li>
            </ul>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* KİŞİSEL BİLGİLER */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-navy-deep">👤 Kişisel Bilgiler</h3>
              <div className="grid gap-4 md:grid-cols-2">
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
                <FormField
                  id="address"
                  label="Adres"
                  placeholder="Mahallesi, Sokağı, No:..."
                  hint="Başvuranın ikametgahı (tam adres)"
                  example="Örnek: Çemberlitaş Mah. Divan Yolu Cad. No:25 Fatih/İstanbul"
                  value={form.address}
                  onChange={(val) => updateField("address", val)}
                  error={formErrors.address}
                />
              </div>
            </div>

            {/* UYUŞMAZLIK DETAYLARı */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-navy-deep">⚖️ Uyuşmazlık Detayları</h3>
              <div className="grid gap-4">
                <FormField
                  id="counterpartyName"
                  label={counterpartyLabel}
                  placeholder="Karşı tarafın adı..."
                  hint={counterpartyLabel === "Ev Sahibi Adı" ? "Ev sahibinin tam adı" : "Kiracının tam adı"}
                  example="Örnek: Fatma Demir"
                  value={form.counterpartyName}
                  onChange={(val) => updateField("counterpartyName", val)}
                  error={formErrors.counterpartyName}
                />

                <FormField
                  id="rentedAddress"
                  label="Kiralanan Ev Adresi"
                  placeholder="Mahallesi, Sokağı, Apartman No:..."
                  hint="Uyuşmazlığa konu olan taşınmazın tam adresi"
                  example="Örnek: Beşiktaş Mah. Barbaros Bulvarı No:45 D:3 Beşiktaş/İstanbul"
                  value={form.rentedAddress}
                  onChange={(val) => updateField("rentedAddress", val)}
                  error={formErrors.rentedAddress}
                />

                <FormField
                  id="problemType"
                  label="Problem Türü"
                  type="select"
                  selectOptions={problemOptions.map((opt) => ({ value: opt, label: opt }))}
                  hint="Yaşadığınız sorunun türünü seçin"
                  value={form.problemType}
                  onChange={(val) => updateField("problemType", val)}
                  error={formErrors.problemType}
                />

                <FormField
                  id="institution"
                  label="İtiraz Edilen Kurum"
                  placeholder="Mahkeme adı (Sulh Hukuk Mahkemesi vb.)"
                  hint="Dilekçeyi sunacağınız mahkeme veya kurum"
                  example={courtInfo ? `Örnek: ${courtInfo.name}` : "Örnek: Sulh Hukuk Mahkemesi"}
                  value={form.institution}
                  onChange={(val) => updateField("institution", val)}
                  error={formErrors.institution}
                />

                <FormField
                  id="explanation"
                  label="Açıklama"
                  type="textarea"
                  placeholder="Sorunun detaylı açıklamasını yazın..."
                  hint="Probleminizi ayrıntılı şekilde anlatın"
                  example="Örnek: Ev sahibi 2024 başında kira artışı bildiriminde bulundu. Ancak bildirimi TÜFE oranını aştığı için haksız buluyorum..."
                  value={form.explanation}
                  onChange={(val) => updateField("explanation", val)}
                  error={formErrors.explanation}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-danger/25 bg-danger/5 p-4">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <button type="submit" className={primaryButtonClassName} disabled={isLoading}>
              {isLoading ? "⏳ Dilekçe oluşturuluyor..." : "✍️ Dilekçemi Oluştur"}
            </button>
          </form>
        </div>

        {/* PREVIEW SECTION */}
        <div className="rounded-[24px] border border-line/80 bg-surface-soft p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-deep">👀 Dilekçe Önizleme</h2>

          {courtInfo && form.problemType && (
            <div className="mb-4 rounded-lg border border-gold/30 bg-gold-soft/30 p-4">
              <p className="text-xs font-bold text-navy">📍 Dilekçe Sunma Bilgileri</p>
              <div className="mt-3 space-y-2 text-xs text-muted">
                <p><span className="font-semibold">Mahkeme:</span> {courtInfo.name}</p>
                <p><span className="font-semibold">Adres:</span> {courtInfo.address}</p>
                <p><span className="font-semibold">Telefon:</span> {courtInfo.phone}</p>
                {courtInfo.note && (
                  <p><span className="font-semibold">Not:</span> {courtInfo.note}</p>
                )}
              </div>
            </div>
          )}

          {petition ? (
            <div>
              <pre className="max-h-96 overflow-auto rounded-lg border border-line bg-white p-4 text-xs leading-6 text-ink whitespace-pre-wrap break-words">
                {petition}
              </pre>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(petition);
                    alert("✅ Dilekçe kopyalandı!");
                  }}
                  className={primaryButtonClassName}
                >
                  📋 Kopyala
                </button>
                <button
                  onClick={handlePdfDownload}
                  className={secondaryButtonClassName}
                >
                  📥 PDF İndir (19.99₺)
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-line/50 bg-surface-soft p-4 text-center">
              <p className="text-sm text-muted">Formu doldurduktan sonra dilekçe metni burada görünecektir.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
