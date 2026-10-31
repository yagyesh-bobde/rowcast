> Research note from the original design workspace. References to retained source snapshots and local REA files describe that workspace; those snapshots are not distributed in this repo. Public source links remain available below.

# UI direction — Rowcast batch video workspace

31 October 2026 · companion to `ui-walkthrough.html` · builds on `product-workflow.md`. The earlier `workflow.html` concept overview is unchanged.

Labels: **SOURCE** = pinned source files and a published demo (OpenFilm) · **DOC** = public documentation read as text · **INFERRED** = a pattern we drew from it · **PROPOSED** = our design decision · **OBS** = local fixture/repo state.

## Primary reference: OpenFilm studio (SOURCE → INFERRED → PROPOSED)

Pinned at commit `b7673b585e3e9c3b434fe663e68619cc1984ae8b`, saved in `sources/ui/openfilm/` (see its `index.json`; MIT licence). We read the files and looked at frames 0, 25 and 80 from the public README demo (`openfilm.webp`). **We did not run or sign into OpenFilm.** No OpenFilm code, branding, teal colours or chat panel is copied. Our CSS and JS are original.

| What | SOURCE (what the files or demo show) | INFERRED | PROPOSED in the walkthrough |
|---|---|---|---|
| Panes and seams | `globals.css`: “panes float on a board one step darker; the seams are that board showing through”. Light board `#f2f2f2`, pane `#fcfcfc`. Dark board `#111111`, pane `#181818`. `ProjectView.tsx`: panes use `rounded-[7px]` | Calm separation comes from contrast and gaps, not heavy borders | `.app` is a board (`--background` mixed 5% toward black). Panes are cards (`--card` mixed 4% toward white) with 6 px seams and 4–8 px corners derived from `--radius`, in both light and dark |
| Arrangement | Demo frame 80: media/layers left, large viewer with transport under it, inspector right, multi-track timeline across the bottom, chat far right | Structure, canvas, properties and time each need a fixed home. Chat isn't needed for column binding | Template tab: Layers tree · canvas · Inspector over a full-width Timeline (ruler, playhead, scene clips, Layer lane, Audio lane). No chat |
| Header | Compact 32 px title bar with small icon buttons | A restrained header keeps attention on the panes | A 40 px header on the board. The current tab is a raised pane chip |
| Theme | Light and dark token sets. The demo is light, with a light viewer surround | The canvas surround should follow the theme | The viewer pane uses the theme pane colour. Only the 9:16 template keeps its fixed navy/yellow colours (content) |
| Selection and time | Selected layers use a muted blue (`--layer-selected`). In the light theme, scene clips and the playhead are teal (`--tl-scene`, `--tl-playhead`) | Selection and the playhead deserve one clear hue | Host `--ring` = selection and playhead. Host `--primary` tint = scene clips and data |

## Chosen direction: docked studio after OpenFilm (PROPOSED)

- **Chrome follows the host theme (light or dark), including the canvas surround.** This replaces the first pass's constant dark, dotted stage.
- **Colour has meaning only:** primary = connected spreadsheet data and the main action. Ring = selection, focus and playhead. Success/warning/destructive/info = done / will proceed / blocks or failed / rendering or edited.
- **Real column names are monospace pills** (`countdown_seconds`).
- **Template editing is an editor.** Scenes are clips on the timeline and parent rows in the Layers tree; clicking either selects the scene. The Inspector shows the scene (on-screen time, duration − / +, or per-row source) and then the selected layer. The Layer lane shows when the selected layer is on screen. The Audio lane shows the fixed music bed plus selectable tick and chime layers. A per-row countdown clip is hatched. Every control changes existing scene, layer, duration or time state.
- **The editor is visible from the first screen.** Before a template is chosen, the same panes show Starters, a starter preview, the expected columns and the starter's scene structure as a read-only timeline. Tour step 1 is still the starter choice.
- **The other tabs share the panes.** Data and Export each sit in one pane. Connect and Preview use three panes, and Preview has a compact timeline under its player. Spreadsheet, connection, review, batch and retry behaviour are **our adaptations, not OpenFilm features**.
- **Layout (container queries on the app):**
  - ≥900 px: layers · canvas · inspector over the timeline
  - 600–899 px (728 inline): canvas beside a column holding Layers and Inspector, timeline full width below
  - <600 px: canvas, timeline, layers, inspector stacked. Clip thumbnails are hidden.

### Revised alternatives
1. **First pass: neutral workbench with a constant dark stage. Superseded.** It made the video look the same in any theme, but it did not read as an editor. The dark block also fought the light theme, which OpenFilm's light demo shows is unnecessary. **Kept:** theme chrome, meaning-only colour, pills.
2. **Pro-editor arrangement. Now adopted**, which reverses the earlier blanket rejection. We still avoid an all-dark, dense grey-on-black skin in a light theme, and freeform multi-track editing: tracks are fixed to four scenes.
3. **Playful, Canva-like. Not chosen.** Gradients compete with video colours, and airy flyouts are too sparse for 100-row review. **Kept:** template-first start, plain language.

## Screens and why (PROPOSED)
| Workspace tab | Arrangement | Main reason |
|---|---|---|
| Template | Layers tree / canvas / inspector over a timeline (ruler, playhead, scene clips, layer + audio lanes) | Layout from OpenFilm (OF). The inspector follows selection (R1). `{ }` pills mark per-row layers. Countdown comes from a column (hatched clip) or is fixed. |
| Data | grid with pinned `id`, types in headers, attention filter, Compact/Tall, worksheet picker | Row identity always visible (R3). The summary says how many videos are possible right now. |
| Connect | columns (drag or click) / row-1 frame / required fields with suggestions | The template defines what is required. Suggestions stay dashed until accepted (C1). A type guard rejects text in the countdown. Binding is a layer property (R2). |
| Preview | row list + search + filters / playable stage with scene segments and scrubber / row inspector with fixes | Riddles fail in the countdown and reveal, which a still frame can't show (C1). Fixes sit beside the frame they affect. |
| Export | preflight + settings → tile per video → retry failed only → files, ZIP contents, manifest | Separate generation from delivery (C3). Retry only the failures against a frozen revision (R4). Every row is accounted for. |

Happy path: tour steps 1–5 and 8. Corrective paths: step 6 (fill an empty question, shorten an overflowing one, exclude an invalid row) and step 7 (two simulated worker failures → "Retry 2 failed only"). Smaller corrective cases: the empty worksheet ("About"), connecting the wrong column type, and editing the project mid-batch (frozen-revision notice).

## References
| ID | Source | Retained | Influence |
|---|---|---|---|
| **OF (primary)** | [OpenFilm @ b7673b5](https://github.com/openfilm/openfilm/tree/b7673b585e3e9c3b434fe663e68619cc1984ae8b): source files plus the README demo, fetched from raw.githubusercontent | `sources/ui/openfilm/` (+ `index.json`, `commit.json`, MIT `LICENSE`) | Docked panes on a board, viewer + transport, inspector, bottom timeline (see table above) |
| C1 | [Canva: Create designs in bulk](https://www.canva.com/help/bulk-create/) | `sources/canva-bulk-create.*` (earlier pass; direct requests get 403) | Element↔column connection, drag or choose a field, preview before generating. We changed the preview to playable. |
| C3 | [Canva: Download or purchase designs](https://www.canva.com/help/download-or-purchase/) | `sources/canva-download.*` | Documented limit of 25 MP4/GIF per bulk download → separate delivery stage, ZIP split into parts, manifest |
| K2 | [Creatomate: Bulk generation](https://creatomate.com/bulk-generation) | `sources/creatomate-bulk-generation.txt` | "Each row becomes one output" → shown as a visible invariant |
| R1 | [Figma: right sidebar properties panel](https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-explore-layer-properties-in-the-right-sidebar) | `sources/ui/figma-right-sidebar.txt` (new) | Selection-driven inspector; canvas and layer list selection stay in sync |
| R2 | [Figma: Apply variables to designs](https://help.figma.com/hc/en-us/articles/15343107263511-Apply-variables-to-designs) | `sources/ui/figma-variables-bind.txt` (new) | "Apply variable" on text content → "Connect data" inside the inspector. This is an analogy: variables are not columns. |
| R3 | [Airtable: Grid view](https://support.airtable.com/docs/airtable-grid-view) | `sources/ui/airtable-grid-view.txt` (new) | Primary field can't be hidden, row-height options, expand record → pinned `id`, Compact/Tall |
| R4 | [GitHub Docs: Re-running workflows and jobs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs) | `sources/ui/github-rerun-jobs.txt` (new) | "Re-run failed jobs" using the same SHA/ref, with a cap of 50 re-runs → retry failed only, frozen revision |

Secondary references (Canva, Creatomate, Figma, Airtable, GitHub) were read as text via r.jina.ai. All fetches are recorded in `sources/ui/index.json`, which now lists OpenFilm first. Frame.io was considered but not fetched, and it is not cited. Nobody had a signed-in or hands-on session with any of these products, including OpenFilm.

## Verification notes (honest)
- **OpenFilm revision (31 Oct 2026):**
  - The inline script passes `node --check`.
  - A temporary jsdom script outside the workspace checked these with no runtime errors:
    - cold start shows the docked editor with Starters and a read-only timeline
    - Demo assist works from a cold start on all 8 steps
    - a timeline clip selects a scene; Reveal − / + updates the clip and total
    - the tick-sound clip selects the Countdown scene and layer
    - the Layer lane merges Question text across scenes 1–2 and seeks to its start
    - the ruler scrub moves the playhead and marks the current clip
    - fixed/column countdown toggles the hatched clip
    - a canvas click selects the layer
    - Data shows 3 to fix + 1 warning → 97 possible
    - connections go 0/8 → 6/8 → type guard → 8/8
    - Preview clip seek works
    - fixes give “Create 99 videos” → 97 done / 2 failed → a template edit mid-batch → retry → 99 ready
    - the manifest and ZIP actions run
  - Initial visual checks used headless Chrome screenshots of local copies with injected light/dark tokens, without a server. Checked:
    - the template editor at 728 px light and at 1100 px light
    - 390 px dark, with the body pinned to 390 px because headless Chrome kept a wider minimum window
    - the cold-start starters at 728 px light
    - Preview at 728 px dark
  - In-host `html_preview` checks then passed with no console messages: the saved cold-start page at 728 px light and 390 px dark, plus the template editor at 728 px dark and 1100 px light. The HTML file was read and passed inline to the tool. Primary-colour text was subsequently mixed toward the foreground to improve dark-mode legibility, and tour instructions were made independent of pane position. The final saved page is displayed with `html_render`.
- **Earlier pass:** the same flow counts passed jsdom before this revision. The container used to scale video-frame text (`.frame-wrap`, `.starter .pv`, `.clip .th`) and the frozen `sourceRows` batch snapshot are unchanged in logic.
- **Still limited:** the timeline has no zoom, trim or drag, by design: tracks are fixed scenes. Ruler scrubbing uses a transparent range input, so the playhead can sit a few pixels off the pointer. At 600–899 px the canvas pane can show empty space beside a tall inspector. host CSS variables must be complete colour values, not bare HSL triplets. Drag-and-drop was only exercised through code paths, not a real pointer. Keyboard, screen-reader and contrast coverage is not a full accessibility audit. The manifest `<a download>` may be blocked inside a sandboxed host iframe; the in-page manifest preview is the fallback.
- **Simulated:** rendering, failures, retry, test export, ZIP contents and per-file downloads. The walkthrough intro says this once, and per-file downloads state that no file exists.
- **Not evidence of Canva behaviour:** the multi-scene bulk video and real export are still unobserved, and REA was not run.
