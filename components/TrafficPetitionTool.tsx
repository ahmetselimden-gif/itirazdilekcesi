"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import EditablePetitionPreview from "@/components/EditablePetitionPreview";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import TurnstileWidget from "@/components/TurnstileWidget";
import {
  PAYMENT_ACCESS_TOKEN_KEY,
  PAYMENT_INITIATE_ENDPOINT,
  PAYMENT_VERIFY_ENDPOINT,
  getCheckoutSnapshotKey,
} from "@/lib/payment";
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

const SNAPSHOT_KEY = getCheckoutSnapshotKey("trafik");
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const fieldClassName =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink outline-none transition duration-200 placeholder:text-muted/65 focus:border-navy focus:ring-4 focus:ring-navy/10";

const textareaClassName =
  "min-h-40 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] leading-7 text-ink outline-none transition duration-200 placeholder:text-muted/65 focus:border-navy focus:ring-4 focus:ring-navy/10";

const primaryButtonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-navy px-6 text-sm font-bold text-white transition duration-200 hover:bg-navy-deep hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none";

type ResultWithToken = TrafficGenerationResult & { petitionToken?: string };

type SnapshotPayload = {
  form: TrafficFormData;
  result: ResultWithToken;
  showPayment: boolean;
};

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
  const [result, setResult] = useState<ResultWithToken | null>(null);
  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentAccessToken, setPaymentAccessToken] = useState("");
  const [approvalInfo, setApprovalInfo] = useState(false);
  const [approvalKvkk, setApprovalKvkk] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const updateField = (key: keyof TrafficFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updatePetitionText = (petition: string) => {
    setResult((current) => (current ? { ...current, petition } : current));
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

  const validatePaymentForm = () => {
    if (form.tckn && !/^\d{11}$/.test(form.tckn)) {
      return "Ödeme için TCKN alanı 11 haneli olmalıdır.";
    }

    if (!result?.petitionToken) {
      return "Dilekçe güvenlik belirteci oluşturulamadı. Lütfen metni yeniden üretin.";
    }

    return "";
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawSnapshot = window.sessionStorage.getItem(SNAPSHOT_KEY);
    if (rawSnapshot) {
      try {
        const snapshot = JSON.parse(rawSnapshot) as SnapshotPayload;
        setForm(snapshot.form);
        setResult(snapshot.result);
        setShowPayment(snapshot.showPayment);
      } catch {
        window.sessionStorage.removeItem(SNAPSHOT_KEY);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const access =
      params.get("access") || window.sessionStorage.getItem(PAYMENT_ACCESS_TOKEN_KEY);
    const merchantOid = params.get("oid") || "";
    const message = params.get("message");
    const restoredPetitionToken = rawSnapshot
      ? (() => {
          try {
            const snapshot = JSON.parse(rawSnapshot) as SnapshotPayload;
            return snapshot.result?.petitionToken || "";
          } catch {
            return "";
          }
        })()
      : "";

    if (message) {
      setPaymentError(message);
    }

    if (payment === "failed") {
      setShowPayment(true);
      setPaymentReady(false);
    }

    const verifyPaytrOrder = async (oid: string, petitionToken: string) => {
      try {
        const response = await fetch(PAYMENT_VERIFY_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oid,
            petitionToken,
          }),
        });
        const data = (await response.json()) as {
          valid?: boolean;
          error?: string;
          accessToken?: string;
        };

        if (!response.ok || !data.valid || !data.accessToken) {
          setShowPayment(true);
          setPaymentReady(false);
          setPaymentAccessToken("");
          setPaymentError(data.error || "PayTR ödeme sonucu doğrulanamadı.");
          window.sessionStorage.removeItem(PAYMENT_ACCESS_TOKEN_KEY);
          return;
        }

        setShowPayment(true);
        setPaymentReady(true);
        setPaymentAccessToken(data.accessToken);
        setPaymentStatusMessage("Ödeme doğrulandı. PDF dosyasını şimdi indirebilirsiniz.");
        window.sessionStorage.setItem(PAYMENT_ACCESS_TOKEN_KEY, data.accessToken);
      } catch {
        setPaymentError("PayTR ödeme doğrulaması sırasında bağlantı hatası oluştu.");
      }
    };

    const verifyToken = async (token: string) => {
      try {
        const response = await fetch(
          `/api/payments/access?token=${encodeURIComponent(token)}`
        );
        const data = (await response.json()) as { valid?: boolean; error?: string };

        if (!response.ok || !data.valid) {
          setPaymentReady(false);
          setPaymentAccessToken("");
          setPaymentError(data.error || "Ödeme doğrulanamadı.");
          window.sessionStorage.removeItem(PAYMENT_ACCESS_TOKEN_KEY);
          return;
        }

        setShowPayment(true);
        setPaymentReady(true);
        setPaymentAccessToken(token);
        setPaymentStatusMessage(
          "Ödeme doğrulandı. PDF dosyasını şimdi indirebilirsiniz."
        );
        window.sessionStorage.setItem(PAYMENT_ACCESS_TOKEN_KEY, token);
      } catch {
        setPaymentError("Ödeme doğrulaması sırasında bağlantı hatası oluştu.");
      }
    };

    if (access) {
      void verifyToken(access);
    }

    if (payment === "success" && merchantOid && restoredPetitionToken) {
      void verifyPaytrOrder(merchantOid, restoredPetitionToken);
    }

    if (payment || access || message) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !result) {
      return;
    }

    const snapshot: SnapshotPayload = {
      form,
      result,
      showPayment,
    };

    window.sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
  }, [form, result, showPayment]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPaymentError("");
    setPaymentStatusMessage("");
    setIsLoading(true);
    setShowPayment(false);
    setPaymentReady(false);
    setPaymentAccessToken("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setError("Lütfen güvenlik doğrulamasını tamamlayın.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          turnstileToken,
        }),
      });

      const data = (await response.json()) as ResultWithToken | { error?: string };

      if (!response.ok) {
        throw new Error(("error" in data && data.error) || "Dilekçe oluşturulamadı.");
      }

      if (!("petition" in data)) {
        throw new Error("Dilekçe oluşturulamadı.");
      }

      setResult(data);
      window.sessionStorage.removeItem(PAYMENT_ACCESS_TOKEN_KEY);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Beklenmeyen bir hata oluştu."
      );
    } finally {
      if (turnstileSiteKey) {
        setTurnstileToken("");
        setTurnstileResetKey((current) => current + 1);
      }
      setIsLoading(false);
    }
  };

  const handlePaymentStart = async () => {
    setPaymentError("");
    setPaymentStatusMessage("");

    const validationError = validatePaymentForm();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    setIsPaymentLoading(true);

    try {
      const response = await fetch(PAYMENT_INITIATE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          tckn: form.tckn,
          petitionToken: result?.petitionToken,
          returnPath: "/trafik-cezasi-itiraz",
        }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Ödeme sayfası açılamadı.");
      }

      window.location.href = data.checkoutUrl;
    } catch (requestError) {
      setPaymentError(
        requestError instanceof Error
          ? requestError.message
          : "Ödeme başlatılırken beklenmeyen bir hata oluştu."
      );
    } finally {
      setIsPaymentLoading(false);
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
            <h2 className="mt-3 font-display text-4xl text-navy-deep">
              Trafik cezası itiraz formu
            </h2>
            <p className="mt-3 text-[15px] leading-8 text-muted">
              Zorunlu alanları doldurun, oluşturulan metni inceleyin ve ardından PDF
              indirme adımına geçin.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-[280px]">
            <div className="rounded-2xl border border-line bg-surface-soft px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy">
                Fiyat
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">19,99 TL</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-soft px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy">
                Çıktı
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">Resmi PDF dilekçe</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
        <div className="rounded-[24px] border border-line/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f9f6ef_100%)] p-5 sm:p-6">
          {/* TALIMATLAR */}
          <div className="mb-6 rounded-lg border border-gold/30 bg-gold-soft/30 p-4">
            <p className="text-sm font-bold text-navy">📋 TALIMATLAR</p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>✓ Tüm alanları doldurun (hepsi zorunlu)</li>
              <li>✓ Ceza tarihi ve tebliğ tarihini doğru girin</li>
              <li>✓ Ceza yeri ve türü açık yazın</li>
              <li>✓ Dilekçeyi kontrol edin</li>
              <li>✓ PDF&apos;i indirin veya mahkemeye gönderin</li>
              <li>⚠️ Dilekçe imzalanmalıdır ve 15 gün içinde sunulmalıdır</li>
            </ul>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* KİŞİSEL BİLGİLER */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-navy-deep">👤 Kişisel Bilgiler</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor={fullNameId} className="text-sm font-bold text-navy">
                    Ad Soyad <span className="text-danger">*</span>
                  </label>
                  <input
                    id={fullNameId}
                    className={fieldClassName}
                    value={form.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    placeholder="Ali Yılmaz"
                    required
                  />
                  <p className="text-xs text-muted/70">
                    <span className="font-semibold">Örnek:</span> Mehmet Ahmet Çelik
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor={tcknId} className="text-sm font-bold text-navy">
                    TC Kimlik No
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
                    placeholder="12345678901"
                  />
                  <p className="text-xs text-muted/70">
                    <span className="font-semibold">Örnek:</span> 12345678901 (11 haneli)
                  </p>
                </div>
              </div>
            </div>

            {/* CEZA DETAYLARı */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-navy-deep">⚖️ Ceza Detayları</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor={plateId} className="text-sm font-bold text-navy">
                    Plaka <span className="text-danger">*</span>
                  </label>
                  <input
                    id={plateId}
                    className={fieldClassName}
                    value={form.plate}
                    onChange={(event) => updateField("plate", event.target.value)}
                    placeholder="34 ABC 1234"
                    required
                  />
                  <p className="text-xs text-muted/70">
                    <span className="font-semibold">Örnek:</span> 34 KMR 5678
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor={penaltyTypeId} className="text-sm font-bold text-navy">
                    Ceza Türü <span className="text-danger">*</span>
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
                  <label htmlFor={penaltyDateId} className="text-sm font-bold text-navy">
                    Ceza Tarihi <span className="text-danger">*</span>
                  </label>
                  <input
                    id={penaltyDateId}
                    type="date"
                    className={fieldClassName}
                    value={form.penaltyDate}
                    onChange={(event) => updateField("penaltyDate", event.target.value)}
                    required
                  />
                  <p className="text-xs text-muted/70">Cezanın yazılı olduğu tarih</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor={notificationDateId} className="text-sm font-bold text-navy">
                    Tebliğ Tarihi <span className="text-danger">*</span>
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
                  <p className="text-xs text-muted/70">
                    Ceza kağıdını teslim alma tarihi. Bilmiyorsanız bugünün tarihini girin.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor={locationId} className="text-sm font-bold text-navy">
                    Ceza Yeri <span className="text-danger">*</span>
                  </label>
                  <input
                    id={locationId}
                    className={fieldClassName}
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    placeholder="İstanbul / Kadıköy, Moda Cad."
                    required
                  />
                  <p className="text-xs text-muted/70">
                    <span className="font-semibold">Örnek:</span> Beşiktaş / Barbaros Bulvarı
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor={cameraStatusId} className="text-sm font-bold text-navy">
                    Kamera / Radar Durumu <span className="text-danger">*</span>
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
                  <p className="text-xs text-muted/70">
                    Ceza yerinde kamera veya radar bulunup bulunmadığını seçin
                  </p>
                </div>
              </div>
            </div>

            {/* İTİRAZ DETAYLARı */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-navy-deep">📝 İtiraz Detayları</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor={institutionId} className="text-sm font-bold text-navy">
                    Kurum Adı
                  </label>
                  <input
                    id={institutionId}
                    className={fieldClassName}
                    value={form.institution}
                    onChange={(event) => updateField("institution", event.target.value)}
                    placeholder="Sulh Ceza Mahkemesi"
                  />
                  <p className="text-xs text-muted/70">
                    Opsiyonel. Boş bırakırsanız ceza yerine göre mahkeme otomatik oluşturulur.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor={explanationId} className="text-sm font-bold text-navy">
                    İtiraz Nedeni <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id={explanationId}
                    className={textareaClassName}
                    value={form.explanation}
                    onChange={(event) => updateField("explanation", event.target.value)}
                    placeholder="Ceza neden haksız? Hangi usul veya delil eksikliği var?"
                    required
                  />
                  <p className="text-xs text-muted/70">
                    <span className="font-semibold">Örnek:</span> Tutanakta araç bilgileri hatalı,
                    radar kaydı sunulmadı, plaka yanlış yazılı vb.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className={primaryButtonClassName}
                disabled={isLoading || Boolean(turnstileSiteKey && !turnstileToken)}
              >
                {isLoading ? "Dilekçe hazırlanıyor..." : "Dilekçeyi Gör"}
              </button>
            </div>

            <TurnstileWidget
              key={turnstileResetKey}
              siteKey={turnstileSiteKey}
              onVerify={(token) => {
                setTurnstileToken(token);
                setError("");
              }}
              onExpire={() => setTurnstileToken("")}
            />

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
                Dilekçeniz burada resmi evrak düzenine yakın bir önizleme olarak
                gösterilecektir.
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

                <EditablePetitionPreview
                  petition={result.petition}
                  isPaid={paymentReady}
                  onChange={updatePetitionText}
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    className={`${primaryButtonClassName} w-full sm:w-auto`}
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-3xl text-navy-deep">Güvenli Ödeme</h3>
                <span className="inline-flex items-center rounded-full border border-line bg-surface-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-navy">
                  Güvenli ödeme
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-8 text-muted">
                PDF indirme işlemi, ödeme doğrulandıktan sonra aktif olur.
              </p>

              <div className="mt-5 space-y-4 rounded-[20px] border border-line bg-surface-soft p-5">
                <div>
                  <h4 className="text-sm font-bold text-navy">Ön Bilgilendirme</h4>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    Hizmet, kullanıcı tarafından girilen bilgilere göre dijital dilekçe PDF&apos;i
                    oluşturulmasıdır. Toplam bedel 19,99 TL&apos;dir. Teslimat, ödeme sonrası dijital
                    olarak anında yapılır. Ödeme işlemi güvenli ödeme altyapısı üzerinden
                    tamamlanır.
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

              {paymentStatusMessage ? (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-800">
                  {paymentStatusMessage}
                </div>
              ) : null}

              {paymentError ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-danger">
                  {paymentError}
                </div>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  className={`${primaryButtonClassName} w-full sm:w-auto`}
                  disabled={!approvalInfo || !approvalKvkk || isPaymentLoading}
                  onClick={handlePaymentStart}
                >
                  {isPaymentLoading ? "Ödeme sayfası açılıyor..." : "Ödeme Yap"}
                </button>
                <PdfDownloadButton
                  fileName="trafik-cezasi-itiraz-dilekcesi.pdf"
                  accessToken={paymentAccessToken}
                  petitionToken={result.petitionToken}
                  petitionText={result.petition}
                  autoStart={paymentReady}
                  onError={setPaymentError}
                  disabled={!paymentReady || !paymentAccessToken || !result.petitionToken}
                />
              </div>
            </div>
          ) : null}

          <div className="rounded-[20px] border border-gold/45 bg-gold-soft/45 px-5 py-4 text-sm leading-7 text-muted">
            <strong className="text-navy">Yasal Uyarı:</strong> Bu site bir avukatlık hizmeti
            vermemektedir. Sadece kullanıcının beyan ettiği bilgilerle teknik olarak dilekçe
            oluşturma asistanlığı yapmaktadır. Alınan dilekçenin hukuki sonuçlarından kullanıcı
            sorumludur. Hak kaybına uğramamak için bir avukata danışmanız tavsiye edilir.
          </div>
        </div>
      </div>
    </section>
  );
}
