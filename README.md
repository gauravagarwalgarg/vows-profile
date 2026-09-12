# VowsProfile

[![CI](https://github.com/gauravagarwalgarg/vows-profile/actions/workflows/ci.yml/badge.svg)](https://github.com/gauravagarwalgarg/vows-profile/actions/workflows/ci.yml) [![Docs](https://img.shields.io/badge/docs-live-blue?logo=github)](https://gauravagarwalgarg.github.io/vows-profile/) ![HTML/CSS/JS](https://img.shields.io/badge/HTML--CSS--JS-orange?logo=html5&logoColor=white) [![License](https://img.shields.io/github/license/gauravagarwalgarg/vows-profile)](https://github.com/gauravagarwalgarg/vows-profile/blob/main/LICENSE)

> 📖 **Documentation**: [https://gauravagarwalgarg.github.io/vows-profile/](https://gauravagarwalgarg.github.io/vows-profile/)  
> 📦 **Repository**: [GitHub](https://github.com/gauravagarwalgarg/vows-profile)

Classic, royal A4 matrimony biodata generator designed for elegance, single-page print perfection, and instant PDF rendering. Edit `metadata/details.json`, preview in your browser, or compile directly to a print-ready A4 PDF with one command.

---

## Highlights & Features

- **Strict Single-Page A4 Fit**: Calibrated geometry guaranteeing exact 1-page output (`Pages: 1`) on A4 paper (210mm × 297mm).
- **Royal Golden Aesthetic**: Warm parchment gradient background, radiant double-line gold border frame (`border.svg`), ivory card bevels, and Lord Ganesha header emblem with Sanskrit mantra.
- **Balanced 2-Column Wireframe**:
  - **Left Column**: 3 framed portrait photos with golden bezels and soft elevation.
  - **Right Column**: 2 harmoniously weighted cards:
    - **Card 1 (Personal & Professional Details)**: Gotra, DOB/POB, Education, Profession with enlarged Google Maps pin, Profiles & Search IDs (Jeevansathi, Shaadi, and LinkedIn with active hyperlink), Residence & Native Place, and Contact row with generous breathing room (zero spillover).
    - **Card 2 (Family)**: Parents (female-first hierarchy), Elder Brother (corporate designation & degree), Paternal Family (Grandparents, Bua, Chacha), and Maternal Family (3 Mama Families, then 3 Mausi Families).
- **Linear Dotted Family Tree**: Unified, continuous vertical timeline connecting all family generations with centered circular gold badges.
- **Optimized for Adobe Reader**: Lightweight PDF (~1.25 MB, down from 8+ MB) using high-performance 360 PPI JPEG assets, eliminating lag and blank boxes.
- **Privacy First**: All personal photos (`*.png`, `*.jpg`, `*.jpeg`), personal data (`metadata/details.json`), and generated PDFs (`*.pdf`) are automatically gitignored. Only example templates and core design assets are committed.

---

## Project Structure

```
VowsProfile/
├── Biodata.html                # Main matrimony profile page (double-click to preview)
├── style.css                   # Print-optimized stylesheet (exact A4 dimensions, typography)
├── generate_pdf.sh             # Automated script to compile single-page A4 PDF
├── metadata/
│   ├── details.example.json    # TEMPLATE (commit safe, copy to details.json)
│   ├── details.json            # YOUR PRIVATE DATA (gitignored, never committed)
│   ├── Ganesh.png              # Header deity emblem
│   └── border.svg              # Decorative double-line gold border
└── README.md
```

---

## Quick Start (Setup & Preview)

### 1. Configure Your Details
Copy the example template and fill in your information:
```bash
cp metadata/details.example.json metadata/details.json
```
Edit `metadata/details.json` with your real personal, educational, professional, and family details.

### 2. Add Your Photos
Place your 3 portrait photos into `metadata/`:
- `metadata/MyPhoto.jpg` (Primary profile portrait)
- `metadata/JodhpuriSuit3.jpg` (Second portrait / traditional wear)
- `metadata/YellowKurta.jpg` (Third portrait / casual or celebratory wear)

> **Tip**: High-quality JPEGs (around 600×900px to 800×1200px) are recommended for optimal sharpness and lightweight PDF file sizes.

### 3. Preview in Browser
Because modern browsers restrict local `fetch()` requests on `file://` URLs, serve locally using Python or Node:
```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .
```
Then open `http://localhost:8080/Biodata.html` in your browser.

---

## Generating the Print-Ready PDF

### Option A: Using the Automated Script (Recommended)

Run the included generation script:
```bash
./generate_pdf.sh
```
The script automatically:
1. Detects your installed Chrome / Chromium browser.
2. Runs headless print compilation with background graphics enabled and default headers/footers removed.
3. Outputs `Biodata.pdf` (~1.25 MB).
4. Verifies page count (`Pages: 1`) and A4 dimensions using `pdfinfo`.

You can also pass custom input or output paths:
```bash
./generate_pdf.sh Biodata.html MyCustomBiodata.pdf
```

### Option B: Manual Print via Browser

1. Open `http://localhost:8080/Biodata.html` in Chrome or Edge.
2. Press `Ctrl + P` (or `Cmd + P` on Mac).
3. Set the following options:
   - **Destination**: Save as PDF
   - **Layout**: Portrait
   - **Paper size**: A4
   - **Margins**: None
   - **Options**: Check **Background graphics**
4. Click **Save**.

---

## Git & Privacy

This repository is preconfigured to protect your private information:
- `metadata/details.json` is excluded from git.
- All personal photos (`*.jpg`, `*.jpeg`, `*.png`, `*.webp` except `Ganesh.png`) are excluded.
- Generated PDFs (`*.pdf`) are excluded.
- Only `metadata/details.example.json` and essential design assets are tracked.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
