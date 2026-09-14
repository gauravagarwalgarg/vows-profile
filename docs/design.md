# Design

## Visual Aesthetics
The Biodata Generator employs a premium, traditional yet modern aesthetic, aiming to replicate the feel of a printed parchment document while providing crisp, legible digital typography.

### Color Palette
- **Background:** Warm cream and parchment gradients (`#f6ebd8`, `#eedec6`).
- **Typography:** Deep rich browns (`#3e2412`, `#2e1c0d`) for high contrast and readability.
- **Accents:** Gold and earthy borders (`#c8963e`, `#936838`).

### Typography
- **Headings:** `Cinzel`, `Marcellus`, and `Cinzel Decorative` for a classic, monumental feel.
- **Body:** `Lora`, `Georgia` for highly readable serif body text.

## Layout System
The main output relies on CSS Grid and Flexbox for strict A4 dimensional control.
- **Grid Setup:** `grid-template-columns: 1fr 1fr` is used extensively for symmetric layouts, such as the Profile Chips.
- **Overflow Protection:** Deep text truncation (`text-overflow: ellipsis`) and precise `mm` sizing ensures content does not break the strict physical bounds of the page.
- **Print Optimization:** Dedicated `@media print` rules strip away browser margins, force `-webkit-print-color-adjust: exact`, and disable shadows for a pristine physical export.
