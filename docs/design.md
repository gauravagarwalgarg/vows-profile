# Design

## Visual Aesthetics
The Biodata Generator employs a premium, traditional yet modern aesthetic, aiming to replicate the feel of a printed parchment document while providing crisp, legible digital typography.

### Color Palette
- **Background:** Warm cream and parchment gradients (`#f6ebd8`, `#eedec6`).
- **Typography:** Deep rich browns (`#3e2412`, `#2e1c0d`) for high contrast and readability.
- **Accents:** Gold and earthy borders (`#c8963e`, `#936838`).
- **Icon backgrounds:** Darker gold-brown (`#b07840`) for better PDF rendering contrast.

### Typography
- **Headings:** `Cinzel`, `Marcellus`, and `Cinzel Decorative` for a classic, monumental feel.
- **Body:** `Lora`, `Georgia` for highly readable serif body text.

## Layout System
The main output relies on CSS Grid and Flexbox for strict A4 dimensional control.
- **Grid Setup:** `grid-template-columns: 1fr 1fr` is used extensively for symmetric layouts, such as the Profile Chips.
- **Overflow Protection:** Deep text truncation (`text-overflow: ellipsis`) and precise `mm` sizing ensures content does not break the strict physical bounds of the page.
- **Print Optimization:** Dedicated `@media print` rules strip away browser margins, force `-webkit-print-color-adjust: exact`, and disable shadows for a pristine physical export.

## Header Design
The header uses a two-column layout with `align-items: stretch`:
- **Left:** Candidate name (Cinzel 30pt bold) and subtitle in a bordered name tile.
- **Right:** Ganesha emblem (30mm circular wrapper) with auspicious mantra below.
- Both sides stretch to equal height, ensuring visual alignment.

## Dynamic Content Support

### Profile Links (4-slot 2×2 Grid)
Up to 4 profile links displayed in a tight 2×2 grid layout. Each chip shows platform name and ID with overflow ellipsis protection. Gap and padding are carefully tuned to prevent overflow:
- Grid gap: `1.8mm × 3mm`
- Chip font: `8.5pt` with `8pt` platform labels
- `overflow: hidden` container for safety

### Dynamic Siblings (up to 4)
Siblings use a repeatable card pattern identical to education and social links. Each sibling card has: relation select, name input, and two detail lines. The auto-fit system handles overflow when multiple siblings are added.

### Auto-Fit Font Scaling
When content exceeds the A4 page height (1122.5px at 96 DPI), the `autoFitContent()` function progressively reduces font size on card timeline bodies in 0.2pt increments, from 11.4pt down to a 9pt floor, until content fits within the page.

## Download Dropdown
The application header features a "Download" button with a dropdown menu offering four export formats:

| Format | Description |
|--------|-------------|
| **PDF** | High-resolution 300 DPI A4 document. Gold badge: "300 DPI" |
| **JPG** | Compressed raster image. Gold badge: "Image" |
| **PNG** | Lossless raster image. Gold badge: "Lossless" |
| **DOCX** | Microsoft Word document. Gold badge: "Word" |

The dropdown uses a dark-themed floating panel with hover effects, consistent with the app's luxury gold-on-dark aesthetic. Each option displays an emoji icon, format name, and a badge indicating the output type.

## PDF Rendering Fixes
To ensure PDF output matches the live preview pixel-for-pixel:
- **SVG fills:** All inline SVGs use explicit color values (`#fff7ec`, `#8c5324`) instead of `currentColor`, which html2canvas cannot resolve.
- **Border radius:** All `mm`-based `border-radius` values converted to `px` equivalents in CSS, with additional runtime normalization via `normalizeCloneForCapture()` before capture.
- **Clone normalization:** Before html2canvas capture, all computed styles are resolved to px values and SVG fills are explicitly set.

## Post-Download Support Page
After successful PDF download, users are directed to a `support.html` page that:
- Describes VowsProfile as ad-free and open source
- Shows the author's social handles (LinkedIn, GitHub)
- Provides a UPI payment link for optional donations

## Application UI Theme
The editor panel uses a dark luxury theme (`#12100e` background, `#c89455` gold accents) that contrasts with the warm parchment preview, creating a clear visual separation between "editing" and "output" modes.
