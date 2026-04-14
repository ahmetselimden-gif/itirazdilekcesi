import OpenAI from "openai";

const aciklamaPrompt = `
Kullanıcının yazdığı açıklamayı al ve bunu resmi, hukuki ve profesyonel bir dilekçe diline dönüştür.

Kurallar:

- Kullanıcının verdiği bilgiyi KORU, ama daha düzgün yaz
- Boş, anlamsız veya kısa ifadeleri GENİŞLET
- Somut olay haline getir
- Mümkünse olayın detayını netleştir
- Resmi ve ciddi dil kullan
- “uyuşmazlık vardır” gibi genel cümlelerden kaçın

Ama:
- Asla tamamen uydurma bilgi ekleme
- Kullanıcının anlamını değiştirme
- Asla kullanıcı tarafından verilmeyen tarih, rakam veya olay ekleme

Çıktı:
Güçlü, resmi ve tek paragraf bir açıklama metni üret.
`.trim();

export async function formatAciklama(userText: string) {
  const trimmedText = userText.trim();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!trimmedText || !apiKey) {
    return userText;
  }

  try {
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const response = await client.responses.create({
      model,
      input: `${aciklamaPrompt}\n\nKullanıcı açıklaması:\n${trimmedText}`,
    });

    return response.output_text?.trim() || userText;
  } catch (error) {
    console.error("Açıklama formatlama başarısız, orijinal metin kullanılacak:", error);
    return userText;
  }
}
