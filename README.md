# TERRA & THREAD — Wear the Change

A small clothing label that shows you where every garment comes from. The signature is **the material journey**: an illustrated specimen in which the same set of threads re-forms from loose fibres, into a twisted yarn, into a woven (or knitted) swatch, into the rows of a finished garment. Choose linen, wool, hemp or cotton and the journey starts again with that fibre's character.

Production URL: `https://terra-and-thread.vercel.app`

> Fictional concept brand, built as a portfolio project. Terra & Thread makes no certification, sustainability-rating or measured-impact claims. Products and prices are illustrative.

---

## Concept

Sustainable fashion sites tend to lead with claims. Terra & Thread leads with **process**. The idea is that if you can see how fibre becomes cloth and cloth becomes a coat, you will value the coat, wear it longer and mend it when it needs it. The whole site reads like a field notebook kept by a workroom: specimens taped to paper, a swatch book, an embroidery hoop and a stitched reservation card.

| Step | What the threads do |
|---|---|
| 01 Fibre | Loose, combed fibres drift on the page. Linen is long and straight, wool is crimped, hemp is long and coarse, and cotton is short and curly. |
| 02 Yarn | The fibres gather and twist into a single yarn that slowly spins. The number of turns and the thickness depend on the fibre. |
| 03 Weave | The threads cross into warp and weft over a cloth swatch: plain weave for linen and hemp, an indigo-and-ecru twill for cotton. Wool becomes rows of knitted V loops instead. |
| 04 Garment | The threads become the rows of a garment (Field Shirt, Shepherd Jumper, Carpenter Smock or Chore Jacket) while its outline and seams sew themselves in and the cloth texture fills it. |

## Brand & positioning

- **Name:** *terra*, the ground the fibre grows in, and *thread*, what it becomes. The ampersand is the journey between them.
- **Promise:** *Wear the change*, meaning change in how clothes are valued rather than a marketing number. Every piece ships with what it needs to be repaired.
- **Tone:** warm, plain and practical, like a tailor talking you through a cloth. The copy describes processes and properties (wet-spun linen, rope-dyed indigo, natural crimp) and never makes environmental claims.
- **Conversion:** "Reserve a piece from the first bolt." It is a demo form and nothing is reserved.

## Audience

Adults aged 25–55 who buy fewer, better clothes, care how things are made, distrust greenwashing and enjoy craft detail.

## Art direction

- **Palette:** oat `#EFE6D6`, clay `#A65A3A`, moss `#4E5B3A` and indigo `#2E3A5C`, with soil `#2B2621` for text, paper `#F7F1E5` for cards and a dark moss band for the four-rooms track.
- **Tactile surfaces:** paper fibres and grain on the page, and CSS-only cloth textures for the swatches (linen slub, wool knit, hemp canvas, indigo twill). Swatches in the swatch book have pinked edges made with a CSS conic-gradient mask. The specimen card is held down with masking tape.
- **Illustration:** all imagery is original SVG. Garments are drawn as flat-lay pattern shapes with neutral weave textures over a colourway base, light-to-shadow shading and stitched details. The four rooms (field, mill, loom and workroom) are layered duotone scenes in the brand palette.
- **Editorial structure:** a journal masthead (*Field notes No. 04*), large Young Serif headlines with clay accents, specimen labels and running-stitch rules.
- **Logo:** an original mark of a round field with three furrows (moss) inside a clay circle, crossed by an indigo thread that weaves over and under the furrows, with a needle's eye at the top. See `logo.svg`; `favicon.svg` is a bolder version on oat.

## Typography

- **Young Serif** (400) for display: headlines, numerals, prices, specimen labels and pull quotes. Young Serif has no italic, so emphasis is set in clay rather than as faux italics.
- **Albert Sans** (300–600) for text, labels and controls. Labels are uppercase with 0.1–0.16em tracking.
- Both load from Google Fonts with `display=swap`. Headings use `text-wrap: balance` and `overflow-wrap: normal`.

## Motion language

- **Re-forming threads:** each journey step tweens every strand's points from where they are to the new layout, with a per-strand stagger and a slight lift, so fibres visibly gather into yarn and yarn into cloth.
- **Sewing in:** section headings are revealed left to right as a running-stitch underline sews itself in (`steps()` timing). In the garment step, the outline and seams draw on like stitching.
- **Tactile springs:** buttons, chips and swatches answer with a gentle overshoot, and the swatch book fans and lifts the chosen swatch.
- **FLIP filtering:** filtering the collection glides the remaining pieces into their new positions instead of snapping them.
- **Darning:** in the mending story the warp threads are laid first and then the weft weaves over and under, driven by a slider.

## Signature interaction: how to use it

1. **Choose a fibre** with the swatch pills under the headline (Linen, Wool, Hemp, Cotton).
2. **Step through the journey** with the 01–04 tabs under the specimen, the arrow keys on a focused tab, or the previous and next buttons. The note beside the specimen explains each step for that fibre.
3. **Watch it play:** on load the journey plays itself through every step and fibre. Use the pause button to stop it; any manual choice also pauses it. Reduced-motion users get a still, step-by-step version.

The collection also links the systems together. Filter by material, open any piece to see it larger, switch colourways, and press *Reserve from the first run* to carry the piece into the form. In the swatch book, *See the … pieces* filters the collection to that fibre.

## Sections

1. **The journey:** hero and signature interaction.
2. **Four rooms:** field, mill, loom and workroom. This is a pinned horizontal track on large screens and a swipeable track with buttons elsewhere.
3. **Collection:** eight pieces in an offset editorial grid with material filters and a detail dialog.
4. **Materials:** a fanned swatch book (WAI-ARIA radio group) with notes on fibre, spinning, cloth, hand feel, ageing and care.
5. **Mending:** a story told in an embroidery hoop, darned with a slider.
6. **Reserve:** a validated demo form.
7. **Footer:** navigation, credit and fine print.

## Tech

- Static HTML, CSS and ES modules with no build step and no external libraries.
- `journey.js` is the strand engine: 30 SVG paths (22 on small screens) × 28 points, four layout functions, Catmull-Rom to Bézier smoothing and requestAnimationFrame tweening. It pauses when off screen or when the tab is hidden.
- `garments.js` holds shared material data and garment outlines, plus a span-finder that fits garment rows inside each outline. `catalogue.js` holds the collection data.
- `main.js` drives the UI: autoplay, the rooms track, FLIP filtering, the dialog, the swatch book, darning and the form.
- The total hand-written JS is about 45 KB.

## Local development

```bash
npx serve .
```

Then open the printed localhost URL. ES modules need a server.

## Accessibility

- One `h1`, a skip link, landmarks and `aria-current` in the navigation.
- Journey steps are a tablist with roving tabindex and arrow keys. The fibre picker uses native radio buttons and the swatch book is a radio group with arrow keys. The specimen SVG has a text description.
- The collection uses real buttons, `aria-pressed` filters and a live count. Details open in a native `<dialog>` that traps focus, closes on Escape or a backdrop click, and returns focus to the piece that opened it.
- The mending slider is a labelled native range input with an `<output>` and a live caption.
- The form has visible labels, inline errors (`aria-describedby`, `aria-invalid`), focus moved to the first problem and a focused confirmation that says nothing was sent or reserved.
- `prefers-reduced-motion`: no autoplay, no strand drift or yarn spin, instant step changes and no pinned track. Everything remains operable.

## Performance

- No WebGL and no images: everything is SVG and CSS. The strand engine renders only while it is morphing or idling on fibre and yarn, and only while it is visible.
- Garment cards are static SVG generated at authoring time, and textures are shared SVG patterns.

## Known limitations

- Garments are stylised flat-lay drawings, not product photography; that is by design.
- Fibre facts are general descriptions of common processes, not claims about a specific supply chain.
- The pinned rooms track is enabled only above 1100px wide.
- `og.jpg` is rendered separately by the lead.

---

Designed & built by Saad Bashir — https://www.linkedin.com/in/saadbashirmarketing/
