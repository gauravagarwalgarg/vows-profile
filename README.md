# VowsProfile

Classic A4 matrimony biodata generator. Edit `metadata/details.json`, open in browser, print to PDF.

---

## How It Works

```
metadata/details.json  →  Biodata.html  →  Browser  →  Print to PDF
```

**Just double-click `Biodata.html`** -- it works immediately.

### First Time Setup

1. Copy the example file:
   ```bash
   cp metadata/details.example.json metadata/details.json
   ```
2. Edit `metadata/details.json` with your actual details
3. Place your photo as `metadata/MyPhoto.png`
4. Open `Biodata.html` in browser
5. Print to PDF (Ctrl+P → Save as PDF → A4, no margins, background graphics ON)

### Updating Content

Edit `metadata/details.json` → serve locally for live preview:
```bash
python3 -m http.server 8080
# Open http://localhost:8080/Biodata.html
```

> **Note**: `details.json` and `MyPhoto.png` are gitignored (personal data). Only `details.example.json` is committed.

---

## Structure

```
VowsProfile/
├── Biodata.html                # THE file (double-click to open)
├── style.css                   # Layout & styling (A4, warm theme, border)
├── metadata/
│   ├── details.example.json    # TEMPLATE copy to details.json and fill in
│   ├── details.json            # YOUR DATA (gitignored, never committed)
│   ├── MyPhoto.png             # YOUR PHOTO (gitignored)
│   ├── Ganesh.png              # Header deity image
│   └── border.svg              # Decorative border
└── README.md
```

---

## Editing Your Details

Open `metadata/details.json` and update:

| Section | Fields |
|---------|--------|
| `header` | name, subtitle, photo path, ganesh image |
| `personal` | name, gotra, DOB, time, place, height |
| `education` | degree, field, institution (array) |
| `professional` | designation, company, location, address |
| `profiles` | matrimony/LinkedIn URLs (array) |
| `family` | parents, grandparents, siblings |
| `paternalFamily` | uncles with details (array) |
| `maternalFamily` | maternal uncles with details (array) |
| `businessFirms` | firm names, addresses, map links (array) |
| `contact` | phone number |

---

## Serving Locally

The JSON fetch requires a local server (browsers block `file://` fetch):

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# Then open http://localhost:8080
```

---

## Exporting to PDF

1. Open in Chrome/Edge
2. Press `Ctrl+P` (or `Cmd+P` on Mac)
3. Settings:
   - Destination: Save as PDF
   - Layout: Portrait
   - Paper size: A4
   - Margins: None
   - Background graphics: ✅ Enabled
4. Save

---

## Design Features

- Classic gold/paper warm theme
- Triple decorative border frame
- Octagonal photo frame with gold gradient
- Timeline rail with icon markers
- Two-column layout (personal left, family right)
- Print-optimized (exact A4 dimensions)
- Ganesh header with Sanskrit mantra
- Map links for addresses
- Responsive to content length

---

## Photo Requirements

- Place as `metadata/MyPhoto.png` (or `.jpg`, `.webp`)
- Recommended: Portrait orientation, 600x800px minimum
- The template will warn if no photo is found

---

## Customization

- **Colors**: Edit CSS variables in `style.css` (`:root` section)
- **Border**: Modify `.border-frame` in CSS
- **Font**: Change `font-family` in CSS body rule
- **Layout**: Adjust grid columns in `.columns` class

---

## Legacy Version

`Biodata.html` is the original standalone version (no JS, no JSON). It works by opening directly in a browser but requires editing HTML to change content.
