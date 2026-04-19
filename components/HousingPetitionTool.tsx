"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import EditablePetitionPreview from "@/components/EditablePetitionPreview";
import PaymentButton from "@/components/PaymentButton";
import PdfDownloadHandler from "@/components/PdfDownloadHandler";
import TurnstileWidget from "@/components/TurnstileWidget";
import { trackPurchase } from "@/lib/analytics";
import {
  PAYMENT_ACCESS_TOKEN_KEY,
  PAYMENT_VERIFY_ENDPOINT,
  getCheckoutSnapshotKey,
} from "@/lib/payment";

type HousingFormData = {
  fullName: string;
  address: string;
  counterpartyName: string;
  rentedAddress: string;
  problemType: string;
  explanation: string;
  institution: string;
};

type HousingGenerationResult = {
  petition: string;
  evaluationLevel: "Düşük" | "Orta" | "Yüksek";
  evaluationComment: string;
  source: "openai" | "fallback";
  petitionToken?: string;
};

type HousingPetitionToolProps = {
  apiPath: "/api/kiraci" | "/api/ev-sahibi";
  eyebrow: string;
  title: string;
  description: string;
  counterpartyLabel: string;
  problemOptions: string[];
};

type SnapshotPayload = {
  form: HousingFormData;
  result: HousingGenerationResult;
  showPayment: boolean;
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

const fieldClassName =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink outline-none transition duration-200 placeholder:text-muted/65 focus:border-navy focus:ring-4 focus:ring-navy/10";

const textareaClassName =
  "min-h-40 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] leading-7 text-ink outline-none transition duration-200 placeholder:text-muted/65 focus:border-navy focus:ring-4 focus:ring-navy/10";

const primaryButtonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-navy px-6 text-sm font-bold text-white transition duration-200 hover:bg-navy-deep hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function HousingPetitionTool({
  apiPath,
  eyebrow,
  title,
  description,
  counterpartyLabel,
  problemOptions,
}: HousingPetitionToolProps) {
  const panelKey = apiPath === "/api/kiraci" ? "kiraci" : "ev-sahibi";
  const returnPath = apiPath === "/api/kiraci" ? "/kiraci" : "/ev-sahibi";
  const fileName =
    apiPath === "/api/kiraci"
      ? "kiraci-itiraz-dilekcesi.pdf"
      : "ev-sahibi-itiraz-dilekcesi.pdf";
  const snapshotKey = getCheckoutSnapshotKey(panelKey);

  const fullNameId = useId();
  const addressId = useId();
  const counterpartyNameId = useId();
  const rentedAddressId = useId();
  const problemTypeId = useId();
  const explanationId = useId();
  const institutionId = useId();

  const [form, setForm] = useState<HousingFormData>(() => defaultForm(problemOptions[0]));
  const [result, setResult] = useState<HousingGenerationResult | null>(null);
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

  const updateField = (key: keyof HousingFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updatePetitionText = (petition: string) => {
    setResult((current) => (current ? { ...current, petition } : current));
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawSnapshot = window.sessionStorage.getItem(snapshotKey);
    let restoredPetitionToken = "";

    if (rawSnapshot) {
      try {
        const snapshot = JSON.parse(rawSnapshot) as SnapshotPayload;
        setForm(snapshot.form);
        setResult(snapshot.result);
        setShowPayment(snapshot.showPayment);
        restoredPetitionToken = snapshot.result.petitionToken || "";
      } catch {
        window.sessionStorage.removeItem(snapshotKey);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const access =
      params.get("access") || window.sessionStorage.getItem(PAYMENT_ACCESS_TOKEN_KEY);
    const merchantOid = params.get("oid") || "";
    const message = params.get("message");

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
          orderId?: string;
          paidPrice?: string;
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
        setPaymentStatusMessage(
          "Ödeme doğrulandı. Dilekçenizi düzenleyip PDF dosyasını indirebilirsiniz."
        );
        window.sessionStorage.setItem(PAYMENT_ACCESS_TOKEN_KEY, data.accessToken);
        trackPurchase(data.orderId || oid, data.paidPrice);
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
          "Ödeme doğrulandı. Dilekçenizi düzenleyip PDF dosyasını indirebilirsiniz."
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
  }, [snapshotKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !result) {
      return;
    }

    const snapshot: SnapshotPayload = {
      form,
      result,
      showPayment,
    };

    window.sessionStorage.setItem(snapshotKey, JSON.stringify(snapshot));
  }, [form, result, showPayment, snapshotKey]);

  const validateForm = () => {
    if (
      !form.fullName.trim() ||
      !form.address.trim() ||
      !form.counterpartyName.trim() ||
      !form.rentedAddress.trim() ||
      !form.problemType.trim() ||
      !form.explanation.trim() ||
      !form.institution.trim()
    ) {
      return "Lütfen zorunlu alanların tamamını doldurun.";
    }

    return "";
  };

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
      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          turnstileToken,
        }),
      });
      const data = (await response.json()) as HousingGenerationResult | { error?: string };

      if (!response.ok || !("petition" in data)) {
        throw new Error(("error" in data && data.error) || "Dilekçe oluşturulamadı.");
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
        <div className="rounded-[24px] border border-line/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f9f6ef_100%)] p-5 sm:p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* TALIMATLAR */}
            <div className="mb-6 rounded-lg border border-gold/30 bg-gold-soft/30 p-4">
              <p className="text-sm font-bold text-navy">📋 TALIMATLAR</p>
              <ul className="mt-3 space-y-2 text-xs text-muted">
                <li>✓ Tüm zorunlu alanları doldurun</li>
                <li>✓ Adres ve isimleri tam yazın</li>
                <li>✓ Sorunu net bir şekilde açıklayın</li>
                <li>✓ Dilekçeyi okuyup kontrol edin</li>
                <li>✓ PDF&apos;i indirin veya mahkemeye gönderin</li>
                <li>⚠️ Dilekçe imzalanmalı ve belirtilen sürede sunulmalıdır</li>
              </ul>
            </div>

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
                  <span className="font-semibold">Örnek:</span> Mehmet Akşit Çelik
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor={addressId} className="text-sm font-bold text-navy">
                  Adres <span className="text-danger">*</span>
                </label>
                <input
                  id={addressId}
                  className={fieldClassName}
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  placeholder="İstanbul, Kadıköy, Moda Cad. No: 123"
                  required
                />
                <p className="text-xs text-muted/70">
                  <span className="font-semibold">Örnek:</span> Ankara, Çankaya, Atatürk Bulvarı
                </p>
              </div>
              </div>
            </div>

            {/* UYUŞMAZLIK DETAYLARı */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-navy-deep">⚖️ Uyuşmazlık Detayları</h3>
              <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor={counterpartyNameId} className="text-sm font-bold text-navy">
                  {counterpartyLabel} <span className="text-danger">*</span>
                </label>
                <input
                  id={counterpartyNameId}
                  className={fieldClassName}
                  value={form.counterpartyName}
                  onChange={(event) => updateField("counterpartyName", event.target.value)}
                  placeholder="Ahmet Demir"
                  required
                />
                <p className="text-xs text-muted/70">
                  <span className="font-semibold">Örnek:</span> Fatma Yüksek
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor={rentedAddressId} className="text-sm font-bold text-navy">
                  Kiralanan Ev Adresi <span className="text-danger">*</span>
                </label>
                <input
                  id={rentedAddressId}
                  className={fieldClassName}
                  value={form.rentedAddress}
                  onChange={(event) => updateField("rentedAddress", event.target.value)}
                  placeholder="İstanbul, Beşiktaş, Barbaros Bulvarı No: 456"
                  required
                />
                <p className="text-xs text-muted/70">
                  <span className="font-semibold">Örnek:</span> İzmir, Alsancak, Alsancak Cad.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor={problemTypeId} className="text-sm font-bold text-navy">
                  Problem Türü <span className="text-danger">*</span>
                </label>
                <select
                  id={problemTypeId}
                  className={fieldClassName}
                  value={form.problemType}
                  onChange={(event) => updateField("problemType", event.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {problemOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <p className="text-xs text-muted/70">
                  Sorunun hangi kategoriye ait olduğunu seçin
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor={institutionId} className="text-sm font-bold text-navy">
                  Mahkeme / Kurum Adı
                </label>
                <input
                  id={institutionId}
                  className={fieldClassName}
                  value={form.institution}
                  onChange={(event) => updateField("institution", event.target.value)}
                  placeholder="Kadıköy Sulh Hukuk Mahkemesi"
                  required
                />
                <p className="text-xs text-muted/70">
                  Dilekçeyi vereceğiniz makamı yazın. Emin değilseniz başvuru öncesi ilgili adliye veya uzman desteğiyle teyit edin.
                </p>
              </div>
              </div>
            </div>

            {/* İTİRAZ DETAYLARı */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-navy-deep">📝 İtiraz Detayları</h3>
              <div className="grid gap-4">
              <div className="space-y-2">
              <label htmlFor={explanationId} className="text-sm font-bold text-navy">
                Sorun Açıklaması <span className="text-danger">*</span>
              </label>
              <textarea
                id={explanationId}
                className={textareaClassName}
                value={form.explanation}
                onChange={(event) => updateField("explanation", event.target.value)}
                placeholder="Sorununuzu detaylı olarak açıklayın..."
                required
              />
              {panelKey === "kiraci" ? (
                <p className="text-xs text-muted/70">
                  <span className="font-semibold">Örnek:</span> Ev sahibi aylık kira bedelini haksız yere %50 artırdı, sözleşme şartlarına aykırı...
                </p>
              ) : null}
              </div>
              </div>
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

            <button
              type="submit"
              className={primaryButtonClassName}
              disabled={isLoading || Boolean(turnstileSiteKey && !turnstileToken)}
            >
              {isLoading ? "Dilekçe hazırlanıyor..." : "Dilekçeyi Oluştur"}
            </button>

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
              <div className="flex min-h-80 items-center justify-center rounded-[20px] border border-dashed border-line bg-surface-soft px-6 text-center text-[15px] leading-8 text-muted">
                Formu doldurduktan sonra dilekçe metni burada resmi evrak düzenine yakın bir
                önizleme olarak gösterilecektir.
              </div>
            ) : (
              <>
                <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                  <h4 className="text-base font-bold text-navy">Değerlendirme</h4>
                  <div className="mt-3 flex items-center justify-between gap-4 border-b border-line/80 pb-3 text-sm text-navy">
                    <span>Dilekçe gücü</span>
                    <strong className="text-base">{result.evaluationLevel}</strong>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {result.evaluationComment}
                  </p>
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
                  PayTR
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-8 text-muted">
                PDF indirme işlemi, ödeme doğrulandıktan sonra aktif olur.
              </p>

              <p className="mt-2 text-sm leading-7 text-muted">
                Ödeme sonrası dilekçenizi düzenleyebilir, son halini verdikten sonra PDF olarak
                indirebilirsiniz.
              </p>

              <div className="mt-5 space-y-4 rounded-[20px] border border-line bg-surface-soft p-5">
                <div>
                  <h4 className="text-sm font-bold text-navy">Ön Bilgilendirme</h4>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    Hizmet, kullanıcı tarafından girilen bilgilere göre dijital dilekçe PDF&apos;i
                    oluşturulmasıdır. Teslimat, ödeme sonrası dijital olarak anında yapılır.
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
                <PaymentButton
                  fullName={form.fullName}
                  petitionToken={result.petitionToken}
                  returnPath={returnPath}
                  disabled={!approvalInfo || !approvalKvkk}
                  isLoading={isPaymentLoading}
                  onLoadingChange={setIsPaymentLoading}
                  onError={setPaymentError}
                >
                  Ödeme Yap
                </PaymentButton>
                <PdfDownloadHandler
                  fileName={fileName}
                  accessToken={paymentAccessToken}
                  petitionToken={result.petitionToken}
                  petitionText={result.petition}
                  autoStart={false}
                  onError={setPaymentError}
                  disabled={!paymentReady || !paymentAccessToken || !result.petitionToken}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
