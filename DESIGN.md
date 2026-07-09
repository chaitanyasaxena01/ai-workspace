# Design system — AI Agent Playground

## Mood

Mission control for agent runs: calm operational cobalt, instrument clarity, no neon “AI chat” costume.

## Color strategy

**Restrained** (product). Brand landing may use a slightly more committed primary in the hero only.

### Palette (OKLCH)

```css
--bg: oklch(0.12 0 0);
--surface: oklch(0.16 0.008 230);
--surface-2: oklch(0.19 0.01 230);
--border: oklch(0.28 0.012 230);
--ink: oklch(0.96 0.008 230);
--muted: oklch(0.72 0.02 230);
--primary: oklch(0.62 0.14 230);      /* cobalt seed */
--primary-fg: oklch(0.98 0 0);       /* white on filled primary */
--accent: oklch(0.78 0.12 55);       /* warm instrument amber — tools only */
--accent-fg: oklch(0.18 0.02 55);
--danger: oklch(0.65 0.18 25);
--success: oklch(0.72 0.14 155);
```

## Typography

- **UI / product:** Geist Sans (existing), fixed rem scale
- **Mono data:** Geist Mono — model IDs, tool JSON only
- Scale: 12 / 13 / 14 / 16 / 20 / 28 / 36 (product ratios ~1.15–1.2)
- Body measure ≤ 65ch on prose blocks

## Layout

- Shell: sticky top nav + content
- Playground: left control rail + chat column
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48
- Radius: 8px controls, 12px panels

## Motion

- 150–220ms ease-out state changes only
- No page-load choreography on product routes
- Respect `prefers-reduced-motion`

## Bans (impeccable)

- Cyan/teal glow accents, purple gradients
- Side-stripe card borders, gradient text
- Numbered 01/02 section markers as scaffolding
- Tiny uppercase tracked eyebrow on every section
- Identical icon+title+text card grids as the only layout
