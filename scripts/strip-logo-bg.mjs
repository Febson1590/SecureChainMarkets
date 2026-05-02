import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Make near-white pixels in the brand PNGs transparent so the logos
 * blend onto the dark navy chrome without a white box around them.
 * Tolerance is generous to handle JPEG-style anti-aliased edges.
 */
const TOLERANCE = 18;
const FEATHER   = 235;

const files = [
  "public/assets/logos/voratetrade-logo.png",
  "public/assets/logos/voratetrade-icon.png",
];

for (const rel of files) {
  const full = path.resolve(rel);
  const orig = await fs.readFile(full);
  const { data, info } = await sharp(orig)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  const px  = info.width * info.height;

  for (let i = 0; i < px; i++) {
    const o = i * 4;
    const r = out[o], g = out[o + 1], b = out[o + 2];
    if (r >= 255 - TOLERANCE && g >= 255 - TOLERANCE && b >= 255 - TOLERANCE) {
      out[o + 3] = 0;
    } else if (r >= FEATHER && g >= FEATHER && b >= FEATHER) {
      const m = Math.min(r, g, b);
      const fade = Math.round(((m - FEATHER) / (255 - FEATHER - TOLERANCE)) * 255);
      out[o + 3] = Math.max(0, 255 - fade);
    }
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(full);

  console.log(`✔ ${rel}  ${info.width}×${info.height}`);
}
