# Tucson Classic Motor Co. — handoff (state at 16 Oct 2026)

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

## Open items / blocked on the client
1. **Hero retouch:** remove the blue advertising billboard above the green sign. **Do not touch the dealership's own green sign** or the building lettering. Still to be decided: the neighbour's sign on the far left ("…INGFIS…") and the overhead wires. Cleanup only, nothing generated or extended.
2. Google reviews: needs the Google Business **Place ID**. The block is currently a mock-up.
3. **Vector logo.** The current logo is a 335 px raster.
4. A shared **Dropbox** link (the link given was a private /home path; Alex says Dropbox is empty for now).
5. The map uses free OSM tiles: fine for a mock-up, but production needs a tile provider.
6. "Service Department Mon–Sat 8–5" on the live site looks like theme leftovers. Confirm with the client before reusing it.
7. Data to check: the live homepage showed the 1930 Model A as $26,500 while its VDP says SOLD. Not every VDP has a video (1912 Marsh Metz, 1954 Hillegass).

## Next likely steps
- Alex's review of this interactive homepage → fixes.
- After that, possibly: the hero retouch, real reviews, then the SRP and VDP (not started).

## Editing note
`index.html` can be edited directly. On the original Mac it was generated from `index.src.html` + `build.py` (not in this repo, see `.gitignore`).
