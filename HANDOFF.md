# Tucson Classic Motor Co. — handoff (updated 16 Oct 2026, evening)

## Status
- Scope: **homepage only**. SRP and VDP are context from the brief, not deliverables yet.
- Approved: **Direction A · Frontage with the yellow accent**. Palette and composition are fixed.
- `index.html` here is the finished interactive mock-up. Run it with `python3 -m http.server 5180` → http://127.0.0.1:5180/

## Direction A — what it is
- Idea: the site is the dealership's frontage on Grant Road. Hierarchy: the place (photo) > the cars > selling > the facts.
- Signature device: a light panel **docked onto a real place**: the nav plate and search panel over the hero, the address panel over the map.
- Section order: hero (full-screen photo, search docked bottom-right) → intro → inventory rail → "View current inventory" → **Sell Your Car** (yellow band + showroom photo) → About (client's paragraph, verbatim) → Financing (2 partners) → Google reviews (mock-up) → map + address → footer.

## Tokens
| | |
|---|---|
| ground (stucco) | `#F4F3EF` |
| wall (one tonal step) | `#E8E6E0` |
| ink | `#1F2226` (14.4:1 on ground) |
| ink-2 | `#555A61` |
| line | `#D3D1CA` (rules only) |
| accent yellow | `#F3C437`: fill only, always with ink on it (9.7:1), never text on light |
| type | Jost (headings, UI, tracked caps labels) + Literata (reading text) |

Yellow buttons have a 1px ink edge, because yellow alone is 1.5:1 against the stucco. This is the only change from the approved mock-up and can be removed.

## Client facts (live site tucsonclassics.com)
- 2540 E. Grant Rd., Tucson, AZ 85716 · 520-350-9332 · Info@TucsonClassics.com · showroom by appointment only.
- Copy used, verbatim from the client: "Over 30 years experience in the Classic Car industry", "We know our cars because we own our cars", and the About paragraph.
- Financing links:
  - Woodside Credit: https://www.woodsidecredit.com/apply/?dlr=33361 (contact: Scott Steckel)
  - J.J. Best: http://www.jjbest.com/12154
- Live search params: `/inventory/?make=<slug>&model=<text>&registration[min]=YYYY&registration[max]=YYYY&post_type=vehicle`. Sold page: `/sold-vehicles/`. Sell page: `/sell-your-car/`.
- The inventory in the rail is a snapshot from 16 Oct 2026 (10 cars, real prices and links). Descriptions on the live VDPs are long and first-person; specs are few.

## Rules Alex has set during this project
- A light theme. Green and gold are not banned, but no literal retro styling.
- The client's hero photo stays. A careful crop is OK if the car and the character of the frame survive.
- Concept directions must differ in **composition, photo scale and hierarchy**, not only in fonts and colours.
- No Buy/Sell switch: a plain inventory search plus a prominent "Sell your car" button in the header.
- Never invent claims, reviews, numbers or vehicle details. Placeholders must look like placeholders.
- VDP (later): the video sits next to the photos; the text is split into chapters only where the real text already has them.
- Lenis on every build (reduced-motion off, `anchors`, nested scrollers excluded).
- The Git repo contains **only the page** (index + its files). No research dumps. The repo is public.

## Done in the autonomous pass (16 Oct, evening)
- **Hero retouched:** the advertising billboard behind the green sign is removed. The masked sky was filled by openai/gpt-image-2/edit, and only those pixels were composited back. The sign, its three lamps, the car and everything else are original pixels. Provenance and the mask live on the work Mac in research/retouch/.
- Responsive pass at 1440, 1366, 1280, 1024, 768, 390 and 375: no horizontal scroll, no text below 14px, no console errors, all images load.
- From 900 to 1399px the search panel docks as a row under the photo (on those screens the full 4:3 frame left no free concrete and the panel covered the car). From 1400px it sits on the photo, as approved.
- Portrait tablet (600–899) puts paired blocks side by side.
- All 17 external links return 200. The search builds a working query on the live inventory. The menu, the rail (arrows, keyboard, swipe) and the map (click-to-activate) are tested.
- Impeccable detector: clean on the live page. A Design DNA critic review was run (see the commit history for fixes).

## Open items / blocked on the client
1. Hero: the neighbour's sign on the far left ("…INGFIS…") and the overhead wires are still in the photo, waiting for the client's decision.
2. Google reviews: needs the Google Business **Place ID**. The block is currently a mock-up.
3. **Vector logo.** The current logo is a 335 px raster.
4. A shared **Dropbox** link (the link given was a private /home path; Alex says Dropbox is empty for now).
5. The map uses free OSM tiles: fine for a mock-up, but production needs a tile provider.
6. "Service Department Mon–Sat 8–5" on the live site looks like theme leftovers. Confirm with the client before reusing it.
7. Data to check: the live homepage showed the 1930 Model A as $26,500 while its VDP says SOLD. Not every VDP has a video (1912 Marsh Metz, 1954 Hillegass).

## Preview
GitHub Pages is **not enabled** for this repo yet. To turn it on: Settings → Pages → Deploy from branch → main / root. The URL will be https://sigovs.github.io/TUSCON/

## Next likely steps
- Alex's review of this interactive homepage → fixes.
- After that, possibly: the hero retouch, real reviews, then the SRP and VDP (not started).

## Editing note
`index.html` can be edited directly. On the original Mac it was generated from `index.src.html` + `build.py` (not in this repo, see `.gitignore`).
