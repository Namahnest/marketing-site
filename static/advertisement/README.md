# NamahNest advertisement

24-second, 1920 × 1080 landscape advertisement. Original electronic soundtrack, with readable on-screen copy, animated kit illustrations, and the website address. The MP4 uses H.264 at 30 fps and is prepared for streaming.

- `namahnest-ad.mp4`: finished video.
- `index.html`: preview and browser export controls, served at `/advertisement/` by Hugo.
- `animation.js`: editable canvas motion graphics; scene boundaries are 0, 5, 11, 17, and 24 seconds.
- `frame-*.png`: storyboard stills.

To render again from the repository root, install the optional renderer dependency with `npm.cmd install --no-save --package-lock=false ffmpeg-static`, then run `node scripts/render-ad.mjs`. Chrome is required; set `CHROME_PATH` if it is installed elsewhere. The renderer encodes 720 exact animation frames with the WAV soundtrack, checks video dimensions and duration, and regenerates the stills. The preview export button downloads this rendered MP4; rerun the renderer after editing the animation.

Copy and product names are based on the local website content. Product illustrations are stylized previews. No voice-over, prices, or measured performance scores are included. The original 120 BPM soundtrack uses synthesized sounds only; see MUSIC-LICENSE.txt for reuse permissions. Regenerate it with `node scripts/create-ad-music.mjs`. Browser preview and export include this music.
