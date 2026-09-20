# Requirements

## Functional Requirements
1. **Form Input:** Users must be able to input personal, educational, professional, and family details.
2. **Photo Uploads:** Users must be able to upload up to three photos.
3. **Live Preview:** The biodata preview must update in real-time as the user types.
4. **Data Persistence:** The application must automatically save progress to the browser's local storage.
5. **Import/Export:** Users must be able to export their data as a JSON file and import JSON files.
6. **Example Template:** The application must provide a one-click way to load an example template.
7. **Multi-Format Export:** The application must support downloading the biodata in the following formats:
   - **PDF** — High-resolution (300 DPI) A4 document via `html2pdf.js`.
   - **JPG** — Compressed raster image via `html2canvas`.
   - **PNG** — Lossless raster image via `html2canvas`.
   - **DOCX** — Microsoft Word document via `html-docx-js` (content-accurate, simplified styling).
8. **Print to PDF:** The application must also support standard browser "Print to PDF" functionality without UI elements interfering.

## Non-Functional Requirements
1. **A4 Precision:** The printed output must strictly conform to A4 dimensions (210mm × 297mm).
2. **Client-Side Only:** All processing, rendering, and data storage must happen entirely in the client's browser for maximum privacy.
3. **Zero Build Tooling:** The application must work without any build step, transpiler, or `node_modules`. Plain HTML/CSS/JS only.
4. **Responsive UI:** The editor form and workspace must be fully responsive, while the preview scales appropriately.
