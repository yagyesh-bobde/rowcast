# Studio prototype boundary

`StudioFrame` hosts the reviewed, self-contained Opus prototype at `public/prototype.html`.
The iframe isolates its complete-colour CSS tokens from the starter's shadcn HSL tokens.
Same-origin messages change light/dark appearance and Studio/Walkthrough mode without
reloading the editor or losing the current session.

`public/prototype.html` is the current source of truth for the interactive demo.
`public/prototype-theme.css` supplies standalone theme values. The component is a
temporary boundary for migrating the validated flow into typed React features.

Nothing in the demo encodes or delivers video. The current workbook is synthetic;
only the manifest CSV download produces a real file. A real workbook parser,
persisted project model, renderer and background queue are future implementation.
