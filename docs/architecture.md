# Architecture

## Tech Stack
- **HTML5:** Semantic structure for the generator app and the standalone template.
- **CSS3:** Vanilla CSS leveraging modern Grid and Flexbox features.
- **JavaScript (Vanilla):** No external frameworks. State management, DOM manipulation, and template literal rendering are all handled natively.

## Zero Build Philosophy
This project intentionally avoids React, Vite, Webpack, or any build tooling. The rationale:
- **Instant deployability** — Copy the files and it works. No `node_modules`, no transpiler.
- **Simplicity** — ~2100 lines of `app.js` handles everything a framework would provide (reactive preview, state, localStorage, form binding).
- **Print CSS precision** — The pixel-perfect A4 `mm`-based CSS would be risky to port through a build pipeline.

## Project Structure
```
├── index.html              # Main web application (editor + preview)
├── support.html            # Post-download support/donation page
├── app.js                  # Core logic (state, rendering, export)
├── app.css                 # Application UI styles (dark theme)
├── style.css               # A4 biodata print styles (parchment theme)
├── Biodata.html            # Standalone export template
├── metadata/               # Images, icons, and JSON templates
│   ├── 1.png, 2.png, 3.jpg # Candidate photos
│   ├── Ganesh.png           # Deity emblem
│   ├── border.svg           # Ornamental border
│   └── details.example.json # Example data template (4 links, 2 siblings)
├── vendor/                 # Third-party libraries (no npm)
│   ├── html2pdf.bundle.min.js  # PDF export engine
│   ├── html2canvas.min.js      # Image (JPG/PNG) export engine
│   └── html-docx.js            # DOCX export engine
├── tests/                  # Test scripts
├── docs/                   # MkDocs documentation
├── mkdocs.yml              # MkDocs configuration
└── .github/workflows/      # CI/CD
    └── deploy.yml           # Consolidated build & deploy workflow
```

## Data Flow
1. **Input:** The user types into the form in `index.html`.
2. **State Updates:** Event listeners capture changes and update the central JavaScript data object.
3. **Persistence:** The data object is stringified and saved to `localStorage` to preserve progress across sessions.
4. **Rendering:** `app.js` runs a `renderBiodataPreview()` function that interpolates the data object into HTML strings and injects them into the preview container.
5. **Auto-Fit:** After rendering, `autoFitContent()` measures content height and progressively reduces font size (11.4pt → 9pt floor) until content fits within the A4 page boundary.

## Dynamic Form Systems
The app uses a repeatable card pattern for dynamic entries. Each system follows the same architecture:

| System | Max | Functions |
|--------|-----|-----------|
| Education | 3 | `renderEducationForm()`, `addEducationEntry()`, `removeEducationEntry()` |
| Social Links | 4 | `renderSocialLinksForm()`, `addSocialLink()`, `removeSocialLink()` |
| Siblings | 4 | `renderSiblingsForm()`, `addSiblingEntry()`, `removeSiblingEntry()` |
| Phone Numbers | 3 | `renderPhoneForm()`, `addPhoneEntry()`, `removePhoneEntry()` |

Each system:
1. Creates DOM cards dynamically with `data-field` attributes for binding.
2. Uses `data-*-index` attributes on cards for identification.
3. Delegates remove button clicks through a single event listener.
4. Updates the `appData` state object via `syncStateFromForm()`.

## Export Pipeline
The `exportAs(format)` function dispatches to format-specific handlers:

| Format | Library | Method |
|--------|---------|--------|
| PDF | `html2pdf.js` | Clones preview DOM → normalizes clone → `html2canvas` renders at 3× scale → `jsPDF` writes A4 PDF |
| JPG | `html2canvas` | Clones preview DOM → renders to canvas → `canvas.toBlob('image/jpeg')` |
| PNG | `html2canvas` | Clones preview DOM → renders to canvas → `canvas.toBlob('image/png')` |
| DOCX | `html-docx-js` | Extracts preview `.innerHTML` → wraps with inline Word-compatible CSS → `htmlDocx.asBlob()` |

All exports clone the preview element into a hidden sandbox at native A4 dimensions (no CSS `transform: scale()`) to ensure accurate rendering regardless of the current zoom level.

### Clone Normalization (`normalizeCloneForCapture`)
Before html2canvas capture, the cloned element undergoes normalization:
1. **Border-radius resolution:** All computed `border-radius` values are re-applied as explicit `px` values, preventing html2canvas from misinterpreting `mm`-based CSS units.
2. **SVG fill resolution:** Any `fill="currentColor"` attributes in SVGs are replaced with the computed parent text color, ensuring icons render correctly in the rasterized output.

### Post-Download Flow
After successful PDF download, the app opens `support.html` in a new tab after an 800ms delay. This page describes the project's ad-free nature and provides optional donation links.

## CI/CD
A single GitHub Actions workflow (`deploy.yml`) handles deployment:
1. Builds MkDocs documentation to `_site/docs/`
2. Copies the generator app files to `_site/` root
3. Deploys via `actions/deploy-pages@v4`

This ensures both the app (at `/`) and docs (at `/docs/`) are served from the same GitHub Pages deployment.
