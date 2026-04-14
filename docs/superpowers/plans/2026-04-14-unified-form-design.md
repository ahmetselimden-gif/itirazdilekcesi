# Unified Form Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply consistent professional design (instructions box, section headers, field examples, improved spacing) across Kiracı, Ev Sahibi, and Trafik petition forms while keeping all backend/payment/PDF systems untouched.

**Architecture:** Update `HousingPetitionTool` to match the enhanced design pattern (instructions box, section headers with icons, field examples). Both Kiracı and Ev Sahibi forms use this component, so one update covers two forms. Trafik form already has the design; verify it's correct. Add TC Kimlik No validation (11 digits only) across all forms.

**Tech Stack:** React hooks (useState), TypeScript, Tailwind CSS, Next.js form handling

---

## File Structure

**Files to modify:**
- `components/HousingPetitionTool.tsx` — Add instructions box, section headers, field examples, TC Kimlik validation, improved spacing
- `components/TrafficPetitionTool.tsx` — Verify TC Kimlik validation (digit-only filtering)

**Files to verify (no changes needed):**
- `app/kiraci/page.tsx` — Uses HousingPetitionTool, inherits updates
- `app/ev-sahibi/page.tsx` — Uses HousingPetitionTool, inherits updates
- `app/trafik-cezasi-itiraz/page.tsx` — Uses TrafficPetitionTool, already has design

---

## Tasks

### Task 1: Update HousingPetitionTool — Add Instructions Box and Section Headers

**Files:**
- Modify: `components/HousingPetitionTool.tsx:306-330` (form section)

- [ ] **Step 1: Add instructions box before form**

After the opening `<form>` tag, insert:

```typescript
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
```

- [ ] **Step 2: Wrap existing field groups in section headers**

Change the existing `<div className="grid gap-4 md:grid-cols-2">` to three sections:

**Section 1: Kişisel Bilgiler** (fullName, address)
```typescript
{/* KİŞİSEL BİLGİLER */}
<div>
  <h3 className="mb-4 text-sm font-bold text-navy-deep">👤 Kişisel Bilgiler</h3>
  <div className="grid gap-4 md:grid-cols-2">
    {/* fullName and address fields */}
  </div>
</div>
```

**Section 2: Uyuşmazlık Detayları** (counterpartyName, rentedAddress, problemType)
```typescript
{/* UYUŞMAZLIK DETAYLARı */}
<div>
  <h3 className="mb-4 text-sm font-bold text-navy-deep">⚖️ Uyuşmazlık Detayları</h3>
  <div className="grid gap-4 md:grid-cols-2">
    {/* counterpartyName, rentedAddress, problemType fields */}
  </div>
</div>
```

**Section 3: İtiraz Detayları** (institution, explanation)
```typescript
{/* İTİRAZ DETAYLARı */}
<div>
  <h3 className="mb-4 text-sm font-bold text-navy-deep">📝 İtiraz Detayları</h3>
  <div className="grid gap-4">
    {/* institution and explanation fields */}
  </div>
</div>
```

- [ ] **Step 3: Update form spacing from space-y-5 to space-y-6**

Find:
```typescript
<form className="space-y-5" onSubmit={handleSubmit}>
```

Change to:
```typescript
<form className="space-y-6" onSubmit={handleSubmit}>
```

- [ ] **Step 4: Build and verify no syntax errors**

```bash
npm run build
```

Expected: Build completes successfully without errors

- [ ] **Step 5: Commit section structure**

```bash
git add components/HousingPetitionTool.tsx
git commit -m "feat: add instructions box and section headers to HousingPetitionTool"
```

---

### Task 2: Update HousingPetitionTool — Enhance Field Labels and Add Examples

**Files:**
- Modify: `components/HousingPetitionTool.tsx` (each field)

- [ ] **Step 1: Update fullName field with placeholder and example**

Replace the fullName field:

```typescript
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
```

- [ ] **Step 2: Update address field with placeholder and example**

Replace the address field:

```typescript
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
```

- [ ] **Step 3: Update counterpartyName field with placeholder and example**

Replace the counterpartyName field:

```typescript
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
```

- [ ] **Step 4: Update rentedAddress field with placeholder and example**

Replace the rentedAddress field:

```typescript
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
```

- [ ] **Step 5: Update problemType field with placeholder and example**

Replace the problemType select:

```typescript
<div className="space-y-2">
  <label htmlFor={problemTypeId} className="text-sm font-bold text-navy">
    Problem Türü <span className="text-danger">*</span>
  </label>
  <select
    id={problemTypeId}
    className={fieldClassName}
    value={form.problemType}
    onChange={(event) => updateField("problemType", event.target.value)}
    required
  >
    <option value="">Seçiniz</option>
    {problemOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
  <p className="text-xs text-muted/70">
    Sorunun hangi kategoriye ait olduğunu seçin
  </p>
</div>
```

- [ ] **Step 6: Update institution field with placeholder and helper**

Replace the institution field:

```typescript
<div className="space-y-2">
  <label htmlFor={institutionId} className="text-sm font-bold text-navy">
    Mahkeme / Kurum Adı
  </label>
  <input
    id={institutionId}
    className={fieldClassName}
    value={form.institution}
    onChange={(event) => updateField("institution", event.target.value)}
    placeholder="Sulh Hukuk Mahkemesi"
  />
  <p className="text-xs text-muted/70">
    Opsiyonel. Boş bırakırsanız otomatik oluşturulur.
  </p>
</div>
```

- [ ] **Step 7: Update explanation field with placeholder and helper**

Replace the explanation field:

```typescript
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
  <p className="text-xs text-muted/70">
    <span className="font-semibold">Örnek:</span> Ev sahibi aylık kira bedelini haksız yere %50 artırdı, sözleşme şartlarına aykırı...
  </p>
</div>
```

- [ ] **Step 8: Build and verify**

```bash
npm run build
```

Expected: Build succeeds

- [ ] **Step 9: Commit field enhancements**

```bash
git add components/HousingPetitionTool.tsx
git commit -m "feat: add field labels, placeholders, examples, and helpers to HousingPetitionTool"
```

---

### Task 3: Update HousingPetitionTool — Improve Button Styling

**Files:**
- Modify: `components/HousingPetitionTool.tsx` (button className at top)

- [ ] **Step 1: Update primary button className**

Find line 62:
```typescript
const primaryButtonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-navy px-5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-55";
```

Replace with:
```typescript
const primaryButtonClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-navy bg-navy px-6 text-sm font-bold text-white transition duration-200 hover:bg-navy-deep hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none";
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: Build completes successfully

- [ ] **Step 3: Commit button styling**

```bash
git add components/HousingPetitionTool.tsx
git commit -m "feat: improve button styling with shadow and lift hover effects"
```

---

### Task 4: Verify TrafficPetitionTool — TC Kimlik Validation

**Files:**
- Verify: `components/TrafficPetitionTool.tsx`

- [ ] **Step 1: Check TC Kimlik field filtering logic**

Open `components/TrafficPetitionTool.tsx` and find the tcknId field around line 400-420.

Verify it has:
```typescript
onChange={(event) =>
  updateField("tckn", event.target.value.replace(/\D/g, ""))
}
```

Expected: Field already has digit-only filtering

- [ ] **Step 2: Verify maxLength and inputMode**

Confirm the field has:
```typescript
inputMode="numeric"
maxLength={11}
```

Expected: Already present

- [ ] **Step 3: Verify helper text**

Confirm helper text shows:
```typescript
<p className="text-xs text-muted/70">
  <span className="font-semibold">Örnek:</span> 12345678901 (11 haneli)
</p>
```

Expected: Already present

- [ ] **Step 4: Verification complete**

TrafficPetitionTool is already up-to-date. No changes needed.

---

### Task 5: Test All Three Forms Locally

**Files:**
- Test: All three forms in browser

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000

- [ ] **Step 2: Test Kiracı Form**

Navigate to: http://localhost:3000/kiraci

Verify:
- ✓ Instructions box (📋 TALIMATLAR) visible at top
- ✓ Section headers (👤, ⚖️, 📝) visible
- ✓ All fields have examples below them
- ✓ Required fields marked with red *
- ✓ Buttons have smooth hover effect with shadow and lift

- [ ] **Step 3: Test Ev Sahibi Form**

Navigate to: http://localhost:3000/ev-sahibi

Verify (same as Kiracı):
- ✓ Instructions box visible
- ✓ Section headers visible
- ✓ Fields have examples
- ✓ Button hover effects work

- [ ] **Step 4: Test Trafik Form**

Navigate to: http://localhost:3000/trafik-cezasi-itiraz

Verify:
- ✓ Instructions box (📋 TALIMATLAR) visible
- ✓ Section headers (👤, ⚖️, 📝) visible
- ✓ Fields have examples/hints
- ✓ TC Kimlik field only accepts 11 digits
- ✓ Button hover effects work
- ✓ Payment session storage still works (fill form, click "PDF İndir", verify form state persists)

- [ ] **Step 5: Test form submission**

On any form:
- Fill out all required fields
- Click submit button
- Verify petition preview appears (no backend changes)

Expected: Form submission and preview work identically to before

- [ ] **Step 6: Verify payment flow still works**

On Trafik form after generating petition:
- Click "PDF indir (19,99 TL)"
- Verify payment panel appears
- Verify form data is still accessible (no loss during payment flow)

Expected: Payment flow unchanged

- [ ] **Step 7: Build for production**

```bash
npm run build
```

Expected: Build succeeds, no errors

---

### Task 6: Final Verification and Commit

**Files:**
- All modified components

- [ ] **Step 1: Run ESLint check**

```bash
npm run lint
```

Expected: No new errors or warnings

- [ ] **Step 2: Verify git status**

```bash
git status
```

Expected: All changes committed, no uncommitted files

- [ ] **Step 3: View final commit log**

```bash
git log --oneline -5
```

Expected: Shows recent commits for form enhancements

- [ ] **Step 4: All three forms now have:**

✅ Unified professional design (instructions, section headers, field examples)  
✅ Improved button styling (shadow + lift on hover)  
✅ Consistent spacing (space-y-6 between sections)  
✅ Backend/payment/PDF systems untouched  
✅ All forms tested locally

---

## Summary

**Total tasks:** 6  
**Files modified:** `components/HousingPetitionTool.tsx`, `components/TrafficPetitionTool.tsx` (verification only)  
**Forms updated:** Kiracı, Ev Sahibi (via HousingPetitionTool), Trafik (verified)  
**Backend impact:** Zero — all payment/PDF/submission logic preserved
