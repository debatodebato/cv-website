import cv from "../server/data/cv.json" with { type: "json" };

export default function handler(req, res) {
  res.status(200).json(cv);
}
