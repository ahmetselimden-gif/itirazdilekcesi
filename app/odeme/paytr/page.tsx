type PageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function PaytrCheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token || "";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[28px] border border-line/80 bg-surface shadow-[0_24px_60px_rgba(17,34,51,0.08)]">
        <div className="border-b border-line/70 px-5 py-6 sm:px-8">
          <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
            <span className="h-px w-8 bg-navy/30" />
            PayTR Ödeme
          </span>
          <h1 className="mt-3 font-display text-4xl text-navy-deep">
            Güvenli ödeme ekranı
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-8 text-muted">
            Ödemenizi PayTR güvenli altyapısı üzerinden tamamlayın. İşlem sonrası
            PDF indirme hakkınız otomatik olarak aktif olacaktır.
          </p>
        </div>

        <div className="px-5 py-6 sm:px-8">
          {token ? (
            <div className="overflow-hidden rounded-[24px] border border-line bg-white">
              <iframe
                title="PayTR ödeme ekranı"
                src={`https://www.paytr.com/odeme/guvenli/${encodeURIComponent(token)}`}
                className="h-[860px] w-full"
              />
            </div>
          ) : (
            <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-danger">
              Ödeme oturumu bulunamadı. Lütfen ana sayfaya dönerek işlemi yeniden başlatın.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
