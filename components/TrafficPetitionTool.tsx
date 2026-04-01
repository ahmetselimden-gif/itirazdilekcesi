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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    setShowPayment(false);
    setPaymentReady(false);

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
    <section id="dilekce-araci" className="tool-shell">
      <div className="tool-heading">
        <h2>Dilekçe oluşturma aracı</h2>
        <p>
          Zorunlu alanları doldurun, dilekçeyi inceleyin ve ardından PDF indirme
          adımına geçin.
        </p>
      </div>

      <div className="tool-layout">
        <div className="form-panel">
          <form className="legal-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor={fullNameId}>Ad Soyad</label>
                <input
                  id={fullNameId}
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor={tcknId}>TCKN</label>
                <input
                  id={tcknId}
                  value={form.tckn}
                  onChange={(event) => updateField("tckn", event.target.value)}
                  placeholder="Opsiyonel"
                />
              </div>

              <div className="field">
                <label htmlFor={plateId}>Plaka</label>
                <input
                  id={plateId}
                  value={form.plate}
                  onChange={(event) => updateField("plate", event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor={penaltyDateId}>Ceza Tarihi</label>
                <input
                  id={penaltyDateId}
                  type="date"
                  value={form.penaltyDate}
                  onChange={(event) => updateField("penaltyDate", event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor={notificationDateId}>Tebliğ Tarihi</label>
                <input
                  id={notificationDateId}
                  type="date"
                  value={form.notificationDate}
                  onChange={(event) =>
                    updateField("notificationDate", event.target.value)
                  }
                  required
                />
                <small className="field-note">
                  Eğer ceza kağıdı eve gelmediyse bu kısmı boş bırakmak yerine
                  bugünün tarihini girerek devam edebilirsiniz. İtiraz süresi
                  çoğu durumda tebliğ tarihiyle ilişkilidir.
                </small>
              </div>

              <div className="field">
                <label htmlFor={penaltyTypeId}>Ceza Türü</label>
                <select
                  id={penaltyTypeId}
                  value={form.penaltyType}
                  onChange={(event) => updateField("penaltyType", event.target.value)}
                >
                  <option>Kırmızı ışık</option>
                  <option>Hız ihlali</option>
                  <option>Park cezası</option>
                  <option>Diğer</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor={locationId}>Ceza Yeri</label>
                <input
                  id={locationId}
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="İstanbul / Kadıköy"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor={cameraStatusId}>Kamera / radar durumu</label>
                <select
                  id={cameraStatusId}
                  value={form.cameraStatus}
                  onChange={(event) => updateField("cameraStatus", event.target.value)}
                >
                  <option>Var</option>
                  <option>Yok</option>
                  <option>Bilmiyorum</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor={institutionId}>Kurum adı</label>
              <input
                id={institutionId}
                value={form.institution}
                onChange={(event) => updateField("institution", event.target.value)}
                placeholder="Boş bırakırsanız ceza yerine göre mahkeme otomatik oluşturulur"
              />
            </div>

            <div className="field">
              <label htmlFor={explanationId}>Açıklama</label>
              <textarea
                id={explanationId}
                value={form.explanation}
                onChange={(event) => updateField("explanation", event.target.value)}
                placeholder="Ceza neden haksız, usul veya delil eksikliği varsa yazın"
                required
              />
            </div>

            <div className="tool-actions">
              <button type="submit" className="primary-button" disabled={isLoading}>
                {isLoading ? "Dilekçe hazırlanıyor..." : "Dilekçeyi Gör"}
              </button>
            </div>

            {error ? <div className="message error">{error}</div> : null}
          </form>
        </div>

        <div>
          <div className="result-panel">
            {!result ? (
              <div className="empty-state">
                Dilekçeniz burada düzenli bir resmi evrak görünümünde
                gösterilecektir.
              </div>
            ) : (
              <>
                <div className="evaluation-box">
                  <h4>Değerlendirme</h4>
                  <div className="evaluation-row">
                    <span>İtiraz gücü</span>
                    <strong>{result.evaluationLevel}</strong>
                  </div>
                  <p>{result.evaluationComment}</p>
                </div>

                <h3>Dilekçe</h3>
                <div className="petition-view">
                  <PetitionDocument petition={result.petition} />
                </div>

                <div className="tool-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setShowPayment(true)}
                  >
                    PDF indir (19,99 TL)
                  </button>
                </div>
              </>
            )}
          </div>

          {result && showPayment ? (
            <div className="payment-panel" style={{ marginTop: 16 }}>
              <h3>Ödeme kontrolü</h3>
              <p>
                PDF indirme işlemi ödeme ve yasal onay kontrolüne bağlıdır. Bu
                alan, iyzico entegrasyonuna hazır placeholder olarak
                düzenlenmiştir.
              </p>

              <div className="legal-payment-box">
                <h4>Ön bilgilendirme</h4>
                <p>
                  Hizmet, kullanıcı tarafından girilen bilgilere göre dijital
                  dilekçe PDF&apos;i oluşturulmasıdır. Toplam bedel 19,99 TL&apos;dir.
                  Teslimat, ödeme sonrası dijital olarak anında yapılır.
                </p>

                <h4>Ödeme ve teslimat notu</h4>
                <p>
                  iyzico Checkout Form entegrasyonunda ödeme sonucu
                  `callbackUrl` üzerinden doğrulanacak ve ödeme sonucu ayrıca
                  token ile sorgulanacaktır.
                </p>

                <h4>KVKK aydınlatması</h4>
                <p>
                  Ad, TCKN, plaka ve başvuru içeriği; dilekçe oluşturma, ödeme
                  doğrulama ve kullanıcı destek süreçleri amacıyla işlenir.
                  Üretim ortamında veri sorumlusu bilgileri, işleme amaçları,
                  aktarım grupları ve başvuru hakları ayrı aydınlatma metninde
                  açıkça gösterilmelidir.
                </p>

                <h4>Mesafeli sözleşme notu</h4>
                <p>
                  Ödeme yükümlülüğü doğuran işlem öncesinde kullanıcıya ön
                  bilgilendirme ve sözleşme onayı gösterilmelidir. Dijital
                  teslimatın ödeme sonrası anında başlayacağı durumlarda cayma
                  hakkına ilişkin sonuçlar sözleşmede ayrıca ve açık biçimde
                  belirtilmelidir.
                </p>

                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={approvalInfo}
                    onChange={(event) => setApprovalInfo(event.target.checked)}
                  />
                  <span>Mesafeli Satış Sözleşmesini okudum, onaylıyorum.</span>
                </label>

                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={approvalKvkk}
                    onChange={(event) => setApprovalKvkk(event.target.checked)}
                  />
                  <span>KVKK Aydınlatma Metni&apos;ni okudum.</span>
                </label>
              </div>

              <div className="payment-actions" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="primary-button"
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

          <div className="legal-warning">
            <strong>Yasal Uyarı:</strong> Bu site bir avukatlık hizmeti
            vermemektedir. Sadece kullanıcının beyan ettiği bilgilerle teknik
            olarak dilekçe oluşturma asistanlığı yapmaktadır. Alınan dilekçenin
            hukuki sonuçlarından kullanıcı sorumludur. Hak kaybına uğramamak
            için bir avukata danışmanız tavsiye edilir.
          </div>
        </div>
      </div>

      <div className="pdf-stage" aria-hidden="true">
        <div id="petition-pdf-document" className="pdf-document">
          <div className="pdf-paper">
            {result ? <PetitionDocument petition={result.petition} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
