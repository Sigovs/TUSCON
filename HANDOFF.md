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

## v2 (19 Oct 2026) — current working direction
- `index_v2.html`: the new homepage built on Alex's Design DNA. Preview: https://sigovs.github.io/TUSCON/index_v2.html
- Order: hero (Alex's hero_tuscon image) → inventory (search bar, rail, View Current Inventory) → 360 section (1973 Lincoln Town Coupe video turned by scroll, pinned; glass spec card + lines from its description) → About → Sell your car → Financing → Google reviews (labelled samples) → Instagram (our photos, handle TBC) → footer with a dark map and "Powered by All Auto Network".
- Palette: concrete #ECEDEB, ink #101316, asphalt night #0E1114, one action green #3D6646. Type: Zodiak (display), Switzer (text), Geist Mono (labels). Motion: Lenis + GSAP ScrollTrigger; Czinger-style pin-stops on desktop (hero, 360, About, Sell); no pins on phones; reduced motion is static.
- Navigation is the live site's (Home · Current Inventory · Sold Inventory · Financing · Sell Your Vehicle).
- The 360 video looks AI-generated ("Black Lincoln in a spacious studio"); check it against the real car before launch.
- Open: the phone number on the sign in the hero image reads wrong (510-130-4513); Google Place ID; vector logo; a production map style (the dark map is OSM + CSS filter).
- Source: `index_v2.src.html` + `build.py` (not in the repo); `index_v2.html` can be edited directly.

## v2 — session 20 Oct 2026
- **Sell:** three steps 01 Your car · 02 Your price · 03 Photographs, taken from the fields of the live sell form (no invented promises). During the desktop pin hold a cursor walks 01 → 03 and each number stays lit; on phones it follows the list's own scroll.
- **Header:** phone pill (icon-only 900–1180px and on phones, hidden below 375px); 2px reading-progress line along the bottom edge.
- **Motion rule now in the code:** no opacity-gated reveals. Headlines keep their masked ladder; lists only shift; body copy is always visible. A pinned section taller than the screen docks on its bottom edge so the CTA is never cut.
- **Micro elements:** status stamp on inventory photos (only the 1968 GTO is "Coming Soon!" on the live site as of 20 Oct; a `data-status="sold"` state is styled but unused); round frosted rail arrows; a 30+ anchor numeral in About.
- **360:** the clip turns front ¾ → rear ¾ (≈35° → 145°, read off its frames), not 360°. The dial shows that range; the video's aria-label was corrected.
- **Local preview:** use a server with HTTP Range support, or the 360 video will not seek: `npx http-server@14.1.1 -p 5181 -c-1` (Python's http.server does not seek MP4).
- **Open:** at 1024×768 the Sell and About pins are taller than the screen (their headlines sit above the fold during the hold). The repo moved to `github.com/Sigovs/TUSCON` (the push redirects).

## v3 — 20 Oct 2026 (working copy; v2 is frozen)
- `index_v3.html` + `css/v3.css` + `js/v3.js` — a copy of v2; all new work goes here. Source `index_v3.src.html` (not in the repo).
- Titles about a quarter smaller (client's manager): hero 100→76px, section titles 100→72, Sell 124→84, sub-titles 60→46.
- The Lincoln 360 section is removed from v3 at the manager's request. **Parked for a future About us page** — the video (`assets/video/lincoln-360-*.mp4`, poster `assets/img/lincoln-360-poster.jpg`) and the scrub code in `js/v3.js` stay in place; the full section is still live in v2. Check the clip against the real car before reusing it (it looks AI-generated).

## v4 — 23 Oct 2026 (client approved the homepage; SRP + VDP started)
- `index_v4.html` + `css/v4.css` + `js/v4.js`: copy of v3 with the client's **vector logo** (`assets/img/logo.svg`, from "Logo Vector copy.pdf", background plate removed). Nav "Current Inventory" → `inventory_v4.html`; the Oldsmobile card → `vehicle_v4.html`; the sold 1968 GTO in the rail replaced by the '95 Corvette.
- **SRP** `inventory_v4.html`: the 12 cars the live site offers for sale with a price and a gallery (23 Oct). Filters: type (cars / motorcycles), era, sort; state kept in the URL. One editorial break (sell) after six cards.
- **VDP** `vehicle_v4.html` (1956 Oldsmobile Super 88, the only VDP built): one viewer for all 280 photos + the YouTube video, jump-to chapters (exterior → documents), full-screen view; the owner's write-up verbatim in chapters; the ownership chain from that text; phone dock with price / Call / Ask.
- Shared: `css/v4-inv.css`, `js/v4-inv.js`. Pages are generated by `_tools/build_v4_inv.py` from `assets/data/inventory.json` (`_tools/scrape_inventory.py`); `_tools/` is not in the repo.
- **Live-site facts found while scraping:** the homepage "Our latest cars" is stale — 11 of its 15 cars say SOLD on their own pages (incl. CT5-V, Ram, Range Rover, Avanti, Model A, the GTO). Listing page 2 answers 500. Data errors: Bronco make "Brockhouse", Hillegass make "Hillman", '66 Corvette 427 has no photos and make "Model", the Oldsmobile's listed colours (White/White) contradict its write-up (Turquoise and Ivory) — the VDP follows the write-up.
- **Photos** stream from the client's CDN, which refuses foreign referrers (hotlink rule); the mock-up pages send no referrer. Production must serve photos from its own media pipeline.
- Client Dropbox (`__FROM CLIENT/`, not in the repo): facade photos IMG_2232/2233 (hero swap **not** agreed — we asked what "clean up" means; likely the sign in the current hero), sign2 (real sign, correct number), two showroom shots, the vector logos.

## v4 — session 24 Oct 2026 (SRP + all VDPs + card galleries)
- **Every SRP car has a VDP:** `vehicle_v4_<slug>.html` ×12, generated by `_tools/build_v4_inv.py`. `vehicle_v4.html` is now a redirect to the Oldsmobile page. The Oldsmobile keeps its hand-built chapters, tally and paper trail; the other eleven use the generic template with a per-car config in the builder (`VDPS`): our chapter headings only where the owner's text changes subject, his lines verbatim, list-type write-ups (BSA, Harley, Camaro) as lists, "Label: text" write-ups (Corvette, Cadillac) as label/value rows. The four record-card facts per car are read off the owner's text, never the scraped spec fields (those are theme defaults on several cars: Marsh Metz "Automatic/FWD", Falcon "FWD").
- **VDP layout follows the All Auto Network demo VDP Alex pointed at** (prestigeimports.aandemo.com, password-protected — reached through Alex's own Chrome session): photo + record card beside it, thumb strip under the photo, the write-up below **as one block** (no chapters, no inset photographs), then Financing and See it in person as closed accordions right under it (Alex dropped the Specifications one), then a bare price + Inquire row, then three related cars. "See it in person" is a visit-request form (name, email, phone, when suits you, message pre-filled with the car).
- **Record card (Alex, 24 Oct):** the live listing's title verbatim ("1946 Ford Coupe Blown H&H Flathead") → price → six spec rows (label left, value right, hairlines between) → the two buttons. No year/make row, no sub-line, no address/financing note. Every spec value is read off the owner's text; "(as listed)" marks the few taken from the listing's own fields. The scraped spec fields are not used blindly: they are theme defaults on several cars (Marsh Metz "Automatic/FWD", Olds "White/White").
- **Inquire:** every "Inquire" on a VDP (record card, closing block, phone dock) opens a slide-over panel from the right with the car's thumbnail, title and price beside a form (first/last name, email, phone, message pre-filled "I would like more information about the <car> (<price>).", consent). **Mock-up: Send opens the visitor's email app with the message** (the page says so under the button); production needs the dealership's form endpoint. Without JS the buttons are mailto links.
- **Viewer:** several videos per car (Camaro and Cadillac have two); each car opens on a frame that shows the vehicle (`START` in the builder: the Harley gallery begins with four framed posters, the Camaro's with 110 underside shots — the exteriors start at frame 142). The Oldsmobile page keeps its tally and paper-trail sections; its chaptered write-up with inset photographs is gone like the others'.
- **Card galleries:** every car card (SRP, homepage rail, "More from the showroom") turns through its cover + 3 photographs with arrows on the photo's sides and a 1/4 counter; arrows show on hover, always on touch; frames beyond the cover load on first use. `js/v4-card.js` (shared); the card surface is a div, the whole card is still one link (`.car__t::after`). Homepage rail cards now link to the VDPs.
- **SRP (Alex, 24 Oct):** the Era/Sort dropdowns are custom lists drawn on the box's own edges (the native popup opened at the `<select>`, inside the box); the grid gutter equals the homepage rail's (`clamp(28px,2.4vw,36px)`, both ways); the "as of <date>" after the vehicle count is removed.
- **Stock #:** the live listings carry no stock numbers (only WordPress post ids, e.g. 70013 for the 1946 Ford). The closing price block shows "Stock # to be assigned" as a visible placeholder; fill it from the client's DMS or use the post ids once the client agrees.
- **Logo lockup (24 Oct):** the header now carries the client's emblem (`logo.svg`, from "Logo Vector copy.pdf") plus his two-line lettering (`assets/img/wordmark.svg`, from "Logo Letters 7 1 25.pdf", extracted with PyMuPDF). The seven dark shadow plates behind the words were dropped: they are invisible on the black plate the PDF uses and showed as bars on paper. Colours as drawn (white letters, dark outline). The three-line "Letters … B" version is unused. The typed name in the header is gone. Header is 80px (68px on phones). Over the homepage hero the emblem shows, enlarged; everywhere else (after the hero, and on every sub-page) only the two-line lettering shows, 58px tall (48px tablet, 40px phone) — Alex's call, 24 Oct.
- **Footer:** "Powered by All Auto Network" is a link to allautonetwork.com with the name in ink (it was plain text in the legal line and Alex did not see it).
- Verified in Chrome at 1440 and 390: SRP, homepage rail, Camaro and 1946 Ford VDPs, the inquire panel, the accordions; no console errors; no horizontal overflow. Not verified: the other nine generic VDPs in a browser beyond the build (same template), the actual Send (it hands off to the mail app), 1920/1024/768.
- Pre-existing, not ours: the homepage console warning "GSAP target not found" comes from `[data-line]` in the Sell section (v3 removed those lines).

### Feedback log (rules that should survive)
- Dropdowns: never the native popup; a list aligned to the control's box.
- Card gutters are the same everywhere (rail and grid).
- No "as of <date>" stamps in visible copy.
- VDP record card: live title → price → spec rows (label | value, hairlines) → buttons. Nothing else in it.
- VDP write-up: the owner's text as one block; no chapter headings, no inset photos.
- Every "contact" on a VDP is a form (Inquire panel, visit request), pre-filled with the car.
- VDP must have an Inquire with the car pre-filled and its thumbnail beside the form.


## v4 — 25 Oct 2026 (office Mac; client feedback on SRP + VDP)
Client: *"SRP and VDP — search on the side, very straightforward. He doesn't post a lot of specs but larger descriptions. Every car also has a video. On the VDP, wouldn't mind CTA to Finance or Sell Your Car."*

**⚠ Hand-edited on a machine without `_tools/`.** `inventory_v4.html` and all 12 `vehicle_v4_*.html` were changed directly. Port these into `_tools/build_v4_inv.py` before the next rebuild, or it will overwrite them. The SRP edit is scripted in `research/v4/make_srp_side.py` (reads `inventory_v4_2.html` + `assets/data/inventory.json`); it is not in the repo.

- **Two SRPs, for a side-by-side with the client:** `inventory_v4.html` = new, search on the side (linked from the site); `inventory_v4_2.html` = the previous top-bar SRP, kept as it was, not linked.
- **SRP (new):** sticky left panel — keyword search (title + the full write-up), Type, Era and Price **checkboxes** with counts (several can be ticked in a group; none ticked means all), Clear all, the phone. Sort and "N of 12" sit above the list. One car per row: photo left; on the right the opening of the owner's write-up (~270 characters, verbatim, ending in …) instead of the one-line quote. A "Video" badge sits on the photo of every car that has one. The sell break comes after the 4th car. The URL keeps the state (`?q=&type=car,bike&era=&price=&sort=`). From 900 to 1180px: two cards across. Under 900px the panel folds behind "Search & filter".
- **VDP:** the page is two columns down to "More from the showroom" (`.vdp__cols`): viewer, write-up, accordion, Finance/Sell band on the left; **the record card sticky on the right the whole way**. Under 1181px the card drops in right after the viewer.
- **Record card:** under Call there are now two more buttons, **Finance** (scrolls to the lenders) and **Trade-in** (opens the Inquire panel with a trade-in message). Alex asked for these on 25 Oct; this extends the 24 Oct "nothing else in the card" rule.
- **Finance / Sell band** (`.vcta`): Woodside + J.J. Best, plus "Sell us your car". It replaces the Financing accordion, so "See it in person" is now accordion 01. On desktop the closing price row is hidden, because the sticky card beside it already carries the price and Inquire.
- **Video:** a "Watch the video" pill on the main photo plays the first video. The video is still the first thumbnail as before.
- **Video coverage:** 3 of the 12 have no video in the scraped data: the 1912 Marsh Metz, the 1954 BSA and the 1954 Hillegass. The client says every car has one, so ask for those links.
- **Phones, fixed in passing:** the header ran 22px past 390px after the 24 Oct lettering change, cutting off "Menu". The gap is now tighter and the phone pill hides under 430px. The VDP closing price row also ran past 390px; it now stacks.
- **VDP video fixed (it never played):** YouTube answered "Error 153" because the pages send no referrer (`<meta name="referrer" content="no-referrer">`, set for the client CDN). The iframe now carries its own `referrerpolicy="strict-origin-when-cross-origin"`. While the video plays, the photo counter, arrows and full-screen button are hidden, because they sat on YouTube's controls. This was broken on every VDP since 23 Oct.
- **SRP view toggle:** a Tiles | List switch sits next to Sort. **Tiles is the default.** Tiles are the homepage card, two across beside the panel (three from 1700px), with a 3-line excerpt. List is one car per row with a 5-line excerpt. The choice is kept in the URL (`view=list`) and remembered on the device. The switch is hidden under 1181px, where both views are the same cards.
- **VDP:** the line "Mock-up · the button opens your email app with this request" is removed from both forms on all 12 pages (Alex, 25 Oct). The forms still hand off to the visitor's email app.
- **VDP · See it in person:** the "Or call 520-350-9332" beside "Request a visit" is removed (Alex, 25 Oct). The Inquire panel keeps its own.
- **VDP · video pill:** "Play video" is a light pill with a green play disc on the main photograph; it starts the first video.
- **VDP · record card compact:** the whole card (title, price, facts, four buttons) now fits beside the photos. Measured on all 12 VDPs from 1920×1080 down to 1280×720: the card bottom never falls below 640px. On a shorter window the card scrolls inside itself instead of running under the fold.
- **VDP · See it in person:** the "01" is removed, since there is only one accordion now. It reads as a button: framed white box, calendar icon, the sub-line "Book a visit to the showroom — by appointment", and a green + that turns to an ink × when open.
- **VDP · thumbnails:** larger and fewer — 6 on desktop and tablet, 4 on phones. The video thumbnail comes first with a green frame and play disc. The last visible thumbnail reads "+N" and opens the full-screen viewer, and "View all N photos" under the strip does the same.
- **SRP · sell break:** it now lands after whole rows only — after 2 rows of tiles (4 or 6 cars depending on columns) or 4 rows of the list. No more half-empty row before it (Alex, 25 Oct: "fill everything").
- **SRP · active filter pills:** each ticked box and the search word appear as a small pill above the list; × removes that filter, and "Clear all" shows when two or more are on.
- **VDP · record card air:** spacing is back, but it scales with the window *height*: roomy on tall screens, tighter only where needed. Measured on all 12 cars it fits with no fold at 1920×1080, 1440×900, 1366×768, 1280×800 and 1280×720 (tightest: 712 of 720).
- **Footer (all v4 inner pages):** "Vehicle details and photographs from tucsonclassics.com" is gone. The legal line is now just © on the left and "Powered by All Auto Network" on the right.
- **VDP · spec label:** "Rear" is renamed **Drivetrain**, the field name the All Auto Network listings use. It applies to the 1932 Ford, 1946 Ford and Yenko Camaro. Every other row is as it was (Alex, 25 Oct: the rows were fine, only the word was odd).
- **v4 fully linked (checked 25 Oct by crawling from `index_v4.html`):** all 14 pages are reachable (home, SRP, 12 VDPs), with no broken page or asset links and no links to non-v4 pages. Only Financing, Sell and Sold still go to tucsonclassics.com, because those pages are not built. The homepage search now posts to `inventory_v4.html`, which reads its `make` / `decade` / `model` and turns them into the search word plus the Era box. Before this, it sent visitors to the live site. `inventory_v4_2.html` (the comparison SRP) and `vehicle_v4.html` (a redirect) are intentionally unlinked.
