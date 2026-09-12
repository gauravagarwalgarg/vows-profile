#!/usr/bin/env bash
# ==============================================================================
# VowsProfile - Automated Print-Ready A4 PDF Generator
# Compiles Biodata.html into an optimized, single-page A4 PDF using Headless Chrome
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT_FILE="${1:-$SCRIPT_DIR/Biodata.html}"
OUTPUT_FILE="${2:-$SCRIPT_DIR/Biodata.pdf}"

if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: Input HTML file '$INPUT_FILE' not found." >&2
  exit 1
fi

# Detect available Chrome/Chromium binary
BROWSER=""
for candidate in \
  "google-chrome" \
  "google-chrome-stable" \
  "chromium-browser" \
  "chromium" \
  "brave-browser" \
  "microsoft-edge" \
  "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"; do
  if command -v "$candidate" >/dev/null 2>&1 || [ -f "$candidate" ]; then
    BROWSER="$candidate"
    break
  fi
done

if [ -z "$BROWSER" ]; then
  echo "Error: No Chrome or Chromium browser executable found." >&2
  echo "Please install Google Chrome or Chromium (e.g. 'sudo apt install chromium-browser')." >&2
  exit 1
fi

echo "Using browser: $BROWSER"
echo "Rendering: $INPUT_FILE"
echo "Generating: $OUTPUT_FILE"

# Run headless browser to compile print-ready PDF
"$BROWSER" \
  --headless \
  --disable-gpu \
  --allow-file-access-from-files \
  --no-pdf-header-footer \
  --print-to-pdf="$OUTPUT_FILE" \
  "file://$INPUT_FILE" >/dev/null 2>&1

if [ -f "$OUTPUT_FILE" ]; then
  FILE_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
  echo "✓ PDF successfully generated ($FILE_SIZE)"
  
  if command -v pdfinfo >/dev/null 2>&1; then
    PAGES=$(pdfinfo "$OUTPUT_FILE" | awk '/^Pages:/ {print $2}')
    PAGE_SIZE=$(pdfinfo "$OUTPUT_FILE" | awk -F: '/^Page size:/ {print $2}' | xargs)
    echo "  - Page Count: $PAGES"
    echo "  - Dimensions: $PAGE_SIZE"
    if [ "$PAGES" -eq 1 ]; then
      echo "✓ Verified: Fits perfectly on 1 single page!"
    else
      echo "⚠ Warning: Document spans $PAGES pages. Please adjust content or font size."
    fi
  fi
else
  echo "Error: Failed to generate PDF output." >&2
  exit 1
fi
