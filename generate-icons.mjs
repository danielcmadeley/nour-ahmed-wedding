import { readFileSync } from "fs";
import sharp from "sharp";

const svgBuffer = readFileSync("./public/icon.svg");

// Generate 192x192 icon
await sharp(svgBuffer)
	.resize(192, 192)
	.png()
	.toFile("./public/pwa-192x192.png");

// Generate 512x512 icon
await sharp(svgBuffer)
	.resize(512, 512)
	.png()
	.toFile("./public/pwa-512x512.png");

// Generate favicon
await sharp(svgBuffer).resize(32, 32).png().toFile("./public/favicon.ico");

// Generate apple touch icon
await sharp(svgBuffer)
	.resize(180, 180)
	.png()
	.toFile("./public/apple-touch-icon.png");

console.log("✅ PWA icons generated successfully!");
