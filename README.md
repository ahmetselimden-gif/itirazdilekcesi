# Hukuk Dilekce SaaS MVP

Next.js tabanli MVP uygulama. Kullanici secili kategori icin dilekce uretir, sonucu gorur, odeme placeholder ekranindan sonra PDF indirir.

## Baslatma

```bash
npm install
npm run dev
```

## Ortam Degiskenleri

`.env.local` dosyasi olusturun:

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

API anahtari yoksa sistem demo/fallback dilekce metni uretmeye devam eder.
