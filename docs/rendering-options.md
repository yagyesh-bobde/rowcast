> Research note from the original design workspace. References to retained source snapshots and local REA files describe that workspace; those snapshots are not distributed in this repo. Public source links remain available below.

# Rendering and editing foundations: research, not a stack decision

Researched 2026-10-31 from public primary sources. No renderer was installed or benchmarked. **Documented** below means stated in the linked license, repository, or product documentation; **evaluation judgment** means an inference to test. Repository default branches and product terms can change; captured responses and commit snapshots are in [`sources/rendering/`](sources/rendering/).

The strongest initial evaluation is **Revideo against a small independent canvas-to-FFmpeg pipeline**, using one shared riddle template and dataset. Keep Remotion as a technical reference or separately licensed alternative. A commitment to a publicly accessible repository does not automatically make every dependency open source.

## Candidates and their actual roles

| Candidate | Documented role | Documented license and commercial-use conditions | Evaluation judgment for this product |
| --- | --- | --- | --- |
| **Remotion** | Parameterized React videos; data can change content, dimensions, duration and frame rate. Embedded Player can update a preview without exporting. | Proprietary Remotion License; explicitly **source-available, not OSI open source**. Free for individuals, organizations/teams up to 3 people, qualifying nonprofits and noncommercial evaluation. Larger automated products currently require $0.01 per successful render, $100/month minimum; previews do not count as renders. | Strong technical benchmark for parameterized videos. Its license conditions become an ongoing dependency of forks and self-hosters. Do not present it as an unrestricted open-source foundation. |
| **Revideo** | TypeScript scenes, dynamic inputs, embedded React Player and Node/headless-browser rendering. Documented workers and partial rendering. | MIT for its own source: commercial use, modification, distribution, sublicensing and sale are permitted with the copyright/license notice. Its bundled/transitive media dependencies need their own audit. | Closest permissively licensed candidate for the rendering/preview half. Verify present package behavior, browser support, text/media fidelity and operational reliability. It is not a ready-made Canva editor. |
| **Motion Canvas** | TypeScript generator animations plus an editor with live preview. Built-in frame export and an optional FFmpeg video exporter with audio support. | MIT for its own source, including commercial use under the notice condition. Automatically installed FFmpeg remains separately licensed. | Useful animation/authoring reference and possible engine candidate. A developer animation tool is a different starting point from a nontechnical drag-and-drop template editor plus batch service. Headless production ergonomics remain unverified. |
| **Fabric.js** | Object canvas with built-in manipulation, grouping, controls, text/shapes, image filters and JSON/SVG/image I/O; browser and Node entrypoints. | MIT; commercial use and redistribution permitted with notice. Node canvas/backend dependencies retain their own terms. | Evaluate for template authoring if editable text and object manipulation dominate. It does not supply spreadsheet mapping, video timing, a render queue or complete video export. |
| **Konva** | Interactive canvas scene graph, events, drag/transforms, animation and export; framework integrations; Node rendering with a separate canvas backend. | MIT; commercial use permitted with notice. Konva's README separately identifies **Polotno as a commercial editor SDK**; Konva's MIT license does not license Polotno. | Evaluate against Fabric for authoring and a shared scene graph. Inline text editing, template UX, timeline and batch jobs still need product implementation. |
| **FFmpeg** | Media filters, composition, encoding and audio muxing; can finish frames produced by another renderer. | Mostly LGPL-2.1-or-later; enabling GPL parts or combining GPL libraries changes the resulting FFmpeg build to GPL. `libx264`/`libx265` are examples in its license. `--enable-nonfree` can produce an **unredistributable binary**. | Likely media plumbing, not the visual editor. Choose and record an exact binary/build configuration before distributing an installer or Docker image. Codec patents are separate from the source license. |

Sources: Remotion [license][R1], [FAQ][R2], [pricing][R3], [parameterized videos][R4]; Revideo [repository][V1], [license][V2], [render API][V3], [Player][V4]; Motion Canvas [repository][M1], [license][M2], [rendering][M3], [FFmpeg exporter][M4]; Fabric [repository][F1], [license][F2]; Konva [repository][K1], [license][K2]; FFmpeg [license][FF1], [legal page][FF2], [filters][FF3].

## Licensing details that affect a public product

**Remotion:** Its FAQ expressly accepts a service that lets users customize the service's own Remotion templates. It expressly rejects a service that lets users upload arbitrary existing Remotion projects for rendering. Its main license disallows selling/renting/relicensing one's own derivative of Remotion. These conditions matter if future “bring your own template” functionality includes executable Remotion projects rather than the product's own template data. Do not assume opening our application code grants unrestricted rights to the underlying renderer. [R1, R2]

Current Remotion FAQ also counts combined project headcount in some client/agency/contractor arrangements. The 3-person shorthand therefore needs the actual eligibility terms, not just the number of direct employees. Eligible small teams can run commercial automation without a company license. Above that eligibility threshold, the automator price is in addition to compute/storage costs, and its $100 monthly minimum means 100 rendered riddle videos do not imply a $1 monthly bill. [R2, R3]

The **Remotion Editor Starter** has its own additional license, is separately purchased or included in Enterprise, and is not merely an MIT example application. Its documentation advertises timeline, canvas, font picker and uploads, but says the precise starter license is provided on its store/repository. That full separate license was not audited here; do not copy its source into a public repository based on the core's free-use eligibility. [R5]

**MIT engines and canvas libraries:** The licenses captured for Revideo, Motion Canvas, Fabric and Konva all permit commercial use and redistribution and require retaining the notice. They do not force this product to be paid or closed source. They also do not replace licenses for fonts, uploaded media, bundled binaries or dependencies. [V2, M2, F2, K2]

**Revideo's FFmpeg package** currently declares `@ffmpeg-installer/ffmpeg`, `@ffprobe-installer/ffprobe` and `fluent-ffmpeg` dependencies, despite its own package being MIT. Its API supports an explicit FFmpeg path. Audit the actual selected platform binary or supply a known build; “Revideo is MIT” alone is insufficient evidence that every bundled executable is MIT. [V3, V5]

**FFmpeg:** Commercial use is allowed under its applicable open-source license; “GPL” is not a ban on selling software. Obligations depend on the actual binary, modifications, linking and distribution. This research has not determined the license obligations of an as-yet-unbuilt integration. FFmpeg's own legal page offers a linking/distribution checklist. Keep build flags, corresponding source, notices and dependency manifests with releases. A hosted service and a distributable self-hosting image are different release artifacts to assess. [FF1, FF2]

## What these components do not decide

None of these sources establishes a complete spreadsheet-to-video product. The product still needs template/scene structure, binding a column to one or more properties, media ingestion, typed validation, text fit, time-dependent values, previewing rows, generating distinct files, progress, retries, cancellation and downloads.

Use a versioned **product-owned template model** for elements, geometry, style, timeline, media references and typed variable bindings. Bind a dataset row to that model before preview/render. Keep the dataset, template revision and render settings immutable for each job. This is an evaluation recommendation, not an implemented architecture. It reduces the chance of tying portable templates to one engine's executable project format and makes export adapters comparable.

The difficult integration is **preview/export parity**. A Fabric/Konva editor paired with a separate React or canvas renderer may disagree on font metrics, wrapping, effects, crop, rotation or animation. Prefer one rendering path where practical; otherwise, require frame comparisons before choosing two different graphics engines.

## Proposed next evaluation, after UX research

1. **One representative fixture:** a 1080×1920 riddle video with a question, four options, countdown, answer reveal, logo/background and audio. Include normal, long, multiline, empty and Unicode/emoji rows; add Hindi and right-to-left text if those markets are in scope. Add missing-image and unavailable-font cases.
2. **Candidate A: Revideo:** use a preauthored parameterized scene, embedded Player and headless export. Confirm current API and version from an actual installed release; current repository packages say `0.11.0`, while documentation still describes migrations from earlier APIs. Do not copy an obsolete tutorial blindly.
3. **Candidate B: independent canvas plus FFmpeg:** evaluate Fabric or Konva for direct object editing and render the same scene at deterministic timestamps into a known FFmpeg build. Compare one canvas library first, and try the other only if concrete text/editing limitations justify it. This is more custom work but tests whether the product can keep one portable template model and permissive graphics dependency.
4. **Optional reference: Remotion:** noncommercial evaluation is explicitly permitted. Compare parameterized preview/render behavior while keeping its code and licensing requirements clearly identified. Evaluate Motion Canvas further if the chosen UX benefits from richer authored vector animation or Revideo fails the fixture.
5. **Run 1, 10 and 100-row jobs:** record export wall time, videos/minute, peak RAM/CPU, output size, preview responsiveness and actual failure/retry behavior on the same hardware. Include simultaneous jobs, worker interruption, cancellation and recovery. Compare preview/export frames at start, mid-countdown and answer reveal.
6. **Choose only after the evidence:** pass/fail requirements should include independent files per row, visual fidelity, deterministic retries, bounded memory, offline/local self-hosting viability, asset/font portability and a redistributable license inventory. Compare infrastructure cost separately from any engine fee.

No performance, cost-per-video, accessibility, browser compatibility or “Canva parity” claim has been validated. Revideo's statement that rendering is usually faster than real time is a vendor claim, not a measurement for our workload. No full dependency or patent review was performed. These are explicit research gaps for the evaluation, not reasons to stop UX discovery.

## Evidence index

Captured HTTP responses, extracted text, URL/status manifests and GitHub metadata are in [`sources/rendering/`](sources/rendering/). Repository license/readme snapshots were fetched from default branches; the contemporaneous branch heads are recorded in [`commit-snapshots.json`](sources/rendering/commit-snapshots.json), not asserted to be immutable production versions.

| Project | Observed default-branch head | Evidence note |
| --- | --- | --- |
| Remotion | `fe9ffaa7b349fcf50c9480291afdcfb2964fb50c` | Repository head dated 2026-10-31; main license warns of a future 5.0 license change. |
| Revideo | `b5de67a009a55aa2768a1e178b0446b2479a0b4e` | Head dated 2026-07-15; not archived when checked; current owner `midrender`. |
| Motion Canvas | `7b91435c301d530351dcf5ebb91dd139c002e405` | Head dated 2026-07-02; not archived when checked. |
| Fabric | `eac083c13e4772cb872ea5d636aceb5b8b58cb8a` | Head dated 2026-10-30. |
| Konva | `57be2e3ab299cdb006e1723abe1703b855e26c22` | Head dated 2026-10-23. |
| FFmpeg | `11ef8d60d670b6908185a4780ad1a33b77783b0f` | Head dated 2026-10-31; actual deployed binary/configuration remains undecided. |

Default-branch recency alone does not establish project quality or maintenance risk. Release cadence, outstanding defects, dependency health and the team's ability to maintain a fork remain to assess.

[R1]: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
[R2]: https://www.remotion.dev/docs/license/faq
[R3]: https://www.remotion.dev/docs/license/pricing
[R4]: https://www.remotion.dev/docs/parameterized-rendering
[R5]: https://www.remotion.dev/docs/editor-starter
[V1]: https://github.com/midrender/revideo
[V2]: https://github.com/midrender/revideo/blob/main/LICENSE
[V3]: https://midrender.com/revideo/docs/api-reference/renderer/renderVideo
[V4]: https://midrender.com/revideo/docs/guide/building-webapps/using-the-player
[V5]: https://github.com/midrender/revideo/blob/main/packages/ffmpeg/package.json
[M1]: https://github.com/motion-canvas/motion-canvas
[M2]: https://github.com/motion-canvas/motion-canvas/blob/main/LICENSE
[M3]: https://motion-canvas.io/docs/rendering/
[M4]: https://motion-canvas.io/docs/rendering/video/
[F1]: https://github.com/fabricjs/fabric.js
[F2]: https://github.com/fabricjs/fabric.js/blob/master/LICENSE
[K1]: https://github.com/konvajs/konva
[K2]: https://github.com/konvajs/konva/blob/master/LICENSE
[FF1]: https://github.com/FFmpeg/FFmpeg/blob/master/LICENSE.md
[FF2]: https://ffmpeg.org/legal.html
[FF3]: https://ffmpeg.org/ffmpeg-filters.html
