#!/usr/bin/env bash
#
# Regenerates public/images/og-default.png from scripts/og/og-template.html.
#
# The template is deliberately kept OUT of public/ so it is never published.
# Requires a Chrome/Chromium binary; override the path with CHROME=/path/to/chrome.
#
#   ./scripts/og/generate.sh
#
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/../../public/images/og-default.png"

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at: $CHROME" >&2
  echo "Set CHROME=/path/to/chrome and re-run." >&2
  exit 1
fi

# Social platforms expect 1200x630 (1.91:1). Keep these in sync with
# og:image:width / og:image:height in seo/head.ts.
"$CHROME" \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --screenshot="$OUT" \
  "file://$HERE/og-template.html"

echo "Wrote $OUT"