---
name: ui-ux-engineer
description: >-
  Evaluates a website or web app from a UI/UX Engineer perspective—combining
  visual design critique, user journey & conversion UX, information
  architecture, interactive affordance, perceived performance, and responsive
  viewport craft using real rendered screenshots alongside source code.
---

# UI/UX Engineer Review

A holistic evaluation framework bridging **Product & Visual Design** with **Frontend Engineering**. Unlike a pure code/WCAG linter, this skill judges how the product actually looks, feels, communicates, and converts for real human users across viewports—then translates every finding into concrete, stack-appropriate engineering fixes.

## 1. Recon & Visual Capture (Never Judge Blind)

1. Read the project's design system and product rules (`DESIGN-SYSTEM.md`, `RULES.md`, `PLANNING.md`, tokens, and main pages/components).
2. Identify the **business model & primary user goal** (e.g., e-commerce checkout vs. custom B2B/B2C portfolio lead-gen via WhatsApp).
3. **Inspect real rendered views** (live browser or headless screenshots with isolated temp `--user-data-dir`) across key viewports:
   - **Mobile**: `390×844` (and narrow edge `320×720`)
   - **Compact Laptop**: `1280×720`
   - **Desktop**: `1440×900`
   Capture both the **entry/browse view** and the **detail/conversion view**.

## 2. Evaluate Across 6 UI/UX Engineer Pillars

### Pillar 1: 5-Second Test & Mental Model Clarity
- Within 5 seconds of landing, can a new user tell **what this business offers**, **who it is for**, and **how to take the next step**?
- Does the UI language match the business model (e.g., custom portfolio vs. ready-stock shop), or do labels create false expectations?
- Is the category/navigation structure clear without forcing users to guess?

### Pillar 2: Visual Hierarchy, Focal Point & Chrome-to-Content Ratio
- Evaluate what competes for the eye first (primary media vs. animated rings, watermarks, floating bars, secondary badges).
- Check card density, spacing rhythm, and vertical balance on both mobile and short laptops (`720px` height).
- Check media framing: consistent aspect ratios, lighting, alignment, and whether product visuals look unified across slots.

### Pillar 3: User Journey, Friction & Conversion UX
- Trace the full flow: **Landing / Preload → Browse / Compare → Inspect Details → Build Trust → Convert (CTA)**.
- Identify **pre-CTA anxiety** (questions buyers have *before* clicking WhatsApp/Order that remain unanswered: minimum order, turnaround time, pricing model/starting range, how custom design works, proof of real work).
- Check whether primary CTAs are obvious, singular per zone, and positioned inside the thumb zone on mobile.

### Pillar 4: Interactive Affordance & Perceived Performance
- **Discoverability**: Can users tell at a glance what can be swiped, hovered, clicked, rotated, or toggled (e.g., horizontal rack scroll, 3D garment flip, flash preview)?
- **Loading UX**: Does a blocking preloader delay first meaningful paint unnecessarily, or could critical-above-the-fold assets load progressively so the user sees the stage right away?
- **Feedback & delight**: Are micro-interactions (physics, sound, transitions) purposeful and responsive without feeling sluggish or noisy?

### Pillar 5: Responsive Craft & Viewport Ergonomics
- Verify above-the-fold completeness at `390×844` and `1280×720` (no clipped garments, no cramped controls, no hidden category switches).
- Check sticky/floating bars (`header`, bottom CTA dock) for overlap, scroll breathing room, and safe-area comfort.
- Ensure desktop panels use the horizontal space purposefully rather than leaving awkward gaps or hidden scroll cues.

### Pillar 6: Brand Trust & Credibility Signals
- Check how proof is presented: real client samples vs. generic mockups, transparent workshop/location info, process clarity ("free design preview before print"), and consistent visual polish across all categories.

## 3. Output Format

Present the review clearly in the user's language with concrete visual + UX reasoning and practical engineering next steps:

1. **Konteks Produk & Tujuan User**: Who the user is and what success looks like.
2. **Skor & Ringkasan Kesan Pertama (5-Second Test)**: What immediately shines and what causes hesitation.
3. **Analisis Per Layar & Perjalanan User (Browse → Detail → Konversi)**:
   - Include specific observations from rendered screenshots (`mobile`, `laptop`, `desktop`).
4. **Prioritas Perbaikan UI/UX Engineer** (grouped by Impact: *High Impact / Quick Win*, *Medium Impact*, *Strategic Polish*):
   - Explain **Masalah UX**, **Kenapa ini penting bagi user/bisnis**, and **Solusi Teknis** (aligned with the project's existing design system and rules).
5. **Yang Sudah Sangat Bagus (Pertahankan)**: Distinct strengths not to regress.
