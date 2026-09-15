# Architecture

## Tech Stack
- **HTML5:** Semantic structure for the generator app and the standalone template.
- **CSS3:** Vanilla CSS leveraging modern Grid and Flexbox features.
- **JavaScript (Vanilla):** No external frameworks. State management, DOM manipulation, and template literal rendering are all handled natively.

## Zero Build Philosophy
This project intentionally avoids React, Vite, Webpack, or any build tooling. The rationale:
- **Instant deployability** — Copy the files and it works. No `node_modules`, no transpiler.
- **Simplicity** — ~2000 lines of `app.js` handles everything a framework would provide (reactive preview, state, localStorage, form binding).
- **Print CSS precision** — The pixel-perfect A4 `mm`-based CSS would be risky to port through a build pipeline.

## Project Structure
```
├── index.html              # Main web application (editor + preview)
├── app.js                  # Core logic (state, rendering, export)
├── app.css                 # Application UI styles (dark theme)
├── style.css               # A4 biodata print styles (parchment theme)
├── Biodata.html            # Standalone export template
├── metadata/               # Images, icons, and JSON templates
│   ├── 1.png, 2.png, 3.jpg # Candidate photos
│   ├── Ganesh.png           # Deity emblem
│   ├── border.svg           # Ornamental border
│   └── details.example.json # Example data template
├── vendor/                 # Third-party libraries (no npm)
│   ├── html2pdf.bundle.min.js  # PDF export engine
│   ├── html2canvas.min.js      # Image (JPG/PNG) export engine
│   └── html-docx.js            # DOCX export engine
├── docs/                   # MkDocs documentation
└── mkdocs.yml              # MkDocs configuration
```

## Data Flow
1. **Input:** The user types into the form in `index.html`.
2. **State Updates:** Event listeners capture changes and update the central JavaScript data object.
3. **Persistence:** The data object is stringified and saved to `localStorage` to preserve progress across sessions.
4. **Rendering:** `app.js` runs a `renderBiodataPreview()` function that interpolates the data object into HTML strings and injects them into the preview container.

## Export Pipeline
The `exportAs(format)` function dispatches to format-specific handlers:

| Format | Library | Method |
|--------|---------|--------|
| PDF | `html2pdf.js` | Clones preview DOM → `html2canvas` renders at 3× scale → `jsPDF` writes A4 PDF |
| JPG | `html2canvas` | Clones preview DOM → renders to canvas → `canvas.toBlob('image/jpeg')` |
| PNG | `html2canvas` | Clones preview DOM → renders to canvas → `canvas.toBlob('image/png')` |
| DOCX | `html-docx-js` | Extracts preview `.innerHTML` → wraps with inline Word-compatible CSS → `htmlDocx.asBlob()` |

All exports clone the preview element into a hidden sandbox at native A4 dimensions (no CSS `transform: scale()`) to ensure accurate rendering regardless of the current zoom level.
