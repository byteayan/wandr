# Wandr pitch deck

Ten slides, in HTML. Rebuilt from the original PDF deck so the content is
version-controlled and editable — the previous deck existed only as a flat,
image-only PDF with no text layer.

## Presenting

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 4180 --directory docs/deck
```

| Key                    | Action             |
| ---------------------- | ------------------ |
| `→` `Space` `PageDown` | Next slide         |
| `←` `PageUp`           | Previous slide     |
| `Home` / `End`         | First / last slide |
| `f`                    | Toggle fullscreen  |

Clicking the left or right half of the window also navigates. The slide number
lives in the URL hash, so `#6` deep-links to slide 6.

## Exporting to PDF

Print the page (`⌘P`) and choose Save as PDF, landscape, background graphics on.
Or headless:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --no-pdf-header-footer \
  --print-to-pdf=wandr-deck.pdf http://localhost:4180/
```

Both produce ten 16:9 pages.

> Gradient text renders as a solid accent in PDF exports. Chrome's print
> rasterizer draws a hairline box around `background-clip: text` spans, so the
> print stylesheet swaps in a flat colour. On screen the gradient is intact.

## Editing

Everything is one self-contained `index.html` — markup, styles and the ~40 lines
of navigation script. Slides are `<section class="slide">` elements in document
order; the design tokens are the custom properties at the top of the `<style>`
block.

Slides 1 and 10 use CSS gradients where the original deck used photography. Drop
real images into `.cover-bg` / `.closing-bg` if you want them back.
