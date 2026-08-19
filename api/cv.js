import cv from "../server/data/cv.json" with { type: "json" };

// Vercel's filesystem is read-only at runtime, so this endpoint only
// serves the content committed at build time. Editing (PUT) only works
// against the local dev server — see server/index.js.
export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Editing isn't available on the deployed site. Run the CMS locally with `npm run dev`, then commit and redeploy to publish changes.",
    });
    return;
  }
  res.status(200).json(cv);
}
