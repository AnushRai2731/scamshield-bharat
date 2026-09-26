# ScamShield Bharat — Latest Stitch Design Extraction

Source: Google Stitch project **ScamShield Bharat Redesign**  
Project ID: `4676420991191967821`  
Design system: **Bharat Sentinel System**  
Design system asset: `a06c43b0fafd47e5b8dbd3615b2ded58`  
Latest project update observed: 2026-09-26

## Screens

| Screen | Stitch screen ID | Device | Size |
|---|---|---:|---:|
| Home — ScamShield Bharat | `982c4683774141008918f9ae2e2b9fa7` | Desktop | 2560 × 10212 |
| Check Suspicious — ScamShield Bharat | `172e94e03a7e42998f12c78ce1a367ec` | Desktop | 2560 × 3956 |
| Analysis Results — ScamShield Bharat | `c0d337af0d2641eab92e299aef1cc53a` | Desktop | 2560 × 7268 |
| Home (Animated + Dark Mode) — ScamShield Bharat | `34c725f35c8d4672af72fffb35da7cbe` | Desktop | 3602 × 10320 |
| ScamShield Bharat Logo | `a0ec5959c1c443b782b41f5b59b03e56` | Desktop | 240 × 60 |

## Design direction

The latest system is calm, protective and institutional rather than “hacker” or alarmist. It combines modern Indian civic trust with consumer fintech polish:

- Quiet authority, emotional reassurance and family-friendly language
- Warm off-white foundations with deep navy structural anchors
- Color used for behavioral meaning, not decoration
- Spacious layouts, soft elevation and rounded surfaces
- No Matrix effects, terminal graphics, skulls or aggressive red screens

## Core tokens

### Color

```css
--background: #F8FAFC;
--surface: #FFFFFF;
--surface-inset: #F1F5F9;
--text-primary: #0F172A;
--text-muted: #64748B;
--navy: #0F172A;
--blue: #2563EB;
--green: #10B981;
--green-dark: #059669;
--amber: #F59E0B;
--amber-dark: #D97706;
--red: #EF4444;
--red-dark: #DC2626;
--line: #E2E8F0;
```

### Typography

- Headlines and body: Plus Jakarta Sans
- Labels, data and timestamps: Inter
- Display desktop: 40px / 48px, weight 700
- Display mobile: 32px / 38px, weight 700
- Headline XL: 30px / 38px, weight 600
- Body large: 16px / 26px
- Body medium: 14px / 22px
- Label medium: 12px / 16px, weight 600

For Hindi, Telugu, Tamil, Bengali and Marathi, preserve line-height and add approximately 2px when needed to prevent cramped scripts.

### Layout

- Desktop: 12-column grid, max width 1280px, 24px gutter, 32px margin
- Tablet: 8-column grid, 20px gutter, 24px margin
- Mobile: 4-column fluid layout, 16px gutter, 16px margin
- Vertical rhythm: 4px, 8px, 16px, 24px, 40px
- Use 12px gaps for stacked alert and signal lists

### Shape and elevation

- Cards: 20–24px radius
- Inner modules: 12px radius
- Buttons, tags and badges: pill radius
- Card border: `1px solid #E2E8F0`
- Card shadow: `0 1px 3px rgba(15,23,42,.04), 0 4px 16px -2px rgba(15,23,42,.05)`
- Floating surfaces: `0 10px 25px -5px rgba(15,23,42,.08)`

## Component guidance

- Primary buttons: deep navy background, white text, 12px × 24px padding, pill shape
- Secondary buttons: white background, slate border, royal-blue text
- Input fields: 56px minimum height, white surface, 1.5px slate border, 16px radius
- Focus state: royal-blue border with a soft blue outer ring
- Risk chips: 28px height, 4px × 12px padding, pill shape
- Safe state: emerald tint and emerald text
- Caution state: amber tint and amber text
- Critical state: soft red halo, never a full aggressive red page
- Parent Mode: nested light inset card with plain conversational language and audio/share affordances

## Current implementation mapping

The existing Vite app already has the matching product routes:

```text
/              Home
/check         Check Suspicious
/results/:id   Analysis Results
/demo          Demo cases
/history      History
/learn         Scam education
/emergency     Emergency guidance
/about         Product and privacy boundaries
```

The next frontend pass should primarily update the token layer, typography, button shape, input surfaces, card elevation, and the Home / Check / Results page compositions to match this extraction. Keep the existing FastAPI API contract and Gemini flow unchanged.
