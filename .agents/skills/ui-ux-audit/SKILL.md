---
name: ui-ux-audit
description: >-
  Use this skill when the user asks to review, audit, or evaluate the UI/UX of
  a website or web application for layout issues, responsiveness, accessibility,
  visual consistency, interaction polish, and user-friendly copywriting.
---

# UI/UX Website Audit

A structured workflow to inspect a website's UI/UX from both code and visual behavior, grounded in the project's design system and target audience.

## Audit Workflow

### 1. Gather Project Context & Design Rules
1. Look for design system docs (`DESIGN-SYSTEM.md`, `RULES.md`, `.gemini/rules/*`, `tailwind.config.*`, `globals.css`).
2. Identify the target audience, primary user flows (e.g., browse -> inspect -> convert/CTA), and core breakpoints (mobile `360–430px`, compact laptop `1280×720` / `1366×768`, desktop `1440px+`).

### 2. Inspect Key Screens & Components
Read the main layout, page entry, navigation, interactive stages, modals, and CTAs. Verify every finding directly in source files (or live browser screenshots if available).

### 3. Evaluate Across 6 UI/UX Pillars

1. **Layout, Viewport & Responsiveness**
   - Check for `100vh` / `100dvh` + `overflow-hidden` traps that clip content on short laptop viewports.
   - Check for layout shift (CLS) when conditional UI elements appear/disappear (use fixed-height slots where needed).
   - Check fixed/floating overlays (headers, bottom CTA docks) for text overlap and proper bottom padding (`pb-*`) + safe-area insets.
   - Verify no unintended horizontal scroll (`overflow-x-hidden` / `overflow-x-clip`).

2. **Navigation, Affordance & Scrollability**
   - Ensure independently scrollable panels give clear visual affordance (e.g., subtle thin scrollbars rather than hidden scrollbars on desktop).
   - Verify interactive controls use clear, intuitive switches/pills for 2–3 options instead of buried menus.
   - Check modal/drawer escape paths (close button, backdrop click, `Escape` key, focus handling).

3. **Touch Targets, Accessibility & Motion**
   - Interactive elements meet mobile-first touch target minimum (`>= 44px` height/width where applicable).
   - Semantic HTML (`<main>`, `<header>`, `<nav>`, `<aside>`, `<footer>`), descriptive `aria-label` / `aria-pressed`, keyboard navigation, and `motion-reduce` fallbacks.
   - Numeric alignment (`tabular-nums`) for prices, counters, and quantities.

4. **Visual Hierarchy & Surface Readability**
   - Verify glassmorphism / translucent floating elements have enough blur and opacity so background text never bleeds through and reduces legibility.
   - Check adherence to the project's color tokens, border radii, and visual restraint (accent color reserved for primary actions/active states).

5. **UX Copywriting & Audience Clarity**
   - Check that labels, subtitles, and product descriptions match the target user's language—avoiding internal or technical jargon unless explained simply.
   - Ensure consistent currency/number formatting and clear, action-oriented CTA copy.

6. **Media & Asset Quality**
   - Verify images have proper aspect ratio handling (`object-contain`/`object-cover`), consistent framing, clean edges, and zero broken links or missing `alt` attributes.

### 4. Output Format
Present the audit in clear, structured sections:
- **Ringkasan Kondisi Saat Ini**: Short overview of UX strengths and main friction points.
- **Temuan Prioritas Tinggi (Perlu Diperbaiki)**: Bugs, clipping, overlap, accessibility gaps, or broken flows with exact file paths/lines and concrete fix suggestions.
- **Saran Peningkatan UX (Nice-to-Have / Poles)**: Polish opportunities for delight, clarity, and conversion.
- **Hal yang Sudah Baik**: What already works well so it isn't accidentally regressed.
