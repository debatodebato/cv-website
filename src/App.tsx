import React, { useEffect, useState } from "react";

// Rolling banner logo images
import imgBannerLego    from "@/imports/RollingBanner/9a46b3f7300f3b658f22ba5b54f0d4dce54ed0f5.png";
import imgBannerMcD     from "@/imports/RollingBanner/49ef79aafb8f8f2cc307d42be9330b153af95e07.png";
import imgBannerSamsung from "@/imports/RollingBanner/ceee1f630044f1f1a23a6bcb650665e61c00aad9.png";
import imgBannerDubai   from "@/imports/RollingBanner/22cf9ebdbcd501d2b61ba99029313c9cb4c4ee2f.png";
import imgBannerAnghami from "@/imports/RollingBanner/59cb6b8fa00be522587d6a608c6cbacdfb62d35c.png";
import imgBannerLogo29  from "@/imports/RollingBanner/127a71025fed9b2c7e859bd91b3a783a1d60a8e6.png";
import imgBannerLogo26  from "@/imports/RollingBanner/1c56b3668d90d4f9211ec5e36113dd6d148d941d.png";
import imgBannerLogo37  from "@/imports/RollingBanner/0e691e7ff7e1544404d1d554fdd35311833eba30.png";
import imgBannerLogo34  from "@/imports/RollingBanner/7129b65a6e62a09c138850a755aaea58863a58e0.png";
import imgBannerLogo74  from "@/imports/RollingBanner/2c446a84793ae883eb45832212ef578e8b076af1.png";
import imgBannerLogo75  from "@/imports/RollingBanner/dcb8d6db75d9573e9037a5a0271c375563e5fac1.png";

type Section = "experience" | "press" | "honours";

// All CV content — including image URLs — is fetched from /api/cv at
// runtime. Images live under public/uploads and are editable via the
// admin CMS (admin.html); only decorative brand assets (the rolling
// banner logos above) stay bundled and CMS-unmanaged.
type Profile = { name: string; bio: string[]; photo: string };

type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

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

type Honour = {
  key: string;
  title: string;
  detail: string;
  photo: string;
  link?: string;
};

const emptyProfile: Profile = { name: "", bio: [], photo: "" };

function useCvData() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [honours, setHonours] = useState<Honour[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/cv")
      .then((res) => res.json())
      .then((data: { profile: Profile; experiences: Experience[]; pressItems: PressItem[]; honours: Honour[] }) => {
        if (cancelled) return;
        setProfile(data.profile);
        setExperiences(data.experiences);
        setPressItems(data.pressItems);
        setHonours(data.honours);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, experiences, pressItems, honours };
}

function IconExperience({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#000000";
  return (
    <svg width="13" height="11" viewBox="0 0 13 11" shapeRendering="crispEdges" fill="none">
      {/* handle top bar */}
      <rect x="4" y="0" width="5" height="1" fill={c} />
      {/* handle sides */}
      <rect x="4" y="1" width="1" height="1" fill={c} />
      <rect x="8" y="1" width="1" height="1" fill={c} />
      {/* body */}
      <rect x="0" y="2" width="13" height="9" fill={c} />
      {/* centre divider */}
      <rect x="6" y="4" width="1" height="5" fill={active ? "#000000" : "#ffffff"} opacity="0.25" />
    </svg>
  );
}

function IconPress({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#000000";
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" shapeRendering="crispEdges" fill="none">
      {/* page outline */}
      <rect x="0.5" y="0.5" width="10" height="12" stroke={c} strokeWidth="1" />
      {/* text lines */}
      <rect x="2" y="3" width="7" height="1" fill={c} />
      <rect x="2" y="5" width="7" height="1" fill={c} />
      <rect x="2" y="7" width="7" height="1" fill={c} />
      <rect x="2" y="9" width="4" height="1" fill={c} />
    </svg>
  );
}

function IconHonours({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#000000";
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" shapeRendering="crispEdges" fill={c}>
      {/* cup body */}
      <rect x="2" y="0" width="9" height="7" />
      {/* left handle */}
      <rect x="0" y="1" width="2" height="4" />
      {/* right handle */}
      <rect x="11" y="1" width="2" height="4" />
      {/* stem */}
      <rect x="5" y="7" width="3" height="2" />
      {/* base */}
      <rect x="2" y="9" width="9" height="2" />
      {/* foot */}
      <rect x="1" y="11" width="11" height="1.5" />
    </svg>
  );
}

function SectionToggle({
  active,
  onChange,
}: {
  active: Section;
  onChange: (s: Section) => void;
}) {
  const sections: { key: Section; label: string; Icon: React.FC<{ active: boolean }> }[] = [
    { key: "experience", label: "EXPERIENCE", Icon: IconExperience },
    { key: "press",      label: "PRESS",      Icon: IconPress },
    { key: "honours",    label: "HONOURS",    Icon: IconHonours },
  ];

  const tabIndex = sections.findIndex((s) => s.key === active);

  return (
    <div
      style={{
        display: "flex",
        borderRadius: "20px",
        padding: "4px",
        gap: "2px",
        width: "100%",
        position: "relative",
        minHeight: "52px",
      }}
    >
      {/* Sliding indicator */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          width: "calc((100% - 12px) / 3)",
          height: "calc(100% - 8px)",
          backgroundColor: "#000000",
          borderRadius: "16px",
          transform: `translateX(calc(${tabIndex} * (100% + 2px)))`,
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {sections.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "9px 4px 8px",
            borderRadius: "16px",
            backgroundColor: "transparent",
            color: active === key ? "#ffffff" : "#000000",
            border: "none",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            transition: "color 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Icon active={active === key} />
          <span
            style={{
              fontFamily: "'LED Counter 7', 'VT323', monospace",
              fontSize: "14px",
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

// w/h are Figma container dims; displayW overrides rendered width (height scales to preserve ratio)
const bannerLogos: { src: string; alt: string; w: number; h: number; objectPosition?: string; displayW?: number }[] = [
  { src: imgBannerLego,    alt: "LEGO",        w: 110.739, h: 50.996 },
  { src: imgBannerMcD,     alt: "McDonald's",  w: 54.931,  h: 48.426 },
  { src: imgBannerSamsung, alt: "Samsung",     w: 322.478, h: 51.221 },
  { src: imgBannerDubai,   alt: "Dubai",       w: 148.202, h: 56.418 },
  { src: imgBannerAnghami, alt: "Anghami",     w: 178.77,  h: 46.837, objectPosition: "center center" },
  { src: imgBannerLogo29,  alt: "Jeep",                  w: 107.641, h: 44.762 },
  { src: imgBannerLogo26,  alt: "Art Jameel",            w: 130.185, h: 50.712 },
  { src: imgBannerLogo37,  alt: "Tic Tac",               w: 54.998,  h: 48.209 },
  { src: imgBannerLogo34,  alt: "The Opus by Omniyat",   w: 56.295,  h: 48.905 },
  { src: imgBannerLogo74,  alt: "National Pavilion UAE", w: 79.707,  h: 46.562 },
  // 225×225 square with whitespace; Figma container was 2.065:1 — crop center to show full wordmark
  { src: imgBannerLogo75,  alt: "Bayt Al Mamzar",        w: 124.096, h: 60.139, objectPosition: "center center" },
];

const TARGET_H = 32;

function Marquee() {
  const doubled = [...bannerLogos, ...bannerLogos];
  return (
    <div style={{ overflow: "hidden", borderRadius: "20px", backgroundColor: "#ffffff" }}>
      <div className="marquee-track" style={{ alignItems: "center" }}>
        {doubled.map((logo, i) => (
          <span
            key={i}
            style={{ display: "inline-flex", alignItems: "center", flexShrink: 0, padding: "18px 20px" }}
          >
            {logo.displayW ? (
              // Render at fixed width; height scales naturally to preserve aspect ratio
              <img
                src={logo.src}
                alt={logo.alt}
                style={{ width: `${logo.displayW}px`, height: "auto", display: "block", flexShrink: 0 }}
              />
            ) : logo.objectPosition ? (
              <div style={{ height: `${TARGET_H}px`, width: `${TARGET_H * (logo.w / logo.h)}px`, flexShrink: 0, overflow: "hidden" }}>
                <img src={logo.src} alt={logo.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: logo.objectPosition }} />
              </div>
            ) : (
              <img src={logo.src} alt={logo.alt} style={{ height: `${TARGET_H}px`, width: "auto", display: "block", flexShrink: 0 }} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({
  exp,
  defaultOpen,
}: {
  exp: Experience;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className="cursor-pointer select-none w-full flex flex-col items-start"
      style={{
        backgroundColor: "#f2f2f2",
        borderRadius: "20px",
        padding: "20px 24px",
        gap: open ? "16px" : "0",
        transition: "gap 0.25s ease",
      }}
    >
      {/* Header row: title+company left, arrow right */}
      <div className="flex items-end justify-between w-full">
        <div
          className="flex flex-col items-start justify-center min-w-0"
          style={{ gap: "4px", flex: "1 0 0" }}
        >
          <p
            style={{
              fontFamily: "'LED Counter 7', 'VT323', monospace",
              fontSize: "12px",
              color: "rgba(0,0,0,0.45)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
              maxWidth: "100%",
            }}
          >
            {exp.company}
          </p>
          <p
            style={{
              fontFamily: "'Roboto Serif', serif",
              fontWeight: 500,
              fontSize: "16px",
              color: "#000000",
              lineHeight: 1.3,
              wordBreak: "break-word",
              fontVariationSettings: '"GRAD" 0, "wdth" 100',
            }}
          >
            {exp.title}
          </p>
        </div>

        {/* Clipped LED `>` arrow — rotates to ↓ when open */}
        <div
          style={{
            display: "flex",
            height: "10px",
            width: "20px",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
              lineHeight: "normal",
            }}
          >
            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: "20px",
                color: "#000000",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                lineHeight: "normal",
              }}
            >
              {">"}
            </p>
          </div>
        </div>
      </div>

      {/* Description — fades in when open */}
      {open && (
        <div className="accordion-body w-full" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p
            style={{
              fontFamily: "'LED Counter 7', 'VT323', monospace",
              fontSize: "11px",
              color: "rgba(0,0,0,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {exp.period}
          </p>
          <p
            style={{
              fontFamily: "'Graphik', 'Inter', sans-serif",
              fontSize: "13.5px",
              color: "#000000",
              lineHeight: 1.7,
              wordBreak: "break-word",
            }}
          >
            {exp.description}
          </p>
        </div>
      )}
    </div>
  );
}

function PressCard({ item }: { item: PressItem }) {
  const Wrapper = item.link ? "a" : "div";
  const linkProps = item.link
    ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Wrapper
      {...linkProps}
      style={{
        backgroundColor: "#f2f2f2",
        borderRadius: "20px",
        display: "flex",
        gap: "20px",
        padding: "16px",
        alignItems: "flex-end",
        width: "100%",
        textDecoration: "none",
        cursor: item.link ? "pointer" : "default",
      }}
    >
      {/* Left: article photo */}
      <div
        style={{
          width: "220px",
          height: "190px",
          flexShrink: 0,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <img
          src={item.photo}
          alt={item.publication}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Right: publication logo + headline */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          paddingBottom: "4px",
        }}
      >
        {item.logoCrop ? (
          <div style={{ height: "28px", width: `${item.logoCrop.w}px`, overflow: "hidden", flexShrink: 0 }}>
            <img
              src={item.logo}
              alt={item.publication}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: item.logoCrop.objectPosition }}
            />
          </div>
        ) : (
          <img
            src={item.logo}
            alt={item.publication}
            style={{ height: "28px", width: "auto", maxWidth: "220px", objectFit: "contain", objectPosition: "left center" }}
          />
        )}
        <p
          style={{
            fontFamily: "'Roboto Serif', serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#000000",
            lineHeight: 1.35,
            wordBreak: "break-word",
            fontVariationSettings: '"GRAD" 0, "wdth" 100',
          }}
        >
          {item.headline}
        </p>
      </div>
    </Wrapper>
  );
}

function HonourCard({ item }: { item: Honour }) {
  const Wrapper = item.link ? "a" : "div";
  const linkProps = item.link
    ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Wrapper
      {...linkProps}
      style={{
        backgroundColor: "#f2f2f2",
        borderRadius: "20px",
        display: "flex",
        gap: "20px",
        padding: "16px",
        alignItems: "flex-end",
        width: "100%",
        textDecoration: "none",
        cursor: item.link ? "pointer" : "default",
      }}
    >
      {/* Photo */}
      <div style={{ width: "220px", height: "190px", flexShrink: 0, borderRadius: "12px", overflow: "hidden" }}>
        <img
          src={item.photo}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "4px" }}>
        <p
          style={{
            fontFamily: "'Roboto Serif', serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#000000",
            lineHeight: 1.35,
            wordBreak: "break-word",
            fontVariationSettings: '"GRAD" 0, "wdth" 100',
          }}
        >
          {item.title}
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "#000000",
          }}
        >
          {item.detail}
        </p>
      </div>
    </Wrapper>
  );
}

function ProfilePhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        width: "248px",
        aspectRatio: "1 / 1",
        borderRadius: "20px",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }}
        />
      )}
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center justify-between py-4">
      <span
        style={{
          fontFamily: "'LED Counter 7', 'VT323', monospace",
          fontSize: "9px",
          letterSpacing: "0.12em",
          color: "#999999",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Graphik', 'Inter', sans-serif",
          fontSize: "13px",
          color: "#000000",
          textDecoration: "none",
        }}
      >
        {value}
      </span>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}

export default function App() {
  const [section, setSection] = useState<Section>("experience");
  const { profile, experiences, pressItems, honours } = useCvData();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e8e8e8",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        justifyContent: "center",
        padding: "16px 16px 180px",
      }}
    >
      {/* Fixed bottom toggle */}
      <div
        style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 32px)",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden",
          zIndex: 100,
        }}
      >
        <SectionToggle active={section} onChange={setSection} />
      </div>

      {/* Centred column — all cards stack here */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "560px" }}>

        {/* ── EXPERIENCE ── */}
        {section === "experience" && (
          <>
            {/* Profile card */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "28px 24px 32px" }}>
              <ProfilePhoto src={profile.photo} alt={profile.name} />
              <h1
                style={{
                  fontFamily: "'Roboto Serif', serif",
                  fontWeight: 500,
                  fontSize: "32px",
                  color: "#000000",
                  lineHeight: 1.15,
                  marginTop: "40px",
                  marginBottom: "16px",
                  fontVariationSettings: '"GRAD" 0, "wdth" 100',
                }}
              >
                {profile.name}
              </h1>
              {profile.bio.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Graphik', 'Inter', sans-serif",
                    fontSize: "14px",
                    lineHeight: 1.75,
                    color: "#000000",
                    marginBottom: i < profile.bio.length - 1 ? "14px" : 0,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Marquee card — has its own bg + radius */}
            <Marquee />

            {/* Experience — one card per role */}
            {experiences.map((exp, i) => (
              <ExperienceCard key={i} exp={exp} defaultOpen={i === 0} />
            ))}

            {/* Contact card */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "0 24px 4px" }}>
              <ContactRow label="TEL" value="+971 56 445 8935" href="tel:+971564458935" />
              <ContactRow label="EMAIL" value="barreto.desiree7@gmail.com" href="mailto:barreto.desiree7@gmail.com" />
              <ContactRow label="LINKEDIN" value="linkedin.com/in/desiree-barreto" href="https://linkedin.com/in/desiree-barreto" />
            </div>
          </>
        )}

        {/* ── PRESS ── */}
        {section === "press" && (
          <>
            {pressItems.map((item, i) => (
              <PressCard key={i} item={item} />
            ))}
          </>
        )}

        {/* ── HONOURS ── */}
        {section === "honours" && (
          <>
            {honours.map((item, i) => (
              <HonourCard key={i} item={item} />
            ))}
          </>
        )}

      </div>
    </div>
  );
}
