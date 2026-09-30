**English** | [简体中文](README.zh-CN.md)

# Daily Creative Tools

One small, concrete problem each day: a real need + minimal interaction + a delightful twist + immediate results.

[Explore the tools](https://xiangjianan.github.io/daily-creative-tools/)

| Date | Tool | Design insight | Notes |
| --- | --- | --- | --- |
| 2026-09-30 | [Code Check](https://xiangjianan.github.io/daily-creative-tools/2026-09-30/) | Align missing characters and clarify look-alikes; turn differences into correction instructions | [Summary](2026-09-30/summary.md) · [Research](2026-09-30/research.md) · [Design](2026-09-30/design.md) · [Tests](2026-09-30/tests.md) |
| 2026-09-29 | [Partner Swap](https://xiangjianan.github.io/daily-creative-tools/2026-09-29/) | Keep one person at each table and rotate partners; turn pairings into table-change instructions | [Summary](2026-09-29/summary.md) · [Research](2026-09-29/research.md) · [Design](2026-09-29/design.md) · [Tests](2026-09-29/tests.md) |
| 2026-09-28 | [Folded Place Cards](https://xiangjianan.github.io/daily-creative-tools/2026-09-28/) | Names face others and prompts face you; automatically orient a single-sided printout | [Summary](2026-09-28/summary.md) · [Research](2026-09-28/research.md) · [Design](2026-09-28/design.md) · [Tests](2026-09-28/tests.md) |
| 2026-09-27 | [One More Gift Bag](https://xiangjianan.github.io/daily-creative-tools/2026-09-27/) | Restock only the bottleneck to unlock the next batch of complete gift bags | [Summary](2026-09-27/summary.md) · [Research](2026-09-27/research.md) · [Design](2026-09-27/design.md) · [Tests](2026-09-27/tests.md) |
| 2026-09-26 | [Keep the Subject](https://xiangjianan.github.io/daily-creative-tools/2026-09-26/) | Mark the subject once for three automatic crops; add padding when it cannot fit | [Summary](2026-09-26/summary.md) · [Research](2026-09-26/research.md) · [Design](2026-09-26/design.md) · [Tests](2026-09-26/tests.md) |
| 2026-09-25 | [Linked Edits](https://xiangjianan.github.io/daily-creative-tools/2026-09-25/) | Select once to create linked fields; edit one and update every occurrence | [Summary](2026-09-25/summary.md) · [Research](2026-09-25/research.md) · [Design](2026-09-25/design.md) · [Tests](2026-09-25/tests.md) |
| 2026-09-24 | [Task Sequencer](https://xiangjianan.github.io/daily-creative-tools/2026-09-24/) | Overlap waiting periods for one person’s tasks; instantly see time saved by reordering | [Summary](2026-09-24/summary.md) · [Research](2026-09-24/research.md) · [Design](2026-09-24/design.md) · [Tests](2026-09-24/tests.md) |
| 2026-09-17 | [File Checklist](https://xiangjianan.github.io/daily-creative-tools/2026-09-17/) | Drop files once and let them check off the submission list | [Summary](2026-09-17/summary.md) · [Research](2026-09-17/research.md) · [Design](2026-09-17/design.md) · [Tests](2026-09-17/tests.md) |

## Run locally

Vanilla HTML, CSS and JavaScript, with no third-party dependencies or build step. ES modules require an HTTP server:

```sh
python3 -m http.server 8765
# Open http://localhost:8765/2026-09-17/ in your browser
node --test 2026-09-17/core.test.mjs
```

## Maintenance

Preserve dated directories. Check whether today's tool has already shipped before continuing unfinished work or adding a new date. Keep `research.md`, `design.md`, `tests.md` and `summary.md` for each tool, and update the homepage index and both README languages together.

Read only necessary content after the user explicitly selects it. Process user files locally, do not upload them or persist input, and never force-push history. Tool interfaces and daily research notes are currently in Chinese; the English names above are descriptive translations.

GitHub Pages publishes from the root of the `main` branch.
