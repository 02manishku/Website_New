#!/usr/bin/env bash
# Re-encode all videos to web-optimized H.264 + WebM(VP9).
# - Max width 1920, preserve aspect ratio, even dims.
# - CRF 23 x264 slow preset = visually identical quality, ~1/4 the bitrate.
# - Strip audio (background loops).
# - +faststart so playback begins before the file is fully downloaded.
set -euo pipefail

FFMPEG="/c/Users/user/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg.exe"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/videos"
ORIG="$ROOT/public/_originals/videos"
mkdir -p "$ORIG"

shopt -s nullglob
for f in "$SRC"/*.mp4; do
  name="$(basename "$f" .mp4)"
  # backup once
  [ -f "$ORIG/$name.mp4" ] || cp "$f" "$ORIG/$name.mp4"

  tmp_mp4="$SRC/$name.new.mp4"
  tmp_webm="$SRC/$name.new.webm"

  echo ">>> $name (mp4)"
  "$FFMPEG" -y -hide_banner -loglevel error -i "$ORIG/$name.mp4" \
    -vf "scale='min(1920,iw)':-2" \
    -c:v libx264 -crf 23 -preset slow -profile:v high -pix_fmt yuv420p \
    -an -movflags +faststart \
    "$tmp_mp4"
  mv -f "$tmp_mp4" "$f"

  echo ">>> $name (webm/vp9)"
  "$FFMPEG" -y -hide_banner -loglevel error -i "$ORIG/$name.mp4" \
    -vf "scale='min(1920,iw)':-2" \
    -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 \
    -an \
    "$tmp_webm"
  mv -f "$tmp_webm" "$SRC/$name.webm"

  orig_kb=$(stat -c%s "$ORIG/$name.mp4")
  new_mp4=$(stat -c%s "$f")
  new_webm=$(stat -c%s "$SRC/$name.webm")
  printf "  orig %.1fMB -> mp4 %.2fMB, webm %.2fMB\n" \
    "$(echo "$orig_kb/1048576" | bc -l)" \
    "$(echo "$new_mp4/1048576" | bc -l)" \
    "$(echo "$new_webm/1048576" | bc -l)"
done

echo ""
echo "Final sizes:"
du -sh "$ORIG" "$SRC"
