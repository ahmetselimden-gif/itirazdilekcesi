import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #fffdf8 0%, #f7f2e8 45%, #eef3fb 100%)",
          color: "#132544",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#1f3b68",
          }}
        >
          <div style={{ width: 64, height: 2, background: "#b99848" }} />
          T.C.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.04,
              fontWeight: 700,
              maxWidth: 860,
            }}
          >
            Trafik Cezası İtiraz Dilekçesi Hazırla
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.45,
              maxWidth: 880,
              color: "#4b5d79",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Trafik cezanıza karşı profesyonel itiraz dilekçenizi oluşturun,
            değerlendirin ve resmi PDF olarak indirin.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 18,
              color: "#1f3b68",
              fontSize: 24,
            }}
          >
            <div>Hızlı başvuru</div>
            <div>Resmi görünüm</div>
            <div>PDF çıktı</div>
          </div>
          <div
            style={{
              padding: "14px 22px",
              borderRadius: 999,
              border: "1px solid #d9deeb",
              background: "#132544",
              color: "white",
              fontSize: 24,
            }}
          >
            itirazdilekcesi.com
          </div>
        </div>
      </div>
    ),
    size
  );
}

export const runtime = "edge";
