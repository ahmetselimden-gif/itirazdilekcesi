# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Hukuk Dilekçe SaaS MVP** — A legal petition generation platform built with Next.js 15. Users fill out forms (kiracı/tenant, ev sahibi/landlord, trafik/traffic) to generate official Turkish legal petitions, preview them, and download as PDF after payment (PayTR or Iyzico).

**Live site:** https://www.itirazdilekcesi.com

## Architecture

### Core Data Flow
1. **User fills form** → Client-side React component (HousingPetitionTool, TrafficPetitionTool)
2. **Submit form** → POST to `/api/kiraci`, `/api/ev-sahibi`, or `/api/generate` (traffic)
3. **Generate petition** → OpenAI API (gpt-4.1-mini) or fallback template
4. **Return petition text + evaluation** → User sees preview with strength assessment
5. **User clicks "PDF İndir"** → PayTR/Iyzico payment flow
6. **Payment verified** → PDF generated and downloaded via `/api/payments/download`

### Key Directories

- **`app/`** — Next.js App Router (v15)
  - `app/api/` — Backend routes for petitions, PDF generation, payment callbacks
  - `app/[slug]/page.tsx` — Dynamic content pages (info articles)
  - `app/kiraci/`, `app/ev-sahibi/` — Housing petition pages
  - `app/trafik-cezasi-itiraz/` — Traffic petition page
  - `app/odeme/` — Payment success/callback pages

- **`components/`** — Reusable React components
  - `HousingPetitionTool.tsx` — Form for tenant/landlord petitions (uses FormField component)
  - `TrafficPetitionTool.tsx` — Form for traffic objections (custom field layout)
  - `FormField.tsx` — Reusable form input wrapper (text, textarea, select, date)
  - `PdfDownloadButton.tsx` — Payment-gated PDF download
  - `TurnstileWidget.tsx` — Cloudflare bot protection

- **`lib/`** — Business logic
  - `trafficPetition.ts` — Traffic petition generation (OpenAI + fallback)
  - `paytr.ts` — PayTR payment integration
  - `iyzico.ts` — Iyzico payment integration
  - `courts-info.ts` — Hardcoded court/institution info by problem type
  - `paymentState.ts`, `petitionToken.ts` — Payment state management
  - `turnstile.ts` — Bot verification helper

- **`types/`** — TypeScript type definitions (if any custom types exist)

- **`public/`** — Static assets
  - `branding/` — Logo and brand assets
  - `fonts/` — Custom fonts

### Styling & Theme

- **Framework:** Tailwind CSS v4.2
- **Colors:** Custom theme with `navy`, `gold`, `danger`, `muted`, `ink` (defined in tailwind config)
- **Components use:** Custom Tailwind classes for buttons, cards, sections
  - Primary button: `"inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-navy px-6 text-sm font-bold text-white transition duration-200 hover:bg-navy-deep hover:shadow-lg hover:-translate-y-0.5 ..."`
  - Form fields: Consistent border, focus ring, placeholder styling

### Type System

- **Housing petitions:** `HousingFormData` (fullName, address, counterpartyName, rentedAddress, problemType, explanation, institution, tcNumber, olay_date)
- **Traffic petitions:** `TrafficFormData` (fullName, tckn, plate, penaltyDate, notificationDate, penaltyType, location, cameraStatus, institution, explanation)
- **Payment result:** `PaymentState` (contains accessToken, expiresAt for download verification)
- **Petition generation:** `TrafficGenerationResult` (petition text, evaluationLevel, evaluationComment, source, petitionToken)

## Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Run production build
npm run lint         # ESLint check

# Testing
# Note: No test runner configured; use manual testing locally
```

## Key Development Patterns

### 1. Form Handling (HousingPetitionTool Pattern)
- Use `useState` for form data and errors
- Separate validation before API call
- Extract only required fields before sending to API (safety measure)
- Clear optional fields from client-side but don't send to backend

```typescript
// Only send required fields to API
const apiData = {
  fullName: form.fullName,
  address: form.address,
  // ... required fields only
};
```

### 2. Petition Generation Flow
- Frontend submits form → API generates petition via OpenAI
- If OpenAI fails, fallback template is used
- Always return `petition` text + `evaluationLevel` ("Düşük"|"Orta"|"Yüksek")
- For traffic: also return `evaluationComment` explaining petition strength

### 3. Payment Integration
- After user clicks "PDF İndir", create payment session (PayTR or Iyzico)
- Store petition in session storage during payment flow
- Payment callback returns `accessToken` + `oid` (order ID)
- Verify payment before generating PDF: `/api/payments/access?token=...`
- PDF generation is gated by valid access token

### 4. Optional vs Required Fields
- Backend has strict validation for required fields
- Optional fields (TCKN, olay_date, tcNumber) are allowed empty but still in form
- Only validated fields are sent to API

### 5. Dynamic Content
- Use `getDistrictFromLocation()` (in trafficPetition.ts) to auto-resolve institution from location string
- Courts info: `courts-info.ts` has hardcoded mappings by problem type → court details
- Falls back to generic court name if problem type not found

## Design Focus ⚠️

**User preference: Focus ONLY on UI/UX improvements, never modify backend/payment/PDF systems.**

**What you CAN change:**
- Component styling and layout
- Form field appearance, labels, hints, examples
- Button styling and interactions
- Section organization and spacing
- Responsive design improvements
- Accessibility enhancements

**What you CANNOT change:**
- API route logic or request/response structure
- PDF generation (pdfkit setup)
- Payment system integration (PayTR, Iyzico)
- OpenAI integration
- Database/data persistence logic

## Important Implementation Details

### 1. Form Fields vs API Payload
Forms may have more fields than the API accepts. Always extract only required fields:

```typescript
// FormData might have: tcNumber, olay_date, fullName, address, ...
// But API only expects: fullName, address, counterpartyName, rentedAddress, problemType, explanation, institution
```

### 2. Session Storage for Payments
TrafficPetitionTool uses session storage to persist form data during payment flow:
```typescript
const SNAPSHOT_KEY = "petition_checkout_snapshot_v2";
// Stores: { form, result, showPayment }
```

### 3. Bot Protection
Turnstile widget (Cloudflare) is required on traffic petition form. Check `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` before rendering.

### 4. Fallback Content
If OpenAI API fails or no OPENAI_API_KEY set, system generates fallback template-based petitions. This is intentional for robustness.

### 5. Turkish Locale Formatting
- Date formatting: `toLocaleDateString('tr-TR')`
- Uppercase conversion: `toLocaleUpperCase("tr-TR")` (for Turkish characters like ç, ğ, ş)

## Environment Variables

```bash
# Required for petition generation via AI
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini

# Payment integration (optional, fallback to test mode)
PAYTR_MERCHANT_ID=...
PAYTR_MERCHANT_KEY=...
IYZICO_API_KEY=...

# Bot protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...

# Cloudflare (for Turnstile)
TURNSTILE_SECRET_KEY=...
```

## Deployment

- **Hosting:** Vercel (vercel.json configured with buildCommand and outputDirectory)
- **Domain redirect:** www.itirazdilekcesi.com → main domain
- **Build output:** `.next/` (Next.js static/server files)
- **Note:** Some routes use edge runtime which disables static generation (dynamic routes)

To deploy after changes:
```bash
vercel login  # If token expired
npx vercel --prod
```

## Testing & Verification

1. **Local dev:** `npm run dev` → visit http://localhost:3000
2. **Test forms:** Fill out housing/traffic petitions, verify preview shows correct structure
3. **Payment flow:** Use PayTR/Iyzico test credentials (check env files)
4. **Build check:** `npm run build` should complete without errors
5. **Type check:** `npm run lint` for ESLint issues

## Git Workflow

- Commit message format: Clear, descriptive (e.g., "Design enhancements for traffic petition form")
- Push to main branch (already set as default)
- Vercel auto-deploys on push (if auth token valid)
- All commits go to: https://github.com/ahmetselimden-gif/itirazdilekcesi

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Vercel token expired | Run `vercel login` on your machine, then `npx vercel --prod` |
| OpenAI API errors | Check OPENAI_API_KEY env var, system falls back to template |
| Tailwind styles not applying | Run `npm install`, rebuild, ensure PostCSS is processing |
| PDF generation fails | Check pdfkit is installed, verify API call payload structure |
| Form validation errors | Check required fields in API route match form submission |

## Further Context

- This is a **Turkish-language application** — all text, dates, and messaging in Turkish
- Focus on **legal petition formatting** — documents follow official Turkish legal document structure
- **Payment is critical** — PDF is premium feature (19.99 TL), text preview is free
- **Accessibility matters** — use proper ARIA labels, semantic HTML, test keyboard navigation
