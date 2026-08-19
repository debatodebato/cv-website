import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.API_PORT || 4000;

app.get("/api/cv", async (_req, res) => {
  const data = await readFile(path.join(__dirname, "data/cv.json"), "utf-8");
  res.type("application/json").send(data);
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
