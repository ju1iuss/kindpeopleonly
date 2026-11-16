#!/bin/sh
# Rendert alle Boards aus brand/src/*.html nach brand/boards/*.png (3200 × 2000).
# Aufruf aus dem Repo: sh brand/src/render.sh
cd "$(dirname "$0")" || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for f in [0-9]*.html; do
  out="../boards/${f%.html}.png"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --force-device-scale-factor=2 --window-size=1600,1000 --virtual-time-budget=3000 \
    --screenshot="$out" "file://$PWD/$f" >/dev/null 2>&1
  echo "$out"
done
