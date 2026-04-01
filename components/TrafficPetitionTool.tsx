"use client";

import { FormEvent, useId, useState } from "react";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import PetitionDocument from "@/components/PetitionDocument";
import type {
  TrafficFormData,
  TrafficGenerationResult,
} from "@/lib/trafficPetition";

const defaultForm: TrafficFormData = {
  fullName: "",
  tckn: "",
  plate: "",
  penaltyDate: "",
  notificationDate: "",
  penaltyType: "Kırmızı ışık",
  location: "",
  cameraStatus: "Bilmiyorum",
  institution: "",
  explanation: "",
};

const fieldClassName =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink outline-none transition duration-200 placeholder:text-muted/65 focus:border-navy focus:ring-4 focus:ring-navy/10";

const textareaClassName =
  "min-h-40 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] leading-7 text-ink outline-none transition duration-200 placeholder:text-muted/65 focus:border-navy focus:ring-4 focus:ring-navy/10";

const primaryButtonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-navy px-5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-55";

export default function TrafficPetitionTool() {
  const fullNameId = useId();
  const tcknId = useId();
  const plateId = useId();
  const penaltyDateId = useId();
  const notificationDateId = useId();
  const penaltyTypeId = useId();
  const locationId = useId();
  const cameraStatusId = useId();
  const institutionId = useId();
  const explanationId = useId();

  const [form, setForm] = useState<TrafficFormData>(defaultForm);
  const [result, setResult] = useState<TrafficGenerationResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [approvalInfo, setApprovalInfo] = useState(false);
  const [approvalKvkk, setApprovalKvkk] = useState(false);

  const updateField = (key: keyof TrafficFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validateForm = () => {
    const trimmedTckn = (form.tckn || "").trim();

    if (trimmedTckn && !/^\d{11}$/.test(trimmedTckn)) {
      return "TCKN alanı yalnızca 11 haneli rakamlardan oluşmalıdır.";
    }

    if (
      form.penaltyDate &&
      form.notificationDate &&
      form.notificationDate < form.penaltyDate
    ) {
      return "Tebliğ tarihi, ceza tarihinden önce olamaz.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    setShowPayment(false);
    setPaymentReady(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as
        | TrafficGenerationResult
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          ("error" in data && data.error) || "Dilekçe oluşturulamadı."
        );
      }

      if (!("petition" in data)) {
        throw new Error("Dilekçe oluşturulamadı.");
      }

      setResult(data);
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

  return (
    <section
      id="dilekce-araci"
      className="overflow-hidden rounded-[28px] border border-line/80 bg-surface shadow-[0_24px_60px_rgba(17,34,51,0.08)]"
    >
      <div className="border-b border-line/70 px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
              <span className="h-px w-8 bg-navy/30" />
              Dilekçe aracı
            </span>
            <h2 className="mt-3 font-display text-4xl text-navy-deep">Trafik cezası itiraz formu</h2>
            <p className="mt-3 text-[15px] leading-8 text-muted">
              Zorunlu alanları doldurun, oluşturulan metni inceleyin ve ardından PDF indirme adımına geçin.
            </p>
          </div>

          <div className="grid min-w-[280px] grid-cols-2 gap-3">
            <div className="rounded-2xl border border-line bg-surface-soft px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy">Fiyat</p>
              <p className="mt-2 text-sm font-semibold text-ink">19,99 TL</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-soft px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy">Çıktı</p>
              <p className="mt-2 text-sm font-semibold text-ink">Resmi PDF dilekçe</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
        <div className="rounded-[24px] border border-line/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f9f6ef_100%)] p-5 sm:p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor={fullNameId} className="text-sm font-bold text-navy">
                  Ad Soyad
                </label>
                <input
                  id={fullNameId}
                  className={fieldClassName}
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={tcknId} className="text-sm font-bold text-navy">
                  TCKN
                </label>
                <input
                  id={tcknId}
                  className={fieldClassName}
                  value={form.tckn}
                  onChange={(event) =>
                    updateField("tckn", event.target.value.replace(/\D/g, ""))
                  }
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="Opsiyonel"
                />
                <p className="text-xs leading-6 text-muted">
                  Girilecekse TCKN yalnızca 11 haneli rakamlardan oluşmalıdır.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor={plateId} className="text-sm font-bold text-navy">
                  Plaka
                </label>
                <input
                  id={plateId}
                  className={fieldClassName}
                  value={form.plate}
                  onChange={(event) => updateField("plate", event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={penaltyDateId} className="text-sm font-bold text-navy">
                  Ceza Tarihi
                </label>
                <input
                  id={penaltyDateId}
                  type="date"
                  className={fieldClassName}
                  value={form.penaltyDate}
                  onChange={(event) => updateField("penaltyDate", event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={notificationDateId} className="text-sm font-bold text-navy">
                  Tebliğ Tarihi
                </label>
                <input
                  id={notificationDateId}
                  type="date"
                  className={fieldClassName}
                  value={form.notificationDate}
                  min={form.penaltyDate || undefined}
                  onChange={(event) => updateField("notificationDate", event.target.value)}
                  required
                />
                <p className="text-xs leading-6 text-muted">
                  Eğer ceza kağıdı eve gelmediyse bugünün tarihini girerek devam edebilirsiniz. Tebliğ tarihi, ceza tarihinden önce olamaz.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor={penaltyTypeId} className="text-sm font-bold text-navy">
                  Ceza Türü
                </label>
                <select
                  id={penaltyTypeId}
                  className={fieldClassName}
                  value={form.penaltyType}
                  onChange={(event) => updateField("penaltyType", event.target.value)}
                >
                  <option>Kırmızı ışık</option>
                  <option>Hız ihlali</option>
                  <option>Park cezası</option>
                  <option>Diğer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor={locationId} className="text-sm font-bold text-navy">
                  Ceza Yeri
                </label>
                <input
                  id={locationId}
                  className={fieldClassName}
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="İstanbul / Kadıköy"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={cameraStatusId} className="text-sm font-bold text-navy">
                  Kamera / Radar Durumu
                </label>
                <select
                  id={cameraStatusId}
                  className={fieldClassName}
                  value={form.cameraStatus}
                  onChange={(event) => updateField("cameraStatus", event.target.value)}
                >
                  <option>Var</option>
                  <option>Yok</option>
                  <option>Bilmiyorum</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor={institutionId} className="text-sm font-bold text-navy">
                Kurum Adı
              </label>
              <input
                id={institutionId}
                className={fieldClassName}
                value={form.institution}
                onChange={(event) => updateField("institution", event.target.value)}
                placeholder="Boş bırakırsanız ceza yerine göre mahkeme otomatik oluşturulur"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={explanationId} className="text-sm font-bold text-navy">
                Açıklama
              </label>
              <textarea
                id={explanationId}
                className={textareaClassName}
                value={form.explanation}
                onChange={(event) => updateField("explanation", event.target.value)}
                placeholder="Ceza neden haksız, usul veya delil eksikliği varsa yazın"
                required
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className={primaryButtonClassName} disabled={isLoading}>
                {isLoading ? "Dilekçe hazırlanıyor..." : "Dilekçeyi Gör"}
              </button>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-danger">
                {error}
              </div>
            ) : null}
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-line/80 bg-surface p-5 shadow-[0_18px_40px_rgba(17,34,51,0.05)] sm:p-6">
            {!result ? (
              <div className="flex min-h-56 items-center justify-center rounded-[20px] border border-dashed border-line bg-surface-soft px-6 text-center text-[15px] leading-8 text-muted">
                Dilekçeniz burada resmi evrak düzenine yakın bir önizleme olarak gösterilecektir.
              </div>
            ) : (
              <>
                <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                  <h4 className="text-base font-bold text-navy">Değerlendirme</h4>
                  <div className="mt-3 flex items-center justify-between gap-4 border-b border-line/80 pb-3 text-sm text-navy">
                    <span>İtiraz gücü</span>
                    <strong className="text-base">{result.evaluationLevel}</strong>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{result.evaluationComment}</p>
                </div>

                <div className="mt-5">
                  <h3 className="font-display text-3xl text-navy-deep">Dilekçe Önizleme</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    PDF çıktısına yalnızca dilekçe metni dahil edilir.
                  </p>
                </div>

                <div className="mt-5 rounded-[22px] border border-line bg-white p-4 sm:p-6">
                  <PetitionDocument petition={result.petition} />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={primaryButtonClassName}
                    onClick={() => setShowPayment(true)}
                  >
                    PDF indir (19,99 TL)
                  </button>
                </div>
              </>
            )}
          </div>

          {result && showPayment ? (
            <div className="rounded-[24px] border border-line/80 bg-surface p-5 shadow-[0_18px_40px_rgba(17,34,51,0.05)] sm:p-6">
              <h3 className="font-display text-3xl text-navy-deep">Ödeme Kontrolü</h3>
              <p className="mt-3 text-[15px] leading-8 text-muted">
                PDF indirme işlemi ödeme ve yasal onay kontrolüne bağlıdır. Bu alan, iyzico entegrasyonuna hazır placeholder olarak düzenlenmiştir.
              </p>

              <div className="mt-5 space-y-4 rounded-[20px] border border-line bg-surface-soft p-5">
                <div>
                  <h4 className="text-sm font-bold text-navy">Ön Bilgilendirme</h4>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    Hizmet, kullanıcı tarafından girilen bilgilere göre dijital dilekçe PDF&apos;i oluşturulmasıdır. Toplam bedel 19,99 TL&apos;dir. Teslimat, ödeme sonrası dijital olarak anında yapılır.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-navy">Ödeme ve Teslimat Notu</h4>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    iyzico Checkout Form entegrasyonunda ödeme sonucu callback üzerinden doğrulanacak ve ödeme sonucu ayrıca token ile sorgulanacaktır.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-navy">KVKK Aydınlatması</h4>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    Ad, TCKN, plaka ve başvuru içeriği; dilekçe oluşturma, ödeme doğrulama ve kullanıcı destek süreçleri amacıyla işlenir.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-navy">Mesafeli Sözleşme Notu</h4>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    Dijital teslimatın ödeme sonrası anında başlayacağı durumlarda cayma hakkına ilişkin sonuçlar sözleşmede açık biçimde belirtilmelidir.
                  </p>
                </div>

                <label className="flex items-start gap-3 rounded-xl border border-line/80 bg-white px-4 py-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={approvalInfo}
                    onChange={(event) => setApprovalInfo(event.target.checked)}
                  />
                  <span>Mesafeli Satış Sözleşmesini okudum, onaylıyorum.</span>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-line/80 bg-white px-4 py-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={approvalKvkk}
                    onChange={(event) => setApprovalKvkk(event.target.checked)}
                  />
                  <span>KVKK Aydınlatma Metni&apos;ni okudum.</span>
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={primaryButtonClassName}
                  disabled={!approvalInfo || !approvalKvkk}
                  onClick={() => setPaymentReady(true)}
                >
                  Ödemeyi tamamla
                </button>
                <PdfDownloadButton
                  elementId="petition-pdf-document"
                  fileName="trafik-cezasi-itiraz-dilekcesi.pdf"
                  disabled={!paymentReady || !approvalInfo || !approvalKvkk}
                />
              </div>
            </div>
          ) : null}

          <div className="rounded-[20px] border border-gold/45 bg-gold-soft/45 px-5 py-4 text-sm leading-7 text-muted">
            <strong className="text-navy">Yasal Uyarı:</strong> Bu site bir avukatlık hizmeti vermemektedir. Sadece kullanıcının beyan ettiği bilgilerle teknik olarak dilekçe oluşturma asistanlığı yapmaktadır. Alınan dilekçenin hukuki sonuçlarından kullanıcı sorumludur. Hak kaybına uğramamak için bir avukata danışmanız tavsiye edilir.
          </div>
        </div>
      </div>

      <div className="pdf-stage" aria-hidden="true">
        <div id="petition-pdf-document" className="pdf-document">
          <div className="pdf-paper">{result ? <PetitionDocument petition={result.petition} /> : null}</div>
        </div>
      </div>
    </section>
  );
}
