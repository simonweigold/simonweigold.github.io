import { useState, useEffect, useRef, type CSSProperties, type FormEvent } from 'react';
import { signIn, AuthError, type Session } from './auth';

/* ─── DATA ─── */
const experiences = [
  {
    id: "e1",
    role: "Software Engineer",
    company: "Coop Rechtsschutz",
    date: "2025 – Present",
    desc: "Helping legal professionals work more efficiently via modern web stacks and cloud infrastructure.",
    skills: ["Python", "FastAPI", "Google ADK", "JavaScript", "Vue", "Databases", "PostgreSQL", "Knowledge Graphs", "DevOps", "Git", "Docker", "Terraform", "GCP"],
  },
  {
    id: "e2",
    role: "Data Engineer",
    company: "University of Lucerne",
    date: "2023 – 2025",
    desc: "Building an online platform for legal data ingestion, processing, and distribution.",
    skills: ["Python", "FastAPI", "Databases", "PostgreSQL", "Airtable", "Azure", "SCRUM"],
  },
  {
    id: "e3",
    role: "NLP Researcher",
    company: "University of Lucerne",
    date: "2024",
    desc: "Applied BERT to research digital payments from a sociological perspective.",
    skills: ["Python", "PyTorch", "Data Science", "NLP", "BERT", "Databases", "PostgreSQL", "DevOps", "Azure"],
  },
  {
    id: "e4",
    role: "Junior Data Scientist",
    company: "aserto",
    date: "2020 – 2023",
    desc: "Evidence-based business analytics. Rised from intern to junior, delivering insights with R and SPSS.",
    skills: ["R", "SPSS", "VBA", "Data Science", "Statistics", "Data Visualization"],
  },
  {
    id: "e5",
    role: "Market Research Intern",
    company: "Ipsos",
    date: "2021",
    desc: "Quantitative market research delivering insights to FMCG and innovation clients.",
    skills: ["Quantitative Research", "Market Analysis", "Statistics", "Data Visualization"],
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
  "Python","Pandas","NumPy","SciPy","Scikit-learn","Keras","PyTorch","Langchain","Langgraph","Google ADK",
  "FastAPI","Flask","Pydantic","Pytest","R","Tidyverse","Shiny","JavaScript","React","Nuxt",
  "Vue","Express","Databases","PostgreSQL","SQL Server","MongoDB","Knowledge Graphs","DevOps","Terraform","Git","Docker","Kubernetes",
  "Azure","GCP","Cloudflare","Data Science","NLP","Network Analysis","Statistics",
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
function GenerativeCanvas({ mode, active = true }: { mode: string; active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const noiseRef = useRef(new PerlinNoise());
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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
      if (!activeRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
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

/* ─── ADMIN FLOW ─── */
type Phase =
  | "portfolio"
  | "grid-exit"
  | "login"
  | "login-exit"
  | "success"
  | "login-rise"
  | "dashboard"
  | "dashboard-exit";

const DASH_WIDGETS = [
  { label: "CPU", delay: 90 },
  { label: "Memory", delay: 150 },
  { label: "Disk", delay: 210 },
  { label: "Network", delay: 270 },
];

/* Dummy cluster data — will come from the hosted backend later. */
const clusterMachines = [
  { name: "Rechner", online: true, cpu: 18 },
  { name: "Lakai", online: true, cpu: 42 },
  { name: "Entbehrlich", online: false, cpu: 0 },
  { name: "Pixel 10", online: true, cpu: 7 },
  { name: "Mac", online: false, cpu: 0 },
];

function LoginOverlay({
  exitDir,
  success,
  onSuccess,
  onBack,
}: {
  exitDir: "none" | "down" | "up";
  success: boolean;
  onSuccess: (s: Session) => void;
  onBack: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeTick, setShakeTick] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  /* Restart the shake animation on each failed attempt */
  useEffect(() => {
    if (shakeTick === 0) return;
    const el = shakeRef.current;
    if (el) {
      el.classList.remove("shake");
      void el.offsetWidth;
      el.classList.add("shake");
    }
    passwordRef.current?.focus();
  }, [shakeTick]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || success) return;
    setSubmitting(true);
    setError(null);
    try {
      const s = await signIn(email, password);
      onSuccess(s);
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof AuthError ? err.message : "Something went wrong. Try again."
      );
      setShakeTick((t) => t + 1);
    }
  };

  const panelClass =
    "login-panel" +
    (exitDir === "down" ? " exit-down" : exitDir === "up" ? " exit-up" : "") +
    (error ? " has-error" : "") +
    (success ? " is-success" : "");

  const btnState = success ? "granted" : submitting ? "verifying" : "idle";
  const btnText = success ? "Access granted" : submitting ? "Verifying" : "Sign in";

  return (
    <div className="overlay-layer" role="dialog" aria-modal="true" aria-label="Admin login">
      <div className={panelClass}>
        <div ref={shakeRef}>
          <div className="panel-label">Admin</div>
          <h2 className="login-title">Sign in</h2>
          <p className="login-sub">Restricted area — portfolio control room.</p>
          <form onSubmit={handleSubmit}>
            <div className="field f-email">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                ref={emailRef}
                type="email"
                required
                autoComplete="username"
                value={email}
                disabled={submitting || success}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </div>
            <div className="field f-pass">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                ref={passwordRef}
                type="password"
                required
                autoComplete="current-password"
                value={password}
                disabled={submitting || success}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
              />
            </div>
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className={`login-submit ${btnState}`} disabled={submitting || success}>
              <span key={btnText} className="btn-swap">
                {submitting && !success && <span className="btn-spinner" aria-hidden="true" />}
                {btnText}
              </span>
            </button>
          </form>
          <div className="login-foot">
            <button type="button" className="back-link" onClick={onBack} disabled={submitting || success}>
              ← Back to portfolio
            </button>
            <span className="demo-hint">Demo build — any email, password 8+ chars</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardOverlay({
  session,
  exiting,
  onLogout,
}: {
  session: Session;
  exiting: boolean;
  onLogout: () => void;
}) {
  return (
    <div className={`dash-layer${exiting ? " exiting" : ""}`} role="dialog" aria-modal="true" aria-label="Admin dashboard">
      <div className="dash-panel dash-header" style={{ "--d": "0ms" } as CSSProperties}>
        <div className="dash-title-wrap">
          <span className="dash-red-square" aria-hidden="true" />
          <span className="dash-title">Admin Dashboard</span>
        </div>
        <span className="dash-session">{session.email}</span>
        <button className="logout-btn" onClick={onLogout}>
          Log out
        </button>
        <span className="dash-yellow" aria-hidden="true" />
      </div>
      {DASH_WIDGETS.map((w) => (
        <div key={w.label} className="dash-panel" style={{ "--d": `${w.delay}ms` } as CSSProperties}>
          <div className="panel-label">{w.label}</div>
          <div className="dash-empty">
            <span className="dash-dash">—</span>
            <span className="dash-note">No data source yet</span>
          </div>
        </div>
      ))}
      <div className="dash-panel dash-services" style={{ "--d": "330ms" } as CSSProperties}>
        <div className="panel-label">Services</div>
        <div className="dash-empty">
          <span className="dash-dash">—</span>
          <span className="dash-note">Connects to the hosted backend — see docs/admin-dashboard.md</span>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ─── */
function App() {
  const [activeExp, setActiveExp] = useState<number | null>(null);
  const [activeProj, setActiveProj] = useState<number | null>(null);
  const [canvasMode, setCanvasMode] = useState("noise");
  const detailRef = useRef<HTMLDivElement>(null);

  /* Admin flow: scene state machine */
  const [phase, setPhase] = useState<Phase>("portfolio");
  const [session, setSession] = useState<Session | null>(null);
  const [returning, setReturning] = useState(false);
  const timersRef = useRef<number[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  const away = phase !== "portfolio";

  const after = (ms: number, fn: () => void) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => () => timersRef.current.forEach((t) => window.clearTimeout(t)), []);

  const openLogin = () => {
    if (phase !== "portfolio") return;
    setPhase("grid-exit");
    after(960, () => setPhase("login"));
  };

  const backToPortfolio = () => {
    if (phase !== "login") return;
    setPhase("login-exit");
    after(300, () => {
      setPhase("portfolio");
      setReturning(true);
      after(1200, () => setReturning(false));
    });
  };

  const handleLoginSuccess = (s: Session) => {
    setSession(s);
    setPhase("success");
    after(820, () => setPhase("login-rise"));
    after(1140, () => setPhase("dashboard"));
  };

  const logout = () => {
    setPhase("dashboard-exit");
    after(300, () => {
      setSession(null);
      setPhase("login");
    });
  };

  /* Lock scrolling while the grid is away */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("locked", away);
    return () => root.classList.remove("locked");
  }, [away]);

  /* Remove the hidden grid from keyboard/AT navigation */
  useEffect(() => {
    frameRef.current?.toggleAttribute("inert", away);
  }, [away]);

  /* Restore focus to the admin button when the grid returns */
  const wasAwayRef = useRef(false);
  useEffect(() => {
    if (!away && wasAwayRef.current) openBtnRef.current?.focus();
    wasAwayRef.current = away;
  }, [away]);

  /* Escape closes the login */
  useEffect(() => {
    if (phase !== "login") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") backToPortfolio();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
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
          grid-template-rows: auto 1.4fr 1fr 1fr;
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
        .proj-line { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
        .proj-link {
          font-size: 0.72rem; color: #aaa; text-decoration: none; flex-shrink: 0;
          opacity: 0; transition: opacity 0.15s ease;
          line-height: 1;
        }
        .list-item:hover .proj-link { opacity: 1; color: #E63946; }
        .list-item.active .proj-link { opacity: 1; color: #E63946; }

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

        /* ── Admin flow: scene transitions ── */
        :root {
          --ease-out-strong: cubic-bezier(0.16, 1, 0.3, 1);
          --ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
          --font-mono: 'JetBrains Mono', ui-monospace, monospace;
        }
        html.locked, html.locked body { overflow: hidden !important; }

        .bauhaus-frame { overflow: hidden; }
        .panel {
          transition: transform 480ms var(--ease-exit), opacity 340ms ease;
        }
        .bauhaus-frame.away { pointer-events: none; }
        .bauhaus-frame.away .panel { opacity: 0; will-change: transform, opacity; }
        .bauhaus-frame.away .hero        { transform: translateX(-115%); }
        .bauhaus-frame.away .experience  { transform: translateY(-115%); }
        .bauhaus-frame.away .canvas-main { transform: translateX(115%); }
        .bauhaus-frame.away .projects    { transform: translateX(-115%); }
        .bauhaus-frame.away .detail      { transform: translateY(115%); }
        .bauhaus-frame.away .skills      { transform: translateX(-115%); }
        .bauhaus-frame.away .education   { transform: translateY(115%); }
        .bauhaus-frame.away .contact     { transform: translateX(115%); }

        /* Exits ripple outward from the admin panel (top-right) */
        .bauhaus-frame.to-void .admin       { transition-delay: 0ms; }
        .bauhaus-frame.to-void .contact     { transition-delay: 45ms; }
        .bauhaus-frame.to-void .canvas-main { transition-delay: 90ms; }
        .bauhaus-frame.to-void .education   { transition-delay: 135ms; }
        .bauhaus-frame.to-void .detail      { transition-delay: 180ms; }
        .bauhaus-frame.to-void .experience  { transition-delay: 225ms; }
        .bauhaus-frame.to-void .projects    { transition-delay: 270ms; }
        .bauhaus-frame.to-void .skills      { transition-delay: 315ms; }
        .bauhaus-frame.to-void .hero        { transition-delay: 360ms; }

        /* Re-entry: hero returns first, the admin door closes last */
        .bauhaus-frame.from-void .panel {
          transition: transform 640ms var(--ease-out-strong), opacity 480ms ease;
        }
        .bauhaus-frame.from-void .hero        { transition-delay: 0ms; }
        .bauhaus-frame.from-void .projects    { transition-delay: 60ms; }
        .bauhaus-frame.from-void .skills      { transition-delay: 120ms; }
        .bauhaus-frame.from-void .experience  { transition-delay: 180ms; }
        .bauhaus-frame.from-void .detail      { transition-delay: 240ms; }
        .bauhaus-frame.from-void .education   { transition-delay: 300ms; }
        .bauhaus-frame.from-void .canvas-main { transition-delay: 360ms; }
        .bauhaus-frame.from-void .contact     { transition-delay: 420ms; }
        .bauhaus-frame.from-void .admin       { transition-delay: 480ms; }

        /* Admin grid panel — compact console entry */
        .panel.admin .panel-label {
          color: #777; font-family: var(--font-mono); margin-bottom: 0.5rem;
        }

        /* Cluster status */
        .cluster {
          list-style: none; flex: 1; display: flex; align-items: center;
          justify-content: center; gap: 10px; margin: 0; padding: 0;
        }
        .cluster-node {
          display: flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 0.62rem;
          text-transform: uppercase; letter-spacing: 0.04em; color: #333;
          white-space: nowrap;
        }
        .cluster-dot { width: 6px; height: 6px; background: #2f9e44; flex-shrink: 0; }
        .cluster-metric { color: #999; }
        .cluster-node.offline { color: #b0ada6; }
        .cluster-node.offline .cluster-dot { background: transparent; border: 1px solid #bbb; }
        .cluster-node.offline .cluster-metric { color: #c4c4c4; }
        .cluster-bar { display: none; }

        /* Variant: load bars */
        .cluster { gap: 22px; }
        .cluster-node { gap: 7px; }
        .cluster-dot { width: 8px; height: 8px; }
        .cluster-metric { min-width: 32px; text-align: right; }
        .cluster-bar {
          display: block; width: 44px; height: 4px;
          background: #ece9e2; overflow: hidden; flex-shrink: 0;
        }
        .cluster-node.offline .cluster-bar { display: none; }
        .cluster-bar-fill { display: block; height: 100%; width: var(--load, 0%); background: #2f9e44; }

        .admin-open-btn {
          margin-top: auto; width: 100%;
          font-family: var(--font-mono); font-size: 0.62rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 8px 10px; background: transparent; color: #141417;
          border: 1px solid #141417; cursor: pointer;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }
        .admin-open-btn:hover { background: #141417; color: #e0af68; }
        .admin-open-btn:active { transform: scale(0.97); }
        .admin-open-btn:focus-visible { outline: 2px solid #e0af68; outline-offset: 2px; }

        /* Login overlay */
        .overlay-layer {
          position: fixed; inset: 0; z-index: 60;
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          font-family: var(--font-mono);
        }
        .login-panel {
          width: min(420px, 100%);
          background: #141417;
          border: 1px solid #2b2b33;
          padding: 1.6rem 1.75rem 1.25rem;
          position: relative;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
          animation: loginIn 440ms var(--ease-out-strong) both;
        }
        .login-panel.exit-down { animation: loginOutDown 240ms var(--ease-exit) both; }
        .login-panel.exit-up { animation: loginOutUp 260ms var(--ease-exit) both; }
        .login-panel::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 2px; background: #e0af68;
        }
        .login-panel .panel-label { color: #8b8b96; font-family: var(--font-mono); }
        .login-panel .panel-label::before { background: #e0af68; }
        .login-title {
          font-family: var(--font-mono); font-size: 1.15rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #e8e8ec; margin: 0 0 0.15rem;
        }
        .login-sub { font-size: 0.72rem; color: #6b6b76; margin: 0 0 1.2rem; }

        .login-panel .panel-label,
        .login-panel .login-title,
        .login-panel .login-sub,
        .login-panel .field,
        .login-panel .login-submit,
        .login-panel .login-foot {
          animation: riseIn 380ms var(--ease-out-strong) both;
        }
        .login-panel .panel-label  { animation-delay: 110ms; }
        .login-panel .login-title  { animation-delay: 150ms; }
        .login-panel .login-sub    { animation-delay: 190ms; }
        .login-panel .f-email      { animation-delay: 240ms; }
        .login-panel .f-pass       { animation-delay: 285ms; }
        .login-panel .login-submit { animation-delay: 335ms; }
        .login-panel .login-foot   { animation-delay: 375ms; }

        .field { margin-bottom: 0.85rem; transition: opacity 300ms ease; }
        .field label {
          display: block; font-size: 0.6rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: #8b8b96; margin-bottom: 4px;
        }
        .field input {
          width: 100%; padding: 10px 12px;
          font-family: var(--font-mono); font-size: 0.82rem; color: #e8e8ec;
          background: #1b1b21; border: 1px solid #33333d; border-radius: 0;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }
        .field input:focus { outline: none; border-color: #e0af68; box-shadow: 0 0 0 1px rgba(224, 175, 104, 0.3); }
        .field input:disabled { opacity: 0.5; }
        .login-panel.has-error .field input { border-color: #f38ba8; }
        .login-panel.is-success .field { opacity: 0.35; }

        .login-error {
          display: flex; align-items: flex-start; gap: 6px;
          font-size: 0.7rem; font-weight: 600; color: #f38ba8;
          margin: 0 0 0.85rem; line-height: 1.35;
        }
        .login-error::before {
          content: ''; width: 8px; height: 8px; flex-shrink: 0;
          background: #f38ba8; margin-top: 3px;
        }

        .login-submit {
          width: 100%; padding: 12px;
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          background: #e0af68; color: #141417; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 160ms ease, transform 160ms ease;
        }
        .login-submit:hover:not(:disabled) { background: #eec27f; }
        .login-submit:active:not(:disabled) { transform: scale(0.98); }
        .login-submit:disabled { cursor: wait; }
        .login-submit.granted { background: #9ece6a; color: #141417; cursor: default; }
        .login-submit:focus-visible { outline: 2px solid #e0af68; outline-offset: 2px; }
        .btn-swap {
          display: inline-flex; align-items: center; gap: 8px;
          animation: btnSwap 180ms var(--ease-out-strong) both;
        }
        .btn-spinner {
          width: 8px; height: 8px; background: currentColor;
          animation: spinSquare 900ms cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }

        .login-foot {
          display: flex; flex-direction: column; align-items: flex-start;
          margin-top: 1rem; gap: 6px;
        }
        .back-link {
          font-family: var(--font-mono); font-size: 0.64rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          background: none; border: none; padding: 0; cursor: pointer;
          color: #6b6b76; border-bottom: 1px solid transparent;
          transition: color 150ms ease, border-color 150ms ease;
        }
        .back-link:hover:not(:disabled) { color: #e0af68; border-bottom-color: #e0af68; }
        .back-link:disabled { opacity: 0.4; cursor: default; }
        .back-link:focus-visible { outline: 2px solid #e0af68; outline-offset: 2px; }
        .demo-hint { font-size: 0.6rem; color: #55555e; }
        .shake { animation: shake 380ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }

        /* Dashboard overlay */
        .dash-layer {
          position: fixed; inset: 0; z-index: 60;
          background: #0c0c0e; border: 4px solid #0c0c0e;
          display: grid; gap: 1px;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: auto 1fr 1fr;
          font-family: var(--font-mono);
        }
        .dash-panel {
          background: #141417; padding: 1.25rem; position: relative;
          display: flex; flex-direction: column;
          animation: dashIn 440ms var(--ease-out-strong) both;
          animation-delay: var(--d, 0ms);
        }
        .dash-layer.exiting .dash-panel {
          animation: dashOut 220ms var(--ease-exit) both;
          animation-delay: 0ms;
        }
        .dash-header {
          grid-column: 1 / -1;
          flex-direction: row; align-items: center; gap: 12px;
          padding: 0.9rem 1.25rem;
        }
        .dash-title-wrap { display: flex; align-items: center; gap: 8px; }
        .dash-red-square { width: 8px; height: 8px; background: #e0af68; }
        .dash-title {
          font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: #e8e8ec;
        }
        .dash-panel .panel-label { color: #8b8b96; font-family: var(--font-mono); }
        .dash-panel .panel-label::before { background: #e0af68; }
        .dash-session { margin-left: auto; font-size: 0.7rem; color: #6b6b76; }
        .logout-btn {
          font-family: var(--font-mono); font-size: 0.62rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 7px 12px; background: transparent; color: #ccc;
          border: 1px solid #33333d; cursor: pointer;
          transition: background 150ms ease, color 150ms ease,
                      border-color 150ms ease, transform 150ms ease;
        }
        .logout-btn:hover { background: #e0af68; border-color: #e0af68; color: #141417; }
        .logout-btn:active { transform: scale(0.97); }
        .logout-btn:focus-visible { outline: 2px solid #e0af68; outline-offset: 2px; }
        .dash-yellow { width: 14px; height: 14px; background: #e0af68; flex-shrink: 0; }
        .dash-services { grid-column: 1 / -1; }
        .dash-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
        }
        .dash-dash { font-size: 1.8rem; font-weight: 400; color: #3a3a44; line-height: 1; }
        .dash-note { font-size: 0.6rem; color: #55555e; text-align: center; }

        /* Keyframes */
        @keyframes loginIn {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes loginOutDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
        @keyframes loginOutUp {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-12px) scale(0.99); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
        }
        @keyframes spinSquare {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg) scale(0.75); }
          100% { transform: rotate(360deg); }
        }
        @keyframes btnSwap {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dashIn {
          from { opacity: 0; transform: translateY(16px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dashOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(8px); }
        }
        @keyframes fadeOnly { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOutOnly { from { opacity: 1; } to { opacity: 0; } }

        /* Reduced motion: fades only, no movement */
        @media (prefers-reduced-motion: reduce) {
          .panel, .bauhaus-frame.from-void .panel {
            transition: opacity 160ms ease !important;
          }
          .bauhaus-frame.away .panel { transform: none !important; }
          .login-panel { animation: fadeOnly 160ms ease both !important; }
          .login-panel.exit-down, .login-panel.exit-up {
            animation: fadeOutOnly 160ms ease both !important;
          }
          .login-panel .panel-label, .login-panel .login-title,
          .login-panel .login-sub, .login-panel .field,
          .login-panel .login-submit, .login-panel .login-foot {
            animation: none !important;
          }
          .dash-panel { animation: fadeOnly 160ms ease both !important; }
          .dash-layer.exiting .dash-panel { animation: fadeOutOnly 160ms ease both !important; }
          .shake { animation: none !important; }
          .btn-swap { animation: none !important; }
          .btn-spinner { animation-duration: 1600ms !important; }
        }

        /* Grid placement — top control band */
        .admin { grid-column: 1 / 5; grid-row: 1 / 2; }
        .hero { grid-column: 1 / 2; grid-row: 2 / 3; }
        .experience { grid-column: 2 / 3; grid-row: 2 / 3; }
        .canvas-main { grid-column: 3 / 5; grid-row: 2 / 4; }
        .projects { grid-column: 1 / 2; grid-row: 3 / 4; }
        .detail { grid-column: 2 / 3; grid-row: 3 / 5; }
        .skills { grid-column: 1 / 2; grid-row: 4 / 5; }
        .education { grid-column: 3 / 4; grid-row: 4 / 5; }
        .contact { grid-column: 4 / 5; grid-row: 4 / 5; }

        /* Admin control bar */
        .panel.admin { flex-direction: row; align-items: center; gap: 1.25rem; padding: 0.8rem 1.25rem; }
        .panel.admin .panel-label { margin-bottom: 0; }
        .panel.admin .admin-open-btn { margin-top: 0; margin-left: auto; width: auto; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          html, body { overflow-y: auto; height: auto; }
          #root { height: auto; min-height: 100vh; }

          .bauhaus-frame {
            width: 100%;
            height: auto;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto auto 140px auto auto auto;
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

          /* Admin: compact horizontal strip */
          .admin { grid-column: 1 / 3; grid-row: 6; }
          .panel.admin { flex-direction: row; align-items: center; gap: 10px; flex-wrap: wrap; row-gap: 8px; }
          .panel.admin .panel-label { margin-bottom: 0; }
          .admin-open-btn { margin-top: 0; margin-left: auto; width: auto; }
          .cluster { flex-basis: 100%; order: 3; justify-content: flex-start; overflow-x: auto; }

          /* Skills: full width at the bottom */
          .skills { grid-column: 1 / 3; grid-row: 7; }

          /* Panel adjustments */
          .panel { padding: 1rem; }
          .list-item { padding: 7px 0; }
          .detail-content { height: auto; }
          .detail-desc { flex: none; overflow: visible; }

          /* Dashboard overlay stacks on mobile */
          .dash-layer {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto minmax(140px, 1fr) minmax(140px, 1fr) minmax(140px, auto);
            overflow-y: auto;
          }
          .dash-session { display: none; }
        }
      `}</style>

      <div
        ref={frameRef}
        className={`bauhaus-frame${away ? " away" : ""}${phase === "grid-exit" ? " to-void" : ""}${returning ? " from-void" : ""}`}
      >
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
          <GenerativeCanvas mode={canvasMode} active={!away} />
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

        {/* ADMIN */}
        <div className="panel admin">
          <div className="panel-label">Server Control</div>
          <ul className="cluster" aria-label="Cluster status">
            {clusterMachines.map((m) => (
              <li
                key={m.name}
                className={`cluster-node${m.online ? "" : " offline"}`}
                style={{ "--load": `${m.cpu}%` } as CSSProperties}
              >
                <span className="cluster-dot" aria-hidden="true" />
                <span className="cluster-name">{m.name}</span>
                <span className="cluster-metric">{m.online ? `${m.cpu}%` : "offline"}</span>
                <span className="cluster-bar" aria-hidden="true">
                  <span className="cluster-bar-fill" />
                </span>
              </li>
            ))}
          </ul>
          <button ref={openBtnRef} className="admin-open-btn" onClick={openLogin}>
            Open Login
          </button>
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
                <div className="proj-line">
                  <span>{proj.title}</span>
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ↗
                  </a>
                </div>
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

      {(phase === "login" || phase === "login-exit" || phase === "success" || phase === "login-rise") && (
        <LoginOverlay
          exitDir={phase === "login-exit" ? "down" : phase === "login-rise" ? "up" : "none"}
          success={phase === "success" || phase === "login-rise"}
          onSuccess={handleLoginSuccess}
          onBack={backToPortfolio}
        />
      )}
      {(phase === "dashboard" || phase === "dashboard-exit") && session && (
        <DashboardOverlay
          session={session}
          exiting={phase === "dashboard-exit"}
          onLogout={logout}
        />
      )}
    </>
  );
}

export default App;
