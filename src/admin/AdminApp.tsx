import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImageBlob } from "./cropImage";

type Profile = { name: string; bio: string[]; photo: string };
type Experience = { title: string; company: string; period: string; description: string };
type PressItem = {
  key: string;
  publication: string;
  headline: string;
  year: string;
  logoCrop?: { w: number; objectPosition: string };
  photo: string;
  logo: string;
  link?: string;
};
type Honour = { key: string; title: string; detail: string; photo: string; link?: string };
type CvData = {
  profile: Profile;
  experiences: Experience[];
  pressItems: PressItem[];
  honours: Honour[];
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
  fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 };
const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #333",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
};
const dangerButtonStyle: React.CSSProperties = { ...buttonStyle, borderColor: "#c0392b", color: "#c0392b" };
const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#111",
  color: "#fff",
  borderColor: "#111",
  padding: "10px 20px",
  fontSize: 14,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function CropModal({
  src,
  aspect,
  onCancel,
  onConfirm,
}: {
  src: string;
  aspect?: number;
  onCancel: () => void;
  onConfirm: (area: Area) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setArea(croppedAreaPixels);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 480, overflow: "hidden" }}>
        <div style={{ position: "relative", width: "100%", height: 360, background: "#333" }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect ?? 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Zoom">
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button style={buttonStyle} onClick={onCancel}>
              Cancel
            </button>
            <button style={primaryButtonStyle} onClick={() => area && onConfirm(area)} disabled={!area}>
              Crop & upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageUploader({
  url,
  onChange,
  aspect,
}: {
  url: string;
  onChange: (url: string) => void;
  aspect?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  function handleFile(file: File) {
    setPendingFile(file);
    setCropSrc(URL.createObjectURL(file));
  }

  function closeCrop() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setPendingFile(null);
  }

  async function handleCropConfirm(area: Area) {
    if (!cropSrc || !pendingFile) return;
    setBusy(true);
    try {
      const blob = await getCroppedImageBlob(cropSrc, area, pendingFile.type);
      const form = new FormData();
      form.append("image", blob, pendingFile.name);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
      closeCrop();
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {url && <img src={url} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd" }} />}
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {busy && <span style={{ fontSize: 12, color: "#888" }}>Uploading…</span>}
      {cropSrc && (
        <CropModal src={cropSrc} aspect={aspect} onCancel={closeCrop} onConfirm={handleCropConfirm} />
      )}
    </div>
  );
}

export default function AdminApp() {
  const [data, setData] = useState<CvData | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    fetch("/api/cv")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setStatus("Failed to load CV data. Is the API server running (npm run dev:api)?"));
  }, []);

  async function save() {
    if (!data) return;
    setStatus("Saving…");
    try {
      const res = await fetch("/api/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Saved. Refresh the site to see your changes.");
    } catch (err) {
      setStatus("Save failed: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  if (!data) {
    return <div style={{ padding: 40, fontFamily: "sans-serif" }}>{status || "Loading…"}</div>;
  }

  const newKey = () => `item-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
  const PHOTO_ASPECT = 220 / 190;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 120px", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>CV Website — Admin</h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
        Edit your CV content and images below, then click Save. This only writes to your local files — commit and
        redeploy to publish changes to the live site.
      </p>

      {/* Profile */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Profile</h2>
        <div style={cardStyle}>
          <Field label="Photo">
            <ImageUploader
              url={data.profile.photo}
              aspect={1}
              onChange={(url) => setData({ ...data, profile: { ...data.profile, photo: url } })}
            />
          </Field>
          <Field label="Name">
            <input
              style={inputStyle}
              value={data.profile.name}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, name: e.target.value } })}
            />
          </Field>
          {data.profile.bio.map((para, i) => (
            <Field key={i} label={`Bio paragraph ${i + 1}`}>
              <textarea
                style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
                value={para}
                onChange={(e) => {
                  const bio = [...data.profile.bio];
                  bio[i] = e.target.value;
                  setData({ ...data, profile: { ...data.profile, bio } });
                }}
              />
            </Field>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Experience</h2>
        {data.experiences.map((exp, i) => (
          <div key={i} style={cardStyle}>
            <Field label="Title">
              <input
                style={inputStyle}
                value={exp.title}
                onChange={(e) => {
                  const experiences = [...data.experiences];
                  experiences[i] = { ...exp, title: e.target.value };
                  setData({ ...data, experiences });
                }}
              />
            </Field>
            <Field label="Company">
              <input
                style={inputStyle}
                value={exp.company}
                onChange={(e) => {
                  const experiences = [...data.experiences];
                  experiences[i] = { ...exp, company: e.target.value };
                  setData({ ...data, experiences });
                }}
              />
            </Field>
            <Field label="Period">
              <input
                style={inputStyle}
                value={exp.period}
                onChange={(e) => {
                  const experiences = [...data.experiences];
                  experiences[i] = { ...exp, period: e.target.value };
                  setData({ ...data, experiences });
                }}
              />
            </Field>
            <Field label="Description">
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={exp.description}
                onChange={(e) => {
                  const experiences = [...data.experiences];
                  experiences[i] = { ...exp, description: e.target.value };
                  setData({ ...data, experiences });
                }}
              />
            </Field>
            <button
              style={dangerButtonStyle}
              onClick={() => setData({ ...data, experiences: data.experiences.filter((_, idx) => idx !== i) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          style={buttonStyle}
          onClick={() =>
            setData({
              ...data,
              experiences: [...data.experiences, { title: "", company: "", period: "", description: "" }],
            })
          }
        >
          + Add experience
        </button>
      </section>

      {/* Press */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Press</h2>
        {data.pressItems.map((item, i) => (
          <div key={item.key} style={cardStyle}>
            <Field label="Photo">
              <ImageUploader
                url={item.photo}
                aspect={PHOTO_ASPECT}
                onChange={(url) => {
                  const pressItems = [...data.pressItems];
                  pressItems[i] = { ...item, photo: url };
                  setData({ ...data, pressItems });
                }}
              />
            </Field>
            <Field label="Publication logo">
              <ImageUploader
                url={item.logo}
                onChange={(url) => {
                  const pressItems = [...data.pressItems];
                  pressItems[i] = { ...item, logo: url };
                  setData({ ...data, pressItems });
                }}
              />
            </Field>
            <Field label="Publication">
              <input
                style={inputStyle}
                value={item.publication}
                onChange={(e) => {
                  const pressItems = [...data.pressItems];
                  pressItems[i] = { ...item, publication: e.target.value };
                  setData({ ...data, pressItems });
                }}
              />
            </Field>
            <Field label="Headline">
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                value={item.headline}
                onChange={(e) => {
                  const pressItems = [...data.pressItems];
                  pressItems[i] = { ...item, headline: e.target.value };
                  setData({ ...data, pressItems });
                }}
              />
            </Field>
            <Field label="Year">
              <input
                style={inputStyle}
                value={item.year}
                onChange={(e) => {
                  const pressItems = [...data.pressItems];
                  pressItems[i] = { ...item, year: e.target.value };
                  setData({ ...data, pressItems });
                }}
              />
            </Field>
            <Field label="Link (opens the card when clicked)">
              <input
                style={inputStyle}
                placeholder="https://..."
                value={item.link ?? ""}
                onChange={(e) => {
                  const pressItems = [...data.pressItems];
                  pressItems[i] = { ...item, link: e.target.value };
                  setData({ ...data, pressItems });
                }}
              />
            </Field>
            <button
              style={dangerButtonStyle}
              onClick={() => setData({ ...data, pressItems: data.pressItems.filter((_, idx) => idx !== i) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          style={buttonStyle}
          onClick={() =>
            setData({
              ...data,
              pressItems: [
                ...data.pressItems,
                { key: newKey(), publication: "", headline: "", year: "", photo: "", logo: "", link: "" },
              ],
            })
          }
        >
          + Add press item
        </button>
      </section>

      {/* Honours */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Honours</h2>
        {data.honours.map((item, i) => (
          <div key={item.key} style={cardStyle}>
            <Field label="Photo">
              <ImageUploader
                url={item.photo}
                aspect={PHOTO_ASPECT}
                onChange={(url) => {
                  const honours = [...data.honours];
                  honours[i] = { ...item, photo: url };
                  setData({ ...data, honours });
                }}
              />
            </Field>
            <Field label="Title">
              <input
                style={inputStyle}
                value={item.title}
                onChange={(e) => {
                  const honours = [...data.honours];
                  honours[i] = { ...item, title: e.target.value };
                  setData({ ...data, honours });
                }}
              />
            </Field>
            <Field label="Detail">
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                value={item.detail}
                onChange={(e) => {
                  const honours = [...data.honours];
                  honours[i] = { ...item, detail: e.target.value };
                  setData({ ...data, honours });
                }}
              />
            </Field>
            <Field label="Link (opens the card when clicked)">
              <input
                style={inputStyle}
                placeholder="https://..."
                value={item.link ?? ""}
                onChange={(e) => {
                  const honours = [...data.honours];
                  honours[i] = { ...item, link: e.target.value };
                  setData({ ...data, honours });
                }}
              />
            </Field>
            <button
              style={dangerButtonStyle}
              onClick={() => setData({ ...data, honours: data.honours.filter((_, idx) => idx !== i) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          style={buttonStyle}
          onClick={() =>
            setData({
              ...data,
              honours: [...data.honours, { key: newKey(), title: "", detail: "", photo: "", link: "" }],
            })
          }
        >
          + Add honour
        </button>
      </section>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px",
          background: "#fff",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button style={primaryButtonStyle} onClick={save}>
          Save
        </button>
        <span style={{ fontSize: 13, color: "#666" }}>{status}</span>
        <a href="/" style={{ marginLeft: "auto", fontSize: 13 }}>
          View site →
        </a>
      </div>
    </div>
  );
}
