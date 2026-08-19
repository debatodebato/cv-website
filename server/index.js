import express from "express";
import multer from "multer";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "data/cv.json");
const uploadsDir = path.join(__dirname, "../public/uploads");

const app = express();
const port = process.env.API_PORT || 4000;

app.use(express.json({ limit: "1mb" }));

app.get("/api/cv", async (_req, res) => {
  const data = await readFile(dataPath, "utf-8");
  res.type("application/json").send(data);
});

app.put("/api/cv", async (req, res) => {
  await writeFile(dataPath, JSON.stringify(req.body, null, 2) + "\n", "utf-8");
  res.json({ ok: true });
});

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await mkdir(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, /^image\//.test(file.mimetype));
  },
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
