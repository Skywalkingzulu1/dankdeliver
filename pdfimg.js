const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');
const pdfjslib = require('pdfjs-dist/legacy/build/pdf.mjs');
const { PNG } = (() => { try { return require('pngjs'); } catch { return null; } })();

async function renderPageToPng(filePath, pageNum, scale) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjslib.getDocument({ data, useSystemFonts: true }).promise;
  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toBuffer('image/png');
}

// minimal canvas shim using node-canvas if present, else pngjs fallback
let createCanvas;
try {
  const { createCanvas: cc } = require('canvas');
  createCanvas = cc;
} catch {
  createCanvas = null;
}

module.exports = { renderPageToPng, hasCanvas: !!createCanvas };
