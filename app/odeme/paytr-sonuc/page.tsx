import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    status?: string;
    oid?: string;
    message?: string;
  }>;
};

function buildTargetUrl(status?: string, oid?: string, message?: string) {
  const target = new URL("/", "https://www.itirazdilekcesi.com");

  if (status === "success" && oid) {
    target.searchParams.set("payment", "success");
    target.searchParams.set("oid", oid);
    return `${target.pathname}${target.search}`;
  }

  target.searchParams.set("payment", "failed");
  if (message) {
    target.searchParams.set("message", message);
  }

  return `${target.pathname}${target.search}`;
}

export default async function PaytrResultPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirectUrl = buildTargetUrl(params.status, params.oid, params.message);
  const escapedUrl = JSON.stringify(redirectUrl);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcfaf5] px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var target = ${escapedUrl};
              setTimeout(function () {
                if (window.top && window.top !== window.self) {
                  window.top.location.replace(target);
                  return;
                }
                window.location.replace(target);
              }, 200);
            })();
          `,
        }}
      />
      <div className="w-full max-w-xl rounded-[28px] border border-line bg-surface p-8 text-center shadow-[0_18px_40px_rgba(17,34,51,0.08)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
          Güvenli ödeme
        </p>
        <h1 className="mt-4 font-display text-4xl text-navy-deep">
          Sonuç sayfasına yönlendiriliyorsunuz
        </h1>
        <p className="mt-4 text-[15px] leading-8 text-muted">
          Ödeme sonucu ana sayfaya aktarılıyor. Yönlendirme gerçekleşmezse aşağıdaki
          bağlantıyı kullanabilirsiniz.
        </p>
        <Link
          href={redirectUrl}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-navy px-5 text-sm font-bold text-white transition duration-200 hover:bg-navy-deep"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
