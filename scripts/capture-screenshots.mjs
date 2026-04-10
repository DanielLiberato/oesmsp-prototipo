#!/usr/bin/env node

import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
const outputDir = join(projectRoot, "screenshots");
const vendoredLibDir = join(projectRoot, ".vendor", "system-libs", "usr", "lib", "x86_64-linux-gnu");

const VIEWPORT = {
  width: 1440,
  height: 900,
  deviceScaleFactor: 2
};

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const pages = [
  {
    fileName: "01-login.png",
    path: "/",
    waitFor: ".login-panel",
    capture: ".login-shell"
  },
  {
    fileName: "02-dashboard.png",
    path: "/dashboard.html",
    waitFor: "#dashboardCards .metric-card",
    capture: ".app-shell"
  },
  {
    fileName: "03-territorios.png",
    path: "/territorios.html",
    waitFor: "#territoryCards .territory-card",
    capture: ".app-shell"
  },
  {
    fileName: "04-pacientes.png",
    path: "/pacientes.html",
    waitFor: "#patientsTableBody tr",
    capture: ".app-shell"
  },
  {
    fileName: "05-paciente.png",
    path: "/paciente.html?id=PCT-001",
    waitFor: "#patientHero h2",
    capture: ".app-shell"
  },
  {
    fileName: "06-encaminhamento.png",
    path: "/encaminhamento.html?id=PCT-001",
    waitFor: "#serviceModules .service-tile",
    capture: ".app-shell"
  },
  {
    fileName: "07-acompanhamento.png",
    path: "/acompanhamento.html?id=PCT-001",
    waitFor: "#followupStatusStrip .status-step",
    capture: ".app-shell"
  },
  {
    fileName: "08-impacto.png",
    path: "/impacto.html",
    waitFor: "#impactCards .metric-card",
    capture: ".app-shell"
  }
];

function resolveRequestPath(pathname) {
  const targetPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = resolve(projectRoot, "." + targetPath);
  const safePath = normalize(filePath);

  if (!safePath.startsWith(projectRoot)) {
    return null;
  }

  if (!existsSync(safePath) || statSync(safePath).isDirectory()) {
    return null;
  }

  return safePath;
}

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

function resolveBrowserEnv() {
  if (!existsSync(vendoredLibDir)) {
    return process.env;
  }

  const mergedLibraryPath = [vendoredLibDir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(":");
  return {
    ...process.env,
    LD_LIBRARY_PATH: mergedLibraryPath
  };
}

async function startServer() {
  const server = createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    const filePath = resolveRequestPath(url.pathname);

    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Arquivo não encontrado.");
      return;
    }

    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(readFileSync(filePath));
  });

  await new Promise((resolveServer, rejectServer) => {
    server.once("error", rejectServer);
    server.listen(0, "127.0.0.1", resolveServer);
  });

  const address = server.address();
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`
  };
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images || []);
    await Promise.all(
      images.map((image) => {
        if (image.complete) {
          return Promise.resolve();
        }

        return new Promise((resolveImage) => {
          image.addEventListener("load", resolveImage, { once: true });
          image.addEventListener("error", resolveImage, { once: true });
        });
      })
    );
  });
}

async function settlePage(page, selector) {
  await page.waitForSelector(selector, { timeout: 10000 });
  await waitForImages(page);
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
  await page.waitForFunction(
    () => document.readyState === "complete" || document.readyState === "interactive",
    { timeout: 3000 }
  );
  await page.evaluate(
    () =>
      new Promise((resolveFrame) => {
        requestAnimationFrame(() => requestAnimationFrame(resolveFrame));
      })
  );
  await wait(180);
}

async function ensureViewportFits(page, selector) {
  const dimensions = await page.$eval(selector, (node) => {
    const rect = node.getBoundingClientRect();
    return {
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height)
    };
  });

  const nextHeight = Math.max(VIEWPORT.height, Math.min(dimensions.height + 48, 2200));
  const nextWidth = Math.max(VIEWPORT.width, Math.min(dimensions.width + 24, VIEWPORT.width));
  await page.setViewport({
    width: nextWidth,
    height: nextHeight,
    deviceScaleFactor: VIEWPORT.deviceScaleFactor
  });
  await wait(120);
}

async function capturePage(browser, baseUrl, pageConfig) {
  const page = await browser.newPage();
  try {
    await page.goto(baseUrl + pageConfig.path, {
      waitUntil: "domcontentloaded",
      timeout: 20000
    });
    await settlePage(page, pageConfig.waitFor);
    await ensureViewportFits(page, pageConfig.capture);

    const target = await page.$(pageConfig.capture);
    if (!target) {
      throw new Error(`Seletor de captura não encontrado: ${pageConfig.capture}`);
    }

    const destination = join(outputDir, pageConfig.fileName);
    await target.screenshot({
      path: destination,
      type: "png"
    });

    console.log(`Capturado: screenshots/${pageConfig.fileName}`);
    return destination;
  } finally {
    await page.close();
  }
}

async function main() {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const { server, baseUrl } = await startServer();
  const browser = await puppeteer.launch({
    headless: "shell",
    defaultViewport: VIEWPORT,
    env: resolveBrowserEnv()
  });

  try {
    const generated = [];
    for (const pageConfig of pages) {
      const filePath = await capturePage(browser, baseUrl, pageConfig);
      generated.push(filePath);
    }

    console.log("");
    console.log("Screenshots geradas:");
    generated.forEach((filePath) => {
      console.log("- " + filePath);
    });
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }
}

main().catch((error) => {
  console.error("Falha ao gerar screenshots.");
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);

  if (message.includes("error while loading shared libraries")) {
    console.error("");
    console.error("Em ambientes Linux mínimos, instale as bibliotecas nativas do Chromium antes de rodar a captura.");
    console.error(
      "Pacotes comuns em Debian/Ubuntu: libatk1.0-0 libatk-bridge2.0-0 libxdamage1 libgbm1 libxkbcommon0 libatspi2.0-0 fonts-liberation"
    );
  }

  process.exit(1);
});
