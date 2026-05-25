import React, { useState, useEffect, useRef } from 'react';

/* ─── DATA ─── */
const experiences = [
  {
    id: "e1",
    role: "Software Engineer",
    company: "Coop Rechtsschutz",
    date: "2025 – Present",
    desc: "Helping legal professionals work more efficiently via modern web stacks and cloud infrastructure.",
    skills: ["FastAPI", "PostgreSQL", "Vue", "GCP"],
  },
  {
    id: "e2",
    role: "Data Engineer",
    company: "University of Lucerne",
    date: "2023 – 2025",
    desc: "Building an online platform for legal data ingestion, processing, and distribution.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Airtable", "Azure", "SCRUM"],
  },
  {
    id: "e3",
    role: "NLP Researcher",
    company: "University of Lucerne",
    date: "2024",
    desc: "Applied BERT to research digital payments from a sociological perspective.",
    skills: ["Python", "PyTorch", "NLP", "BERT", "PostgreSQL", "Azure"],
  },
  {
    id: "e4",
    role: "Junior Data Scientist",
    company: "aserto",
    date: "2020 – 2023",
    desc: "Evidence-based business analytics. Rised from intern to junior, delivering insights with R and SPSS.",
    skills: ["R", "SPSS", "VBA", "Data Analysis", "Visualization"],
  },
  {
    id: "e5",
    role: "Market Research Intern",
    company: "Ipsos",
    date: "2021",
    desc: "Quantitative market research delivering insights to FMCG and innovation clients.",
    skills: ["Quantitative Research", "Market Analysis"],
  },
];

const projects = [
  {
    id: "p1",
    title: "CLERK",
    desc: "AI system enabling collective production and validation of LLM-based application workflows.",
    link: "https://openclerk.ch",
    tech: ["React", "FastAPI", "Langchain", "Langgraph", "Supabase", "Docker", "Azure"],
  },
  {
    id: "p2",
    title: "Trailventure",
    desc: "Blog website documenting my running journey. Built for mobile publishing on the go.",
    link: "https://trailventure.net",
    tech: ["React", "Express", "Node", "MongoDB", "Docker", "Azure"],
  },
  {
    id: "p3",
    title: "CoLD Case Analyzer",
    desc: "LLMs and AI agents automating analysis of court decisions for legal researchers.",
    link: "https://github.com/choice-of-Law-Dataverse/cold-case-analysis",
    tech: ["Python", "Langchain", "Langgraph", "GPT", "Streamlit"],
  },
  {
    id: "p4",
    title: "Choice of Law Dataverse",
    desc: "Open-access platform for private international law research data and tooling.",
    link: "https://www.choiceoflawdataverse.com/",
    tech: ["PostgreSQL", "Airtable", "Azure", "Python", "FastAPI", "Nuxt.JS"],
  },
  {
    id: "p5",
    title: "Digital Payments NLP",
    desc: "NLP, BERTopic, and GPT analysis of digital payments industry discourse.",
    link: "https://github.com/simonweigold/business-reports-nlp",
    tech: ["Python", "BERTopic", "HuggingFace", "GPT", "PostgreSQL", "Azure"],
  },
  {
    id: "p6",
    title: "Spotify Network Analysis",
    desc: "Examined how artist collaboration networks influence musical success via data mining and SNA.",
    link: "https://github.com/simonweigold/spotify-charts-network",
    tech: ["R", "Python", "SNA", "Regression", "Spotify API"],
  },
  {
    id: "p7",
    title: "Twitter Sentiment Analysis",
    desc: "Public discourse analysis on Elon Musk's Twitter acquisition using roBERTa and VADER.",
    link: "https://github.com/simonweigold/twitter-sentiment-analysis",
    tech: ["Python", "roBERTa", "VADER", "NLTK"],
  },
];

const skills = [
  "Python","Pandas","NumPy","SciPy","Scikit-learn","Keras","PyTorch","Langchain","Langgraph",
  "FastAPI","Flask","Pydantic","Pytest","R","Tidyverse","Shiny","JavaScript","React","Nuxt",
  "Vue","Express", "Databases","PostgreSQL","SQL Server","MongoDB", "DevOps", "Git","Docker","Kubernetes","Azure",
  "GCP","Cloudflare", "Data Science", "NLP","Network Analysis","Statistics",
];

const skillCategory = (s: string): string => {
  const langs = new Set(["Python", "R", "JavaScript", "Databases"]);
  const abstract = new Set(["DevOps", "Data Science"]);
  if (langs.has(s)) return "lang";
  if (abstract.has(s)) return "abs";
  return "lib";
};

/* ─── PERLIN NOISE ─── */
class PerlinNoise {
  p: Uint8Array;

  constructor() {
    this.p = new Uint8Array(512);
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 0; i < 256; i++) {
      const r = i + ~~(Math.random() * (256 - i));
      const t = perm[i];
      perm[i] = perm[r];
      perm[r] = t;
    }
    for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
  }

  fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  grad(hash: number, x: number, y: number): number {
    switch (hash & 3) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      case 3: return -x - y;
      default: return 0;
    }
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const A = this.p[X] + Y;
    const B = this.p[X + 1] + Y;
    return this.lerp(
      v,
      this.lerp(u, this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y)),
      this.lerp(u, this.grad(this.p[A + 1], x, y - 1), this.grad(this.p[B + 1], x - 1, y - 1))
    );
  }
}

/* ─── GENERATIVE CANVAS ─── */
function GenerativeCanvas({ mode }: { mode: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const noiseRef = useRef(new PerlinNoise());
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener("mousemove", handleMouse);

    const cellSize = 16;

    const draw = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);

      ctx.fillStyle = "#FDFBF7";
      ctx.fillRect(0, 0, w, h);

      timeRef.current += 0.004;
      const t = timeRef.current;
      const noise = noiseRef.current;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * cellSize;
          const y = j * cellSize;
          const u = i / cols;
          const v = j / rows;
          let b = 0.5;

          if (mode === "noise") {
            const s = 5;
            b = noise.noise2D(u * s + t * 0.3, v * s) * 0.5 + 0.5;
            b += noise.noise2D(u * s * 2 - t * 0.2, v * s * 2 + t * 0.2) * 0.25;
            b = Math.min(1, Math.max(0, b));
          } else if (mode === "wave") {
            const f = 12;
            b = Math.sin(u * f + t * 3) * Math.cos(v * f + t * 2) * 0.5 + 0.5;
            b += Math.sin((u + v) * f * 1.5 - t * 2.5) * 0.2;
            b = Math.min(1, Math.max(0, b));
          } else if (mode === "mouse") {
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const dx = u - mx;
            const dy = v - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            b = Math.max(0, 1 - dist * 1.8);
            b += noise.noise2D(u * 12, v * 12) * 0.08;
            b = Math.min(1, Math.max(0, b));
          }

          const state = Math.min(7, Math.floor(b * 7) + 1);
          const cx = x + cellSize / 2;
          const cy = y + cellSize / 2;
          const s2 = cellSize * 0.32;

          ctx.fillStyle = "#111";
          ctx.strokeStyle = "#111";
          ctx.lineWidth = 1.2;

          switch (state) {
            case 1:
              ctx.fillRect(cx - 1, cy - 1, 2, 2);
              break;
            case 2:
              ctx.beginPath();
              ctx.moveTo(cx, cy - s2 * 0.6);
              ctx.lineTo(cx, cy + s2 * 0.6);
              ctx.moveTo(cx - s2 * 0.6, cy);
              ctx.lineTo(cx + s2 * 0.6, cy);
              ctx.stroke();
              break;
            case 3:
              ctx.beginPath();
              ctx.moveTo(cx - s2 * 0.5, cy + s2 * 0.5);
              ctx.lineTo(cx + s2 * 0.5, cy - s2 * 0.5);
              ctx.stroke();
              break;
            case 4:
              ctx.beginPath();
              ctx.arc(cx, cy, s2 * 0.25, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(cx, cy, s2 * 0.5, 0, Math.PI * 2);
              ctx.stroke();
              break;
            case 5:
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(cx - s2 * 0.4, cy - s2 * 0.4);
              ctx.lineTo(cx + s2 * 0.4, cy + s2 * 0.4);
              ctx.moveTo(cx + s2 * 0.4, cy - s2 * 0.4);
              ctx.lineTo(cx - s2 * 0.4, cy + s2 * 0.4);
              ctx.stroke();
              ctx.lineWidth = 1.2;
              break;
            case 6:
              ctx.strokeRect(cx - s2 * 0.4, cy - s2 * 0.4, s2 * 0.8, s2 * 0.8);
              break;
            case 7:
              ctx.fillRect(cx - s2 * 0.4, cy - s2 * 0.4, s2 * 0.8, s2 * 0.8);
              break;
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, [mode]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

/* ─── APP ─── */
function App() {
  const [activeExp, setActiveExp] = useState<number | null>(null);
  const [activeProj, setActiveProj] = useState<number | null>(null);
  const [canvasMode, setCanvasMode] = useState("noise");
  const detailRef = useRef<HTMLDivElement>(null);

  const selectExp = (idx: number) => {
    setActiveExp(idx);
    setActiveProj(null);
  };

  const selectProj = (idx: number) => {
    setActiveProj(idx);
    setActiveExp(null);
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [activeExp, activeProj]);

  const detailData =
    activeProj !== null
      ? { type: "project" as const, ...projects[activeProj] }
      : activeExp !== null
      ? { type: "experience" as const, ...experiences[activeExp] }
      : null;

  const activeSkillSet =
    activeProj !== null
      ? new Set(projects[activeProj].tech)
      : activeExp !== null
      ? new Set(experiences[activeExp].skills)
      : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html, body {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          overflow: hidden;
          background: #111;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        #root { width: 100%; height: 100%; }

        .bauhaus-frame {
          width: 100vw; height: 100vh;
          display: grid;
          grid-template-columns: 1.6fr 1.2fr 1fr 1fr;
          grid-template-rows: 1.4fr 1fr 1fr;
          gap: 1px;
          background: #111;
          border: 4px solid #111;
        }

        .panel {
          background: #FDFBF7;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
        }

        .panel-label {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #777;
          margin-bottom: 0.6rem;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .panel-label::before {
          content: '';
          display: inline-block;
          width: 8px; height: 8px;
          background: #E63946;
        }

        /* Hero */
        .hero h1 {
          font-size: clamp(1.8rem, 3.2vw, 3.2rem);
          font-weight: 800;
          line-height: 0.95;
          color: #111;
          margin: 0 0 0.4rem 0;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }
        .hero h2 {
          font-size: clamp(0.7rem, 1vw, 0.95rem);
          font-weight: 500;
          color: #444;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
        }
        .hero p {
          font-size: clamp(0.72rem, 0.85vw, 0.85rem);
          color: #333;
          line-height: 1.45;
          margin: 0 0 0.5rem 0;
          max-width: 92%;
        }
        .hero a {
          color: #1D3557;
          text-decoration: none;
          font-weight: 700;
          border-bottom: 1px solid #1D3557;
        }
        .hero a:hover { color: #E63946; border-bottom-color: #E63946; }

        /* Lists */
        .list { list-style: none; margin: 0; padding: 0; overflow: hidden; }
        .list-item {
          padding: 4px 0;
          border-bottom: 1px solid rgba(17,17,17,0.07);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.78rem;
          color: #222;
          line-height: 1.25;
        }
        .list-item:last-child { border-bottom: none; }
        .list-item:hover { color: #E63946; padding-left: 5px; }
        .list-item.active { color: #E63946; padding-left: 5px; font-weight: 700; }
        .list-item .meta { font-size: 0.68rem; color: #888; font-weight: 400; display: block; margin-top: 1px; }
        .exp-line { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
        .exp-date { font-size: 0.68rem; color: #888; font-weight: 400; white-space: nowrap; flex-shrink: 0; }

        /* Detail */
        .detail-content { display: flex; flex-direction: column; height: 100%; }
        .detail-label {
          font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; margin-bottom: 0.4rem;
        }
        .detail-title {
          font-size: clamp(0.95rem, 1.4vw, 1.35rem);
          font-weight: 700; color: #111; margin: 0 0 0.2rem 0; line-height: 1.15;
        }
        .detail-sub {
          font-size: 0.74rem; color: #555; margin-bottom: 0.6rem; font-weight: 500;
        }
        .detail-desc {
          font-size: 0.78rem; color: #333; line-height: 1.45;
          margin-bottom: 0.75rem; flex: 1; overflow: hidden;
        }
        .detail-tags { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 0.6rem; }
        .detail-tag {
          font-size: 0.62rem; padding: 2px 5px;
          border: 1px solid #111; color: #111; font-weight: 500;
        }
        .detail-link {
          display: inline-block; font-size: 0.68rem; font-weight: 700;
          text-transform: uppercase; color: #E63946; text-decoration: none;
          border-bottom: 2px solid #E63946; align-self: flex-start;
        }
        .detail-link:hover { background: #E63946; color: #fff; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .detail-animate { animation: fadeIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

        /* Skills */
        .skills-cloud { display: flex; flex-wrap: wrap; gap: 4px; align-content: flex-start; }
        .skill-tag {
          font-size: 0.65rem; padding: 2px 5px;
          border: 1px solid #111; color: #111; font-weight: 500; line-height: 1;
          transition: opacity 0.25s ease;
        }
        .skill-tag.lang { background: #1D3557; border-color: #1D3557; color: #FDFBF7; }
        .skill-tag.lib { background: #FDFBF7; border-color: #111; color: #111; }
        .skill-tag.abs { background: #F4D35E; border-color: #F4D35E; color: #111; }
        .skill-tag.dimmed { opacity: 0.15; }

        /* Education */
        .edu-item { margin-bottom: 0.6rem; }
        .edu-degree { font-size: 0.76rem; font-weight: 700; color: #111; line-height: 1.2; margin-bottom: 1px; }
        .edu-school { font-size: 0.7rem; color: #444; }
        .edu-date { font-size: 0.68rem; color: #888; margin-top: 1px; }

        /* Contact */
        .contact-links { display: flex; flex-direction: column; gap: 5px; }
        .contact-links a {
          font-size: 0.78rem; color: #222; text-decoration: none; font-weight: 600;
          transition: color 0.2s; border-bottom: 1px solid transparent;
          display: inline-block; align-self: flex-start;
        }
        .contact-links a:hover { color: #E63946; border-bottom-color: #E63946; }
        .contact-link-btn {
          font-family: 'Inter', sans-serif; font-size: 0.78rem; color: #999;
          background: none; border: none; padding: 0; cursor: not-allowed;
          font-weight: 600; text-align: left;
        }

        /* Canvas */
        .canvas-main { padding: 0; }
        .canvas-controls {
          position: absolute; bottom: 12px; right: 12px;
          display: flex; gap: 4px; z-index: 10;
        }
        .canvas-btn {
          font-family: 'Inter', sans-serif; font-size: 0.55rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.04em;
          padding: 4px 6px; border: 1px solid #111;
          background: #FDFBF7; color: #111; cursor: pointer; transition: all 0.2s;
        }
        .canvas-btn:hover { background: #111; color: #FDFBF7; }
        .canvas-btn.active { background: #E63946; border-color: #E63946; color: #fff; }

        /* Decorative geometry */
        .hero::after {
          content: ''; position: absolute; right: 1rem; top: 1rem;
          width: 28px; height: 28px; background: #F4D35E;
        }
        .contact::before {
          content: ''; position: absolute; left: 1rem; bottom: 1rem;
          width: 20px; height: 20px; border: 3px solid #1D3557;
        }

        /* Grid placement */
        .hero { grid-column: 1 / 2; grid-row: 1 / 2; }
        .experience { grid-column: 2 / 3; grid-row: 1 / 2; }
        .canvas-main { grid-column: 3 / 5; grid-row: 1 / 3; }
        .projects { grid-column: 1 / 2; grid-row: 2 / 3; }
        .detail { grid-column: 2 / 3; grid-row: 2 / 4; }
        .skills { grid-column: 1 / 2; grid-row: 3 / 4; }
        .education { grid-column: 3 / 4; grid-row: 3 / 4; }
        .contact { grid-column: 4 / 5; grid-row: 3 / 4; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          html, body { overflow-y: auto; height: auto; }
          #root { height: auto; min-height: 100vh; }

          .bauhaus-frame {
            width: 100%;
            height: auto;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto auto 140px auto auto;
            border-width: 3px;
          }

          /* Hero: full width banner */
          .hero { grid-column: 1 / 3; grid-row: 1; }
          .hero h1 { font-size: 2.4rem; }
          .hero h2 { font-size: 0.85rem; }
          .hero p  { font-size: 0.82rem; }

          /* Experience + Projects side by side */
          .experience { grid-column: 1 / 2; grid-row: 2; }
          .projects   { grid-column: 2 / 3; grid-row: 2; }

          /* Detail: full-width panel below lists */
          .detail { grid-column: 1 / 3; grid-row: 3; }

          /* Canvas: thin generative strip below focus */
          .canvas-main { grid-column: 1 / 3; grid-row: 4; }

          /* Education + Contact side by side */
          .education { grid-column: 1 / 2; grid-row: 5; }
          .contact   { grid-column: 2 / 3; grid-row: 5; }

          /* Skills: full width at the bottom */
          .skills { grid-column: 1 / 3; grid-row: 6; }

          /* Panel adjustments */
          .panel { padding: 1rem; }
          .list-item { padding: 7px 0; }
          .detail-content { height: auto; }
          .detail-desc { flex: none; overflow: visible; }
        }
      `}</style>

      <div className="bauhaus-frame">
        {/* HERO */}
        <div className="panel hero">
          <div className="panel-label">Identity</div>
          <h1>
            Simon
            <br />
            Weigold
          </h1>
          <h2>
            Software Engineer &amp;
            <br />
            Computational Social Scientist
          </h2>
          <p>Building tools at the intersection of law, language, and machine learning.</p>
          <p>
            Away from the screen:{" "}
            <a href="https://trailventure.net" target="_blank" rel="noopener noreferrer">
              Trailventure →
            </a>
          </p>
        </div>

        {/* EXPERIENCE */}
        <div className="panel experience">
          <div className="panel-label">Experience</div>
          <ul className="list">
            {experiences.map((exp, idx) => (
              <li
                key={exp.id}
                className={`list-item ${activeExp === idx && activeProj === null ? "active" : ""}`}
                onClick={() => selectExp(idx)}
              >
                <div className="exp-line">
                  <span>{exp.role}</span>
                  <span className="exp-date">{exp.date}</span>
                </div>
                <span className="meta">{exp.company}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CANVAS */}
        <div className="panel canvas-main">
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#777", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, background: "#E63946" }} /> Art Engine
          </div>
          <GenerativeCanvas mode={canvasMode} />
          <div className="canvas-controls">
            {/*{["noise", "wave", "mouse"].map((m) => (*/}
            {["noise"].map((m) => (
              <button
                key={m}
                className={`canvas-btn ${canvasMode === m ? "active" : ""}`}
                onClick={() => setCanvasMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="panel projects">
          <div className="panel-label">Projects</div>
          <ul className="list">
            {projects.map((proj, idx) => (
              <li
                key={proj.id}
                className={`list-item ${activeProj === idx ? "active" : ""}`}
                onClick={() => selectProj(idx)}
              >
                {proj.title}
              </li>
            ))}
          </ul>
        </div>

        {/* DETAIL */}
        <div ref={detailRef} className="panel detail">
          <div className="panel-label">Focus</div>
          {detailData ? (
            <div key={detailData.id} className="detail-content detail-animate">
              <div
                className="detail-label"
                style={{ color: detailData.type === "project" ? "#1D3557" : "#E63946" }}
              >
                {detailData.type}
              </div>
              <div className="detail-title">
                {detailData.type === "project" ? detailData.title : (detailData as typeof experiences[0]).role}
              </div>
              <div className="detail-sub">
                {detailData.type === "project"
                  ? detailData.link.replace("https://", "").replace("http://", "")
                  : (
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                      <span>{(detailData as typeof experiences[0]).company}</span>
                      <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>{(detailData as typeof experiences[0]).date}</span>
                    </span>
                  )}
              </div>
              <div className="detail-desc">{detailData.desc}</div>
              <div className="detail-tags">
                {(detailData.type === "project"
                  ? (detailData as typeof projects[0]).tech
                  : (detailData as typeof experiences[0]).skills
                ).map((t) => (
                  <span key={t} className="detail-tag">
                    {t}
                  </span>
                ))}
              </div>
              {detailData.type === "project" && (
                <a
                  href={(detailData as typeof projects[0]).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-link"
                >
                  Visit Project →
                </a>
              )}
            </div>
          ) : (
            <div className="detail-content">
              <div className="detail-desc" style={{ color: "#777" }}>
                Select an experience or project to inspect details.
              </div>
            </div>
          )}
        </div>

        {/* SKILLS */}
        <div className="panel skills" onClick={() => { setActiveExp(null); setActiveProj(null); }} style={{ cursor: activeSkillSet ? "pointer" : "default" }}>
          <div className="panel-label">Stack</div>
          <div className="skills-cloud">
            {skills.map((s) => {
              const cat = skillCategory(s);
              const isDimmed = activeSkillSet !== null && !activeSkillSet.has(s);
              return (
                <span key={s} className={`skill-tag ${cat}${isDimmed ? " dimmed" : ""}`}>
                  {s}
                </span>
              );
            })}
          </div>
        </div>

        {/* EDUCATION */}
        <div className="panel education">
          <div className="panel-label">Education</div>
          <div className="edu-item">
            <div className="edu-degree">MA Computational Social Sciences</div>
            <div className="edu-school">University of Lucerne</div>
            <div className="edu-date">2022 – 2024</div>
          </div>
          <div className="edu-item">
            <div className="edu-degree">BA Media Management</div>
            <div className="edu-school">HMTM Hannover</div>
            <div className="edu-date">2019 – 2022</div>
          </div>
        </div>

        {/* CONTACT */}
        <div className="panel contact">
          <div className="panel-label">Link</div>
          <div className="contact-links">
            <a href="https://github.com/simonweigold" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://trailventure.net" target="_blank" rel="noopener noreferrer">
              Trailventure
            </a>
            <a href="https://linkedin.com/in/simonweigold" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="mailto:simonw750@gmail.com">Email</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
