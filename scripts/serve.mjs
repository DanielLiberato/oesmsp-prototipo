#!/usr/bin/env node

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const projectRoot = resolve(__dirname, "..");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

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

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", "http://" + host + ":" + port);
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

server.listen(port, host, () => {
  console.log("OESM-SP disponível em http://" + host + ":" + port);
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
