# Visual QA against the template

Measured on 2026-11-18 from the static export, with each page laid out in an off-screen frame at
the template's audit widths. Values are computed styles and layout boxes, so they are exact.

| Check (home page)            | Audit                  | 1440      | 1100      | 800       | 390       |
| ---------------------------- | ---------------------- | --------- | --------- | --------- | --------- |
| Header height                | 62                     | 62        | 62        | 62        | 62        |
| Container max / side padding | 1330 / 15, 20 at ≤1279 | 1330 / 15 | 1330 / 20 | 1330 / 20 | 1330 / 20 |
| Section padding              | 130, 80 at ≤1279       | 130       | 80        | 80        | 80        |
| Section H2 size / tracking   | 40, 36 at ≤991 / −1px  | 40 / −1px | 40 / −1px | 36 / −1px | 36 / −1px |
| Hero H1 size                 | 40, 38 at ≤767         | 40        | 40        | 40        | 38        |
| Wordmark                     | 100 / 84 / 84 / 40     | 100       | 84        | 84        | 40        |
| Tagline in parentheses       | 32 / 20 / 20 / 18      | 32        | 20        | 20        | 18        |
| Stats strip rows             | 1 / 1 / 2 / 4          | 1         | 1         | 2         | 4         |
| Creator cards rows (4 cards) | 1 / 1 / 2 / 4          | 1         | 1         | 2         | 4         |
| Primary nav                  | visible ≥992           | yes       | yes       | menu      | menu      |
| Button height                | 48                     | 48        | 48        | 48        | 48        |
| Body text                    | Geist Mono 16 / 300    | ✓         | ✓         | ✓         | ✓         |
| Horizontal overflow          | none                   | none      | none      | none      | none      |

Fixed in this pass: the wordmark row used the 992px breakpoint for its 84px size instead of 768px;
the stats strip wrapped at 992–1279 instead of staying in one row; heading tracking now uses the
audited pixel values (H2 −1px, H3 −0.5px, page titles −2px, stat numbers −3px).

Intentional differences: the accent is neon lime instead of the template's blue, corners and
focus rings follow the PlayerMode design, and the home page has five template cards where the
template has four tournament cards.
