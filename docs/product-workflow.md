> Research note from the original design workspace. References to retained source snapshots and local REA files describe that workspace; those snapshots are not distributed in this repo. Public source links remain available below.

# Spreadsheet → template → batch video

Research and proposed product workflow · 31 October 2026

## Product decision

Build an open-source product for people who repeatedly make the same video with different content. The central promise is **design once, connect a spreadsheet once, export one complete video per row**. Riddles are the first worked example; the same system should support quizzes, vocabulary lessons, product promotions, quotes, and personalised messages.

Treat “Canva parity” as parity for **Bulk Create and the editing/export features needed by that workflow**. Canva's entire design suite is a separate, much larger scope. Keep a full capability backlog while delivering a complete video workflow first.

The strongest initial positioning is: **turn 100 spreadsheet rows into 100 predictable, editable videos, with playable previews and recoverable batch exports**. Spreadsheet-driven video generation already exists elsewhere; open source, self-hosting, ease of use, and reliable output are proposed differentiators, not a proven market gap.

## Evidence and limits

This is a documentation-backed UX study and a concrete REA investigation plan. It is not a completed reverse engineering of Canva's implementation.

- **DOC**: Canva/competitor primary documentation retrieved on 2026-10-31. Canva help pages were read through Jina Reader because direct requests returned HTTP 403. Reader snapshots may be cached and are not proof of the signed-in UI or account entitlements.
- **OBS**: locally observed repository/tool state or an inspected official screenshot.
- **PROPOSED**: a product decision for our implementation.
- **UNKNOWN**: needs a signed-in workflow, real output, or further source evidence.

REA was located at `/Users/void/Developer/personal/rea`, version 6.7.0 in its package metadata. Its source skill and browser observation guides were reviewed. The public local launcher failed because the compiled runtime is missing; no REA MCP tools are exposed in this session. No account, Canva design, source bundle, HAR, or rendered Canva video has been inspected. No setup/configuration changes were made. See `rea-doctor.json` and `rea-investigation.md`.

## What current Canva material establishes

| Finding | Evidence | Implication |
|---|---|---|
| Columns become fields; rows become design versions. Separate text boxes and image frames/grids are connected to fields. Multi-page designs can have connections on each page. | DOC C1 | Preserve this simple mental model and investigate how a row's multiple scenes are grouped. |
| Entry points include page Edit → Bulk create, Apps → Bulk create, and a selected range in Canva Sheets. | DOC C1, C2; OBS official help screenshot | Our feature can be the product's main workspace instead of an app hidden in an editor. |
| CSV, XLSX, manual tables, Canva Sheets, and supported data apps are documented. XLSX can require worksheet/range selection. | DOC C1 | Excel support includes more than uploading a CSV. |
| Canva documents automatic/AI field matching, drag-and-drop matching, and manual remapping. | DOC C1, C2 | Manual mapping plus reviewable suggestions is the parity target. Automatic matching is already present in Canva. |
| The help article supports embedded in-cell images in XLSX/Canva Sheets; cloud image URLs are treated as text. | DOC C1, C2 | URL/asset resolution can improve our workflow, provided failures are explicit. |
| Preview shows the first video frame, not playable video. Media replacement previews are limited to directly linked Canva Sheets. | DOC C1, C2 | Playable previews using imported row data are a concrete improvement target. |
| Generation can produce one design with multiple pages or individual designs, with naming and destination settings. Sheets adds links to generated designs. | DOC C1, C2 | Individual output is already possible. Do not claim Canva can only make one combined video. |
| General bulk download supports MP4/GIF and ZIP delivery but lists a limit of 25 designs for MP4/GIF per download. | DOC C3 | Generation and downloadable files are different stages. Test the actual 100-video path and distinguish export limits from generation limits. |
| C1 says 300 rows/150 columns and up to 150 fields; C2 says the app has a 300-row/60-column limit and Sheets has no specific row/column limit. | DOC conflict C1/C2 | Do not state a universal verified Canva limit. Test each entry point and account. “No specific limit” does not prove unlimited capacity. |
| Canva's public Autofill API describes tagged fields, typed datasets, asset uploads, asynchronous jobs, and create/update modes. Its image/video fields require asset IDs; sheet media cells can reference URLs. | DOC C4 | Useful public architectural reference. This does not prove Bulk Create uses those endpoints or has identical UI capabilities. |

## Proposed user journey

### 1. Choose and design a template

The home screen has two equally direct actions: **Use a template** and **Upload spreadsheet**. Both enter the same workspace and retain progress when users switch between Data, Template, Connections, Preview, and Exports.

For the riddle use case, offer an original starter with question, four options, countdown, answer reveal, and outro. Allow a blank composition and custom templates. Ask for aspect ratio up front, with 9:16 as the riddle starter's default. A template's duration is the sum of its scenes and transitions, not the spreadsheet row count.

**Success:** a user can see one working example before importing their own content.

#### Reusable video editor

Provide a canvas with layers, scene list, and timeline. Support text, images/frames, background video, audio, shapes, logos, fonts, alignment, grouping, locking, cropping, and undo/redo. Add transitions, entry/exit animations, element visibility intervals, trimming, volume/fades, and scene durations. These are editor requirements to validate against Canva; the present research does not establish exhaustive Canva editor parity.

Distinguish shared content from variable content visually. A logo, background track, and transition can remain fixed while question, options, image, and answer change. A field can be reused in several scenes without remapping it.

For riddles, implement a reusable question → countdown → reveal sequence. Countdown length can be fixed or bound to a numeric column. Correct-answer styling is conditional on `correct_option`, rather than forcing users to create four separate templates.

**Success:** a user makes one video whose layout and timing remain stable across rows.

### 2. Import and check the data

Support CSV, XLSX worksheet/range selection, pasted tables, and manual editing in the core workflow. Follow with a direct Google Sheets connector and a generic import/API boundary. Canva Sheets is a benchmark input, not an assumed available integration for our independent product.

Show original column names, inferred types, row count, a small preview, and a stable row identifier. Let users correct header detection, types, and selected range. Preserve source values alongside normalized values. Keep `001` different from `1`, preserve Unicode and line breaks, and make date/number formatting explicit. For XLSX formulas, initially use saved/cached values and flag unavailable values; do not silently promise Excel recalculation or execute workbook macros.

Choose **one row = one complete video** by default. Later offer explicit grouping, such as ten question rows into one quiz video; do not silently concatenate rows.

Errors name the row, column, value, and fix. Separate blocking errors from warnings. Missing optional images can use a declared template fallback; missing questions cannot. Users can correct a cell or explicitly exclude a row. Import is a snapshot; refreshing a connected source shows a diff before it changes a batch.

**Success:** the user knows exactly which rows will produce outputs and why any rows are excluded.

### 3. Connect columns to fields

Selecting an element opens **Connect data**. Choose a spreadsheet column, drag a column onto the element, or accept a suggested match. The connections panel lists `column → element/property`, field type, example value, and completeness. Suggestions are reversible; AI is optional and cannot be required for local use.

Examples: `question → Question text`, `option_a → Option A text`, `answer_explanation → Reveal text`, `correct_option → Highlight rule`, `countdown_seconds → Countdown duration`.

A connection stores stable field/layer IDs, not just visible labels. Renaming a layer does not break it. Renamed or removed columns trigger a repair prompt. An unused spreadsheet column is acceptable; an unbound required template field blocks generation.

Every variable text field declares wrap, alignment, maximum lines, and an overflow policy. Default to wrap plus shrinking down to an explicit minimum size, then flag any remaining overflow. Never silently clip or drop text. Images declare crop/fill/fit and focal point. Variable media declare trim/loop/hold policies. Audio declares mix/replace and duration policy.

**Success:** the user sees where every variable value goes, with no hidden replacement logic.

### 4. Preview and validate the batch

Show a row navigator next to a playable video preview. Switching rows retains the playback position where possible. Include thumbnails for all rows, search/filter, and a review queue for warnings. Automatically suggest checking longest text, shortest text, missing media, and each distinct answer condition, in addition to the first few rows.

The timeline preview must include countdown, transitions, answer reveal, and sound. Use the same resolved composition and font assets for preview and render; then verify output equivalence with a real encoding test. A browser preview alone does not establish export fidelity.

Run preflight for required fields, row IDs, overflow after fitting, fonts/glyphs, media availability/decodability, duration rules, output names, and estimated output count. Show errors at the row/field/scene that caused them. Allow explicit “render valid rows” after the user sees the exclusions.

Provide **Export one test video** before a batch. It should use the real renderer, not merely save a preview recording.

**Success:** the user can check timing and representative edge cases before committing to 100 renders.

### 5. Render and recover the batch

The primary action says **Create 100 videos** with the selected row count. Default output: one MP4 per row, all scenes included. Combined-video output is an explicit alternate option.

Choose resolution, frame rate, audio inclusion, aspect ratio preset, naming, and destination before starting. Show estimates only after measurements exist; label them as estimates. Keep progress per output, cancellation, actionable failures, and retry-failed-only. Successful outputs remain available if another row fails or the browser closes.

Freeze template, bindings, dataset snapshot, assets, fonts, and render settings for a batch. Editing the project produces a new revision; it does not mutate a running job. Cache only when all result-affecting inputs match. Later, show which outputs changed after a data refresh and rerender those rows.

**Success:** 100 selected valid rows become 100 completed outputs; failures can be retried without restarting successful work.

### 6. Download and reuse

Name each file from a chosen column with a stable suffix to prevent collisions. Offer one ZIP, individual downloads, and an output manifest connecting row IDs to filenames/status. Let users download completed files while the remainder continue. Large batches may need split archives with a manifest; do not depend on one unbounded browser-memory ZIP operation.

Save the template and mapping for the next dataset. A new import or connector refresh shows what changed, runs preflight again, and starts a new frozen batch. Later support rendering only changed rows.

**Success:** the user receives 100 usable files and can repeat the workflow with a new sheet.

## Riddle example

Data columns: `id`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `answer_explanation`, `countdown_seconds`, `output_name`. Optional future columns include `background_asset`, `voiceover_asset`, and `language`.

Example timing for one output: question/options for 4 seconds → countdown for 5 seconds → answer/explanation for 4 seconds → outro for 2 seconds. These are proposed starter settings, not Canva observations. A 100-row batch therefore produces 100 separate 15-second videos. Optional voiceover can extend scene durations under an explicit rule; it must not accidentally cut speech.

The checked-in fixtures include clean CSV/XLSX examples, deliberately invalid edge cases, and a 100-row scale fixture. The scale fixture repeats sample riddles to test batch mechanics; it is not a bank of 100 original riddles.

## Capability coverage and delivery order

| Capability group | Complete initial video workflow | Parity expansion | Beyond the researched baseline |
|---|---|---|---|
| Data | CSV/XLSX, worksheet/range, paste/manual table, type correction | Direct Sheets connector, reusable import mappings, embedded spreadsheet images | Change detection, API/webhooks, scheduled imports |
| Templates | Original riddle starter, blank video, save/duplicate, custom dimensions | Broader original template library, static-design output, reusable brand assets | Portable template packs, contributor registry |
| Editor | Text/media/shapes, layers, timeline, fonts, animations, transitions, audio | Broader animation controls, layout constraints, aspect-ratio adaptation | Conditional scenes, nested/grouped row compositions |
| Connections | Manual/drag mapping, name-based suggestions, repeated fields, overflow rules | More typed property bindings, optional AI suggestions | Conditional styling, formulas, localisation rules |
| Preview | Playable per-row preview, thumbnails, validation, real sample export | Media-rich previews, batch review improvements | Risk-ranked sampling and regression comparisons |
| Generation | One full video per row, frozen revision, visible job status | Multiple output formats and combined outputs | Incremental rerenders, reusable automation recipes |
| Export | MP4, separate files, ZIP, row manifest, cancel/retry failed outputs | PNG/JPG/GIF and evaluated PDF support, storage connectors | CLI/API, worker pools, resumable large-job delivery |
| Open source | Core workflow runs without paid Canva or AI dependency; documented local worker | One-command self-hosting, portable project import/export | Community integrations and template ecosystem |

Delivery sequence:

1. **Evidence pass:** run the REA scenarios, capture real exported files, resolve the multi-scene and 100-video export questions.
2. **UX prototype:** review the six-stage journey with a creator using 10 real riddle rows; confirm they can map, preview, and recover from an error.
3. **Rendering feasibility:** export the same representative composition through shortlisted engines, measure fidelity/performance, and check dependency licenses. See `rendering-options.md`.
4. **Complete first product:** deliver template editing, import, mapping, playable preview, and 100 separate MP4s with recovery as one end-to-end slice.
5. **Broaden parity and automation:** expand media, connectors, output types, branding, reusable rules, and programmatic workflows.

No dates or throughput promises are set before the feasibility pass. A public repository, stack selection, and implementation are future actions; this phase only creates local research/design artifacts.

## Architecture hypothesis to evaluate

Proposed flow: source data → typed dataset snapshot → field bindings + versioned template → resolved composition per row → preview/test renderer → durable render queue → encoder → files + manifest.

The template schema should be independent of the editor's canvas library and the encoding implementation. Store scenes, stable layer IDs, timing, transforms, typography, assets, bindings, and declared fit/overflow rules. A binding resolver creates an immutable composition; both preview and export consume it.

Start with a web editor and a local/self-hosted render worker as a candidate deployment model. Offer an optional hosted worker later. Browser-only encoding is a hypothesis to benchmark against memory, codec, and background-tab limitations, not a prerequisite or an established solution. A durable queue and stored outputs are necessary for recovery; the database/framework choice is deliberately undecided.

Evaluate licensing before choosing a renderer. Publicly visible source is not sufficient to establish permissive open-source rights. Keep the core workflow useful without a required commercial rendering API or paid AI service. Bundle only assets/fonts/templates we have rights to redistribute; create original examples.

## Competitive context

- **Canva:** broad design editor with bulk data binding and multiple input/output paths. Its documented still-frame bulk preview and export batching are relevant comparison points. Its exact signed-in video behavior remains unverified here.
- **Creatomate:** explicitly markets template-driven spreadsheet video/image generation, CSV import/export, dynamic media/text replacement, APIs, and interactive previews. This is a closer direct benchmark than Canva alone. See K1/K2.
- **Shotstack Workflows:** documents CSV batch triggers, a visual workflow builder, and media generation/delivery integrations. Useful for studying automation and scale. See K3.
- **Bannerbear Workflow API:** describes reusable input-driven steps, queued execution, step-level progress/failures, and preserving successful step outputs. Useful recovery/automation reference; this is not evidence of full video-editor parity. See K4.

These are vendor descriptions, not hands-on comparative tests. No market-size, pricing-superiority, render-speed, or customer-demand conclusion is established.

## Questions the next pass must answer

1. Does Canva's current bulk operation duplicate all scenes of a multi-scene video as one row-level design? How are transitions, audio, and numbering retained?
2. Are mappings preserved/reusable across imports, and how do renamed headers or changed datasets behave?
3. What happens to long text, missing media, invalid data, RTL scripts, and variable asset durations?
4. Which image/video/audio bindings exist in the actual Bulk Create UI, as distinct from the public Autofill API?
5. Can a 100-row video batch be generated/exported in one operation on the target account? What are its actual limits and recovery steps?
6. Do designs remain linked to source data, or are they snapshots after creation? Test rather than inferring from “connected”.
7. Which renderer preserves text layout, timing, audio, and typography while fitting this project's open-source goals?

## Sources

- **C1:** [Canva — Create designs in bulk](https://www.canva.com/help/bulk-create/). Retained: `sources/canva-bulk-create.txt` and excerpt. Official screenshot retained alongside it.
- **C2:** [Canva — Create designs in bulk with Canva Sheets](https://www.canva.com/help/bulk-create-from-sheets/). Retained: `sources/canva-bulk-create-sheets.txt`.
- **C3:** [Canva — Download or purchase designs](https://www.canva.com/help/download-or-purchase/), “Downloading multiple designs in bulk limitations”. Retained: `sources/canva-download.txt`.
- **C4:** [Canva developer Autofill guide](https://www.canva.dev/docs/connect/autofill-guide/), redirected to the current [REST APIs guide](https://www.canva.dev/docs/apps/rest-apis/autofill-guide/). Retained: `sources/canva-autofill-guide.txt`.
- **K1:** [Creatomate](https://creatomate.com/). Retained: `sources/creatomate.txt`.
- **K2:** [Creatomate — Bulk generation](https://creatomate.com/bulk-generation) and its [spreadsheet tutorial](https://creatomate.com/blog/how-to-create-many-videos-in-bulk-using-a-spreadsheet). Retained: `sources/creatomate-bulk-generation.txt` and `sources/creatomate-spreadsheet-tutorial.txt`.
- **K3:** [Shotstack — Workflows](https://shotstack.io/product/workflows/). Retained: `sources/shotstack.txt`.
- **K4:** [Bannerbear — Workflow API](https://www.bannerbear.com/v5/products/workflow-api/). Retained from its redirected product URL: `sources/bannerbear-video.txt`.

Failed, blocked, or redirected research URLs are retained in the source index and are not evidence for missing functionality. The Canva Bulk Create/Data Autofill comparison URL resolved to duplicated bulk-create content in this retrieval and is not treated as an independent source.
