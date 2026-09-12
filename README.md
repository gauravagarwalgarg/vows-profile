# VowsProfile

[![Deploy to GitHub Pages](https://github.com/gauravagarwalgarg/vows-profile/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/gauravagarwalgarg/vows-profile/actions/workflows/deploy-pages.yml) [![Live App](https://img.shields.io/badge/Live%20App-GitHub%20Pages-gold?logo=github)](https://gauravagarwalgarg.github.io/vows-profile/) ![Zero Backend](https://img.shields.io/badge/Architecture-100%25%20Client--Side-green) ![License](https://img.shields.io/github/license/gauravagarwalgarg/vows-profile)

> 💍 **Live Generator**: [https://gauravagarwalgarg.github.io/vows-profile/](https://gauravagarwalgarg.github.io/vows-profile/)  
> 📦 **Repository**: [GitHub](https://github.com/gauravagarwalgarg/vows-profile)

**VowsProfile** is a modern, 100% client-side matrimonial biodata generator with a real-time reactive split-screen layout and high-resolution (300 DPI) client-side A4 PDF export. It is hosted purely as a static website on GitHub Pages with zero active backend or external servers — all text and images remain strictly private on your device.

---

## ✨ Features & Architecture

### 1. Responsive Split-Screen Workspace
- **Left Panel (Editor Form)**: Categorized accordion sections covering Header, 3 Photo slots, Personal & Kundali, Education & Career, Profiles, Residence, Contact, and Family.
- **Right Panel (Live A4 Preview)**: Real-time reactive preview rendering the royal gold parchment layout with auto-scaling to fit any display without distortion.
- **Interactive Zoom Toolbar**: Zoom in (`+`), Zoom out (`-`), Fit to screen (`Fit`), or inspect at 100% print size.
- **Mobile Friendly**: Floating segmented view switcher toggling between **Edit Form** and **Live Preview** on smaller screens.

### 2. Comprehensive & Dynamic Indian Matrimonial Details
- **Header & Auspicious Deity**: Customizable mantra (`|| श्री गणेशाय नमः ||`, Jain, Krishna, Shiva presets or custom), candidate name, and headline subtitle.
- **Personal & Kundali**: Gotra, Height (ft/in selector), Date of Birth, Time of Birth, Place of Birth, and optional Manglik status (`Non-Manglik`, `Manglik`, `Anshik Manglik`).
- **3 Profile Photos**: Dedicated slots for Primary Portrait, Traditional/Full-length, and Festive Kurta. Images are automatically cropped and framed with `object-fit: cover`.
- **Education & Career**: Degree, stream/specialization, institution, job designation, company, work mode (Remote/Hybrid), office address, and Google Maps pin link.
- **Matrimonial & Social Profiles**: Toggleable chips for Jeevansathi ID, Shaadi.com ID, and LinkedIn profile with external link indicators.
- **Native & Current Residence**: Native place (Village/Town, Dist, State), residence address, and Google Maps pin link.
- **Contact Numbers**: Primary & secondary phone numbers.
- **Super-Dynamic Family Tree**:
  - **Parents**: Mother & Father (Honorifics e.g. `Smt.` / `Late Smt.`, `Shri` / `Late Shri`, Name).
  - **Siblings**: Toggleable section with dynamic `+ Add Sibling` support for multiple brothers/sisters (relation, name, career, education).
  - **Paternal Family (Dadihal)**: Grandmother & Grandfather, plus structured dynamic inputs for **Bua Families** (count + cities) and **Chacha Families** (count + cities).
  - **Maternal Family (Nanihal)**: Grandmother & Grandfather, plus structured dynamic inputs for **Mama Families** (Mama first!) and **Mausi Families** (Mausi second!).
  - **Conditional Hiding**: Any field left blank or unchecked is automatically omitted from the live preview without leaving dangling separators, empty bullets, or broken icons.

### 3. Local-Only Image Processing
- Photos are processed in the browser using `URL.createObjectURL()` for 0ms instant preview and converted locally into base64 Data URLs via `FileReader`.
- **Zero Server Uploads**: Your photos never leave your device.

### 4. High-Resolution (300 DPI) Client-Side PDF Generation
- Built-in `html2pdf.js` export engine targeting strictly the A4 biodata container.
- Renders background parchment gradients, SVG decorative border (`border.svg`), and crisp typography at 3x canvas scale (~300 DPI print quality).
- Automatically names the file: `<CandidateName>_Biodata.pdf`.

---

## 📁 Project Structure

```
VowsProfile/
├── index.html                  # Main dynamic split-screen biodata generator application
├── app.css                     # Modern luxury dark-gold generator UI stylesheet
├── app.js                      # Reactive state controller, photo handler, and PDF generator
├── style.css                   # Exact A4 print stylesheet for the matrimonial biodata
├── Biodata.html                # Standalone print-ready matrimony profile page
├── generate_pdf.sh             # Local CLI script to compile PDF via headless Chromium
├── vendor/
│   └── html2pdf.bundle.min.js  # Vendored client-side PDF export engine (offline capable)
├── metadata/
│   ├── details.example.json    # Complete reference schema and sample dataset
│   ├── details.json            # Local private data (gitignored)
│   ├── Ganesh.png              # Header deity emblem
│   └── border.svg              # Decorative double-line gold border frame
└── .github/workflows/
    └── deploy-pages.yml        # GitHub Actions workflow for zero-build GitHub Pages deployment
```

---

## 🚀 Running Locally

You can run this project locally with any static web server:

```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node.js / npx
npx serve .
```

Open `http://localhost:8080` in your web browser.

---

## 🌐 Deploying to GitHub Pages

This project is configured for automated deployment via GitHub Actions:

1. Push your repository to GitHub on branch `main`.
2. Go to **Repository Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy-pages.yml` will automatically build and publish your static site.

---

## 📄 Standalone CLI PDF Compilation

If you prefer compiling the static `Biodata.html` locally via headless Chromium:

```bash
chmod +x generate_pdf.sh
./generate_pdf.sh
```

This generates `Biodata.pdf` calibrated to fit on 1 single A4 page.

---

## 🔒 Privacy Guarantee

- `.gitignore` is pre-configured to exclude all personal photos (`*.png`, `*.jpg`, `*.jpeg`), generated PDFs (`*.pdf`), and personal data (`metadata/details.json`).
- When using the web generator, all image uploads and data modifications are handled strictly inside your browser's local sandbox memory.
