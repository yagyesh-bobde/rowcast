# Rowcast

An open-source spreadsheet-to-video studio, starting with a riddle-video workflow.
**One spreadsheet row becomes one complete multi-scene video.**

## Current version

This is an interactive product prototype, not a production video renderer.

- **Studio** (`/`): template scenes and layers, timeline, data connections, row previews and corrections, simulated batch generation, failed-job retry and delivery review.
- **Guided walkthrough** (`/walkthrough`): the eight-step journey with design notes and source references.
- **Real download**: a generated manifest CSV. Video encoding, MP4/ZIP downloads, worker failures and the sample import are simulated. The sample sheet download is a real synthetic XLSX fixture.
- Theme and navigation changes preserve the current editor session. Reloading resets the prototype; projects are not yet saved.

## Development

Node 22.18+ and pnpm 9.15.9:

```sh
npx --yes pnpm@9.15.9 install --frozen-lockfile
npx --yes pnpm@9.15.9 dev
```

```sh
npx --yes pnpm@9.15.9 lint
npx --yes pnpm@9.15.9 test
npx --yes pnpm@9.15.9 build
```

## Structure

Generated from [Yagyesh's Vite/TypeScript/Tailwind/shadcn starter](https://github.com/yagyesh-bobde/vite-ts-tailwind-shadcn-starter), preserving its component, hook and utility structure.

```text
src/
  components/           Application header and starter shadcn/ui components
  features/studio/      Prototype integration boundary
  hooks/                Theme preference
  lib/                  Shared starter utilities
public/
  prototype.html        Reviewed interactive studio and walkthrough
  prototype-theme.css   Complete-colour light/dark tokens for the studio
  samples/              Synthetic CSV/XLSX examples
  favicon.svg
docs/                   Workflow, UI rationale and rendering research
tests/                  Prototype integration checks
vercel.json             Vite build and walkthrough routing
```

The prototype is embedded in an iframe to isolate its CSS tokens while the validated flow is migrated into typed React components. See [the studio boundary notes](src/features/studio/README.md).

## UI references

[OpenFilm Studio](https://github.com/openfilm/openfilm) is the primary visual reference: docked panes, a central viewer, contextual inspector and bottom timeline. Canva Bulk Create, Creatomate, Figma, Airtable and GitHub job retries informed the interactions. No OpenFilm code or branding is included. The design walkthrough was created with Opus.

- [UI direction and references](docs/ui-direction.md)
- [Product workflow](docs/product-workflow.md)
- [Rendering research](docs/rendering-options.md)

## Vercel

Import this GitHub repository into Vercel using the **Vite** preset. The committed configuration installs with pnpm, builds `dist`, and supports direct visits to `/walkthrough`. No environment variables are required for this prototype. Git pushes deploy automatically when the Vercel GitHub integration is connected.

## Next implementation

Real CSV/XLSX parsing, a persisted project/template schema, text and media binding, deterministic rendering, and a batch job queue. Research notes describe proposed features and do not imply feature parity with Canva.

## License

[MIT](LICENSE).
