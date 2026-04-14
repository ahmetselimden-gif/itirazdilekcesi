# Unified Form Design Spec

**Date:** 2026-04-14  
**Scope:** Kiracı, Ev Sahibi, Trafik dilekçe formlarının tasarımını birleştir  
**Focus:** UI/UX only — backend/PDF/payment systems untouched

## Overview

Three petition forms (Kiracı, Ev Sahibi, Trafik) will share a unified professional design pattern based on the enhanced TrafficPetitionTool layout. All forms maintain their existing backend logic, payment integration, and PDF generation while receiving consistent visual treatment.

## Design System

### Form Structure (All Three Forms)

Each form follows this hierarchical layout:

1. **Instructions Box** (top)
   - Icon: 📋 TALIMATLAR
   - Background: gold-soft/30 with border
   - Contents: 5-6 bullet points with ✓ for tips, ⚠️ for warnings
   - Example: "✓ Tüm alanları doldurun", "⚠️ İtiraz süresi X gündür"

2. **Section Headers** (organized by category)
   - Format: Icon + Bold Title (e.g., "👤 Kişisel Bilgiler")
   - Spacing: mb-4 below header, gap-4 between fields
   - Color: text-navy-deep, font-bold

3. **Form Fields** (within sections)
   - Label: text-sm font-bold text-navy with `*` for required
   - Input: fieldClassName (border, focus ring, padding)
   - Placeholder: example value (e.g., "Ali Yılmaz")
   - Helper Text: below field, text-xs text-muted/70
   - Format: "Örnek: [sample value]" or "Opsiyonel. [description]"

4. **Spacing**
   - Between sections: space-y-6
   - Between fields: gap-4 (in grid)
   - Between label and input: space-y-2

### TC Kimlik No Field (Special Handling)

- **Input Properties:**
  - type="text" with inputMode="numeric"
  - maxLength={11}
  - Placeholder: "12345678901"

- **Real-time Filtering:**
  - Only accepts digits 0-9
  - Remove non-numeric characters on change: `.replace(/\D/g, "")`

- **Validation:**
  - Must be exactly 11 digits if provided
  - Error message: "TCKN alanı yalnızca 11 haneli rakamlardan oluşmalıdır."

- **Label & Helper:**
  - Label: "TC Kimlik No" (without *)
  - Helper: "Örnek: 12345678901 (11 haneli)"

### Button Styling

- **Primary Button Styles:**
  ```
  inline-flex min-h-12 items-center justify-center rounded-xl 
  border border-navy bg-navy px-6 text-sm font-bold text-white 
  transition duration-200 
  hover:bg-navy-deep hover:shadow-lg hover:-translate-y-0.5
  disabled:cursor-not-allowed disabled:opacity-55 
  disabled:hover:translate-y-0 disabled:hover:shadow-none
  ```

- **Effects:**
  - Hover: background darker + shadow + subtle lift (-translate-y-0.5)
  - Disabled: opacity reduced, no hover effects

## Form-Specific Patterns

### Kiracı Form (Tenant)
- **Sections:**
  - 👤 Kişisel Bilgiler (Ad Soyad, TC Kimlik No)
  - ⚖️ Uyuşmazlık Detayları (Adres, Muhasır Adı, Kira Adresi, Problem Türü)
  - 📝 İtiraz Detayları (Kurum/Mahkeme, Açıklama)

- **Instructions:** Focus on filing timeline, required documentation, court procedure

### Ev Sahibi Form (Landlord)
- **Sections:**
  - 👤 Kişisel Bilgiler (Ad Soyad, TC Kimlik No)
  - ⚖️ Uyuşmazlık Detayları (Adres, Kiracı Adı, Kira Adresi, Problem Türü)
  - 📝 İtiraz Detayları (Kurum/Mahkeme, Açıklama)

- **Instructions:** Focus on filing rights, evidence requirements, legal notice procedures

### Trafik Form (Traffic)
- **Sections:**
  - 👤 Kişisel Bilgiler (Ad Soyad, TC Kimlik No)
  - ⚖️ Ceza Detayları (Plaka, Ceza Türü, Ceza Tarihi, Tebliğ Tarihi, Ceza Yeri, Kamera/Radar Durumu)
  - 📝 İtiraz Detayları (Kurum Adı, İtiraz Nedeni)

- **Instructions:** Focus on 15-day deadline, required fields, submission process

- **Special Note:** Already updated with new design; maintain session storage snapshot and Turnstile bot protection

## Implementation Approach

1. **HousingPetitionTool Updates:**
   - Add instructions box (gold-soft background)
   - Add section headers with icons (👤 Kişisel Bilgiler, ⚖️ Uyuşmazlık, 📝 İtiraz)
   - Update field labels with required indicator `*`
   - Add placeholder and helper text to all fields
   - Improve TC Kimlik No field with digit-only filtering and validation
   - Adjust spacing: space-y-6 between sections, gap-4 between fields
   - Update button styling with hover shadow + lift effect

2. **Kiracı & Ev Sahibi Forms:**
   - Both use HousingPetitionTool component
   - Apply same design pattern as above

3. **Trafik Form:**
   - Already has instructions box and section headers
   - Minor refinements if needed
   - Ensure TC Kimlik No uses same digit-only filtering

## Constraints

- **No backend changes:** API routes, petition generation, validation logic untouched
- **No PDF changes:** PDF generation pipeline unchanged
- **No payment changes:** PayTR/Iyzico integration unchanged
- **Session storage:** Keep traffic form's session snapshot mechanism
- **Bot protection:** Keep Turnstile widget on traffic form

## Success Criteria

- ✅ All three forms share visual consistency (spacing, colors, typography, icons)
- ✅ TC Kimlik No field accepts only 11 digits with real-time filtering
- ✅ Instructions boxes guide users with clear, actionable tips
- ✅ Section headers organize form logically
- ✅ Button hover effects include shadow + lift animation
- ✅ Responsive design maintained (mobile-first)
- ✅ All backend logic, payment, PDF generation functions identically
