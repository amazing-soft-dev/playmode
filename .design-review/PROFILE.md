# Design review profile: PlayerMode

Committed on purpose: it records the audience lens, brand decisions and score history for future reviews. Reports and screenshots live in `runs/` (gitignored).

## Audience lens

```
Industry / business: AI game maker + community gallery + daily challenge (UGC gaming) · Goal: signups and games made (Plus subscriptions second)
Primary audience: kids and teens who play browser games (13+ for accounts; under-13s play without one)
Secondary: parents and teachers (trust, safety); adults buying Plus
Context: phones first, also school/home laptops · at home or school · repeat visits (daily streak) · beginners, no coding · ages ~9–17 plus parents · child-safety and privacy needs (COPPA/GDPR-K cues)
Main path per audience: player → / → prompt box "Make it" → /create · player → /daily → play · player → /gallery → /play/[id] · parent → /parents → contact
Lens: children/teens × gamers × gaming
Source: site copy (src/content/*), README (inferred)
```

## Brand decisions (do not "fix" these into defaults)

- Black page, white text, one accent: neon lime `#C6FF3D` (README, globals.css). Dark only, no light theme.
- Square corners, 1px hairlines, "+" corner crosses, uppercase Host Grotesk headings, Geist Mono body, Syne wordmark (docs/audit/report.md).
- One easing curve `cubic-bezier(.44,0,.56,1)` at 400ms for hovers; 600–900ms reveals (template look).

## Weights used (lens shifts from rubric defaults)

Fit 10 · Hierarchy 12 · Typography 10 · Color 10 · Spacing 6 (−2) · Sizing 10 · Content & imagery 11 (+3) · Responsive 10 · States 8 · Accessibility 6 · Consistency 2 (−2) · Copy 2 (−1) · Motion 3 (+2)

## Accepted exceptions

- **Motion timing (review NIT-3):** hovers at 400ms and scroll reveals at 600–900ms are longer than the ~300ms house rule. They are the template's single easing curve and timing, and reduced motion is honoured, so later reviews skip this.

## Score history

| Date       | Grade | Score  | Evidence                                 | Report                    |
| ---------- | ----- | ------ | ---------------------------------------- | ------------------------- |
| 2026-11-19 | F     | 59/100 | rendered + code (local production build) | runs/2026-11-19/report.md |
