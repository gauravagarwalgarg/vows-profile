# Architecture

## Tech Stack
- **HTML5:** Semantic structure for the generator app and the standalone template.
- **CSS3:** Vanilla CSS leveraging modern Grid and Flexbox features.
- **JavaScript (Vanilla):** No external frameworks are used. State management, DOM manipulation, and template literal rendering are all handled natively.

## Project Structure
- `index.html`: The main web application interface containing the input form and the preview split-pane.
- `app.js`: The core logic engine. Handles data binding from the form, persisting to `localStorage`, fetching example JSONs, and rendering the preview via template literals.
- `style.css`: Contains both the application UI styling and the precise A4 print styles for the biodata preview.
- `Biodata.html`: A standalone, production-ready export template that embeds its own copy of the rendering script and data, useful for serverless deployment or direct file sharing.
- `metadata/`: Directory containing placeholder images, ornaments (e.g., Ganesha icon), and the JSON data templates.

## Data Flow
1. **Input:** The user types into the form in `index.html`.
2. **State Updates:** Event listeners capture changes and update the central JavaScript data object.
3. **Persistence:** The data object is stringified and saved to `localStorage` to preserve progress across sessions.
4. **Rendering:** `app.js` runs a `renderPreview()` function that interpolates the data object into HTML strings and injects them into the preview container.
