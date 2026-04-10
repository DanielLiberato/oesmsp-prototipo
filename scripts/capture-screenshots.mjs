#!/usr/bin/env node

import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const projectRoot = resolve(__dirname, "..");
const outputDir = join(projectRoot, "screenshots");
const port = 4173;

const pages = [
  { slug: "01-login", path: "/" },
  { slug: "02-dashboard", path: "/dashboard.html" },
  { slug: "03-territorios", path: "/territorios.html" },
  { slug: "04-pacientes", path: "/pacientes.html" },
  { slug: "05-paciente", path: "/paciente.html?id=PCT-001" },
  { slug: "06-encaminhamento", path: "/encaminhamento.html?id=PCT-001" },
  { slug: "07-acompanhamento", path: "/acompanhamento.html?id=PCT-001" },
  { slug: "08-impacto", path: "/impacto.html" }
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function detectBrowser() {
  const candidates = ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"];
  for (const command of candidates) {
    const result = spawnSync(command, ["--version"], { stdio: "ignore" });
    if (result.status === 0) {
      return command;
    }
  }
  return null;
}

function serveFile(pathname) {
  const sanitized = pathname === "/" ? "/index.html" : pathname;
  const filePath = resolve(projectRoot, "." + sanitized);
  const safePath = normalize(filePath);

  if (!safePath.startsWith(projectRoot)) {
    return { status: 403, body: "Acesso negado", type: "text/plain; charset=utf-8" };
  }

  if (!existsSync(safePath) || statSync(safePath).isDirectory()) {
    return { status: 404, body: "Arquivo não encontrado", type: "text/plain; charset=utf-8" };
  }

  return {
    status: 200,
    body: readFileSync(safePath),
    type: mimeTypes[extname(safePath)] || "application/octet-stream"
  };
}

async function main() {
  const browser = detectBrowser();
  if (!browser) {
    console.error("Nenhum Chrome/Chromium foi encontrado no PATH.");
    console.error("Instale um navegador compatível e execute novamente: node scripts/capture-screenshots.mjs");
    process.exit(1);
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const server = createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1:" + port);
    const file = serveFile(url.pathname);
    response.writeHead(file.status, { "Content-Type": file.type });
    response.end(file.body);
  });

  await new Promise((resolveServer) => server.listen(port, "127.0.0.1", resolveServer));

  try {
    for (const page of pages) {
      const destination = join(outputDir, page.slug + ".png");
      const url = "http://127.0.0.1:" + port + page.path;
      const args = [
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--virtual-time-budget=2000",
        "--window-size=1440,1200",
        "--screenshot=" + destination,
        url
      ];

      const result = spawnSync(browser, args, { stdio: "inherit" });
      if (result.status !== 0) {
        throw new Error("Falha ao capturar " + page.path);
      }

      console.log("Capturado:", destination);
    }
  } finally {
    server.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
