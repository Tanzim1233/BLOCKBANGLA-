import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Award, Check, Clock, Compass, Copy, Menu, Plus, Radio, RefreshCw, Search, Server, Wrench, X
} from 'lucide-react';

// ============================================================================
// 0. Formspree contact integration
// ============================================================================
// Submission text checks
// ============================================================================
// Formspree contact integration.
const FORMSPREE_FORM_ID = 'xkjjdnpr';
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

function useFormspree(formId = FORMSPREE_FORM_ID) {
  const [state, setState] = useState({
    submitting: false,
    succeeded: false,
    errors: []
  });

  const handleSubmit = useCallback(
    async (eOrPayload) => {
      if (eOrPayload && typeof eOrPayload.preventDefault === 'function') {
        eOrPayload.preventDefault();
      }
      setState({ submitting: true, succeeded: false, errors: [] });

      let bodyData;
      const headers = { Accept: 'application/json' };

      if (eOrPayload?.target && eOrPayload.target instanceof HTMLFormElement) {
        bodyData = new FormData(eOrPayload.target);
      } else {
        headers['Content-Type'] = 'application/json';
        bodyData = JSON.stringify(eOrPayload || {});
      }

      try {
        const response = await fetch(`https://formspree.io/f/${formId}`, {
          method: 'POST',
          headers,
          body: bodyData
        });
        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          setState({ submitting: false, succeeded: true, errors: [] });
          return { ok: true, data };
        } else {
          const errList = Array.isArray(data?.errors)
            ? data.errors
            : [{ field: 'form', message: data?.error || 'Submission failed. Please check your inputs.' }];
          setState({ submitting: false, succeeded: false, errors: errList });
          return { ok: false, errors: errList };
        }
      } catch (err) {
        const netErr = [{ field: 'form', message: 'Network error while reaching Formspree.' }];
        setState({ submitting: false, succeeded: false, errors: netErr });
        return { ok: false, errors: netErr };
      }
    },
    [formId]
  );

  const resetForm = useCallback(() => {
    setState({ submitting: false, succeeded: false, errors: [] });
  }, []);

  return [state, handleSubmit, resetForm];
}

const FormspreeValidationError = ({ prefix = 'Field', field, errors = [] }) => {
  if (!Array.isArray(errors) || errors.length === 0) return null;
  const matching = field
    ? errors.filter((e) => e.field === field)
    : errors.filter((e) => !e.field || e.field === 'form');
  if (matching.length === 0) return null;
  return (
    <div className="text-[11px] font-mono-code text-rose-400 mt-1 space-y-0.5" role="alert">
      {matching.map((err, idx) => (
        <div key={idx}>
          Error: {prefix}: {err.message}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// 0.05 Brand styles
// ============================================================================
const V2GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

    :root {
      color-scheme: light;
      --font-display: 'Space Grotesk', 'Noto Sans Bengali', sans-serif;
      --font-sans: 'Noto Sans Bengali', 'Space Grotesk', sans-serif;
      --font-mono: 'IBM Plex Mono', monospace;
      --bb-paper: #f3efe4;
      --bb-surface: #fbf9f2;
      --bb-raised: #e8e4d8;
      --bb-ink: #183326;
      --bb-muted: #59695d;
      --bb-forest: #1e5138;
      --bb-clay: #a94f32;
      --bb-rule: #c9d0c4;
    }

    html, body {
      margin: 0;
      min-height: 100%;
      max-width: 100%;
      overflow-x: hidden;
      background: var(--bb-paper);
      color: var(--bb-ink);
      scroll-behavior: smooth;
    }
    button, input, textarea, select { font: inherit; }
    button, a { -webkit-tap-highlight-color: transparent; }
    .font-display { font-family: var(--font-display); }
    .font-sans-bd { font-family: var(--font-sans); }
    .font-mono-code, .font-pixel-hud { font-family: var(--font-mono); letter-spacing: 0.02em; }

    .bb-app {
      isolation: isolate;
      color: var(--bb-ink);
      background: var(--bb-paper);
    }
    .bb-app h1, .bb-app h2, .bb-app h3, .bb-app h4 {
      color: var(--bb-ink);
      font-family: var(--font-display);
      letter-spacing: -0.035em;
      text-wrap: balance;
    }
    .bb-app main h1 { font-size: clamp(2.65rem, 5.7vw, 5.35rem); line-height: 1.02; }
    .bb-app main h2 { font-size: clamp(1.65rem, 3vw, 2.45rem); line-height: 1.12; }
    .bb-app p { line-height: 1.7; }
    .bb-app img { max-width: 100%; }
    .shader-void-bg { background: var(--bb-paper) !important; }
    .perspective-iso-floor { display: none !important; }

    .bb-header {
      top: 0 !important;
      max-width: none !important;
      padding: 0 clamp(12px, 3vw, 40px) !important;
    }
    .bb-header > div:first-child {
      max-width: 1440px;
      margin: 0 auto;
      border: 0 !important;
      border-bottom: 1px solid var(--bb-rule) !important;
      border-radius: 0 !important;
      background: var(--bb-paper) !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
    }
    .bb-header [class*="border-white/"], .bb-header [class*="border-slate-"] { border-color: var(--bb-rule) !important; }
    .bb-header [class*="bg-white/"] { background: rgba(30, 81, 56, 0.06) !important; }
    .bb-header [class*="bg-black/"] { background: var(--bb-paper) !important; }
    .bb-header [class*="text-white"], .bb-header [class*="text-slate-100"], .bb-header [class*="text-slate-200"] { color: var(--bb-ink) !important; }
    .bb-header [class*="text-slate-400"], .bb-header [class*="text-slate-500"] { color: var(--bb-muted) !important; }

    .bb-main {
      max-width: 1440px !important;
      padding: clamp(30px, 5vw, 64px) clamp(16px, 4vw, 56px) !important;
    }
    .bb-main > * { min-width: 0; }
    .bb-main section { scroll-margin-top: 100px; }
    .bb-app main [class*="rounded-2xl"][class*="border"],
    .bb-app main [class*="rounded-3xl"][class*="border"] {
      border-color: var(--bb-rule) !important;
      border-radius: 10px !important;
      box-shadow: none !important;
    }
    .bb-app main [class*="shadow-"] { box-shadow: none !important; }
    .bb-app main [style*="perspective"] { transform: none !important; transition: none !important; }
    .bb-app [class*="blur-["], .bb-app [class*="shadow-[0_0_"] { filter: none !important; box-shadow: none !important; }

    .bb-home-intro {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.75fr);
      align-items: stretch;
      gap: clamp(28px, 7vw, 100px);
      padding: clamp(24px, 5vw, 64px) 0 clamp(32px, 6vw, 76px);
      border-bottom: 1px solid var(--bb-rule);
    }
    .bb-home-copy { max-width: 760px; }
    .bb-home-copy h1 { max-width: 12ch; margin: 16px 0 20px; }
    .bb-home-copy > p { max-width: 58ch; color: var(--bb-muted); font-size: clamp(1rem, 1.4vw, 1.18rem); }
    .bb-kicker { color: var(--bb-clay); font: 600 0.72rem/1.4 var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; }
    .bb-home-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px 24px; margin-top: 28px; }
    .bb-home-actions button { padding: 10px 0; border: 0; border-bottom: 1px solid var(--bb-forest); background: transparent; color: var(--bb-forest); font-weight: 700; cursor: pointer; }
    .bb-home-actions button:first-child { padding: 12px 18px; border: 0; background: var(--bb-forest); color: var(--bb-paper); }
    .bb-home-index { align-self: end; padding: 24px; background: var(--bb-forest); color: var(--bb-paper); border-top: 4px solid var(--bb-clay); }
    .bb-home-index .bb-kicker, .bb-home-index h2, .bb-home-index p { color: var(--bb-paper) !important; }
    .bb-index-row { display: grid; grid-template-columns: 2.5rem 1fr; gap: 10px; width: 100%; padding: 14px 0; border: 0; border-bottom: 1px solid rgba(243, 239, 228, 0.28); background: transparent; color: var(--bb-paper); text-align: left; cursor: pointer; }
    .bb-index-row:last-child { border-bottom: 0; }
    .bb-index-row > span:first-child { color: #e6aa83; font: 500 0.75rem var(--font-mono); }
    .bb-index-row strong { display: block; font-size: 1rem; }
    .bb-index-row small { display: block; margin-top: 3px; color: rgba(243, 239, 228, 0.78); font-size: 0.78rem; line-height: 1.45; }
    .bb-home-note { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px 24px; padding: 18px 0; border-bottom: 1px solid var(--bb-rule); }
    .bb-home-note strong { color: var(--bb-clay); font: 600 0.74rem var(--font-mono); text-transform: uppercase; }
    .bb-home-note p { margin: 0; color: var(--bb-muted); }

    /* Retheme the former dark HUD utilities as paper, forest and clay. */
    .bb-app [class*="bg-[#040606]"], .bb-app [class*="bg-[#040807]"],
    .bb-app [class*="bg-[#050505]"], .bb-app [class*="bg-[#050606]"],
    .bb-app [class*="bg-[#050807]"], .bb-app [class*="bg-[#050908]"],
    .bb-app [class*="bg-[#050A09]"], .bb-app [class*="bg-[#060A09]"],
    .bb-app [class*="bg-[#060B09]"], .bb-app [class*="bg-[#062E22]"],
    .bb-app [class*="bg-[#07080C]"], .bb-app [class*="bg-[#070B0A]"],
    .bb-app [class*="bg-[#070C0B]"], .bb-app [class*="bg-[#070D0B]"],
    .bb-app [class*="bg-[#080D0C]"], .bb-app [class*="bg-[#09110E]"],
    .bb-app [class*="bg-[#09110F]"], .bb-app [class*="bg-[#091412]"],
    .bb-app [class*="bg-[#0A110F]"], .bb-app [class*="bg-[#0B0D13]"],
    .bb-app [class*="bg-[#0B0E0D]"], .bb-app [class*="bg-[#0C0E14]"],
    .bb-app [class*="bg-[#0C1311]"], .bb-app [class*="bg-[#0D0F17]"],
    .bb-app [class*="bg-[#0D1513]"], .bb-app [class*="bg-slate-950"],
    .bb-app [class*="bg-slate-900"], .bb-app [class*="bg-slate-800"] { background-color: var(--bb-surface) !important; }
    .bb-app [class~="bg-emerald-500"], .bb-app [class~="bg-cyan-500"], .bb-app [class~="bg-sky-500"] { background-color: var(--bb-forest) !important; }
    .bb-app [class~="bg-amber-500"], .bb-app [class~="bg-orange-500"] { background-color: var(--bb-clay) !important; }
    .bb-app [class*="bg-emerald-500/"], .bb-app [class*="bg-cyan-500/"], .bb-app [class*="bg-sky-500/"] { background-color: rgba(30, 81, 56, 0.1) !important; }
    .bb-app [class*="bg-amber-500/"], .bb-app [class*="bg-orange-500/"] { background-color: rgba(169, 79, 50, 0.1) !important; }
    .bb-app [class*="bg-white/5"], .bb-app [class*="bg-white/10"] { background-color: rgba(30, 81, 56, 0.05) !important; }
    .bb-app [class*="border-slate-"], .bb-app [class*="border-white/"] { border-color: var(--bb-rule) !important; }
    .bb-app [class*="border-cyan-"], .bb-app [class*="border-sky-"] { border-color: rgba(30, 81, 56, 0.28) !important; }
    .bb-app [class*="border-emerald-"] { border-color: rgba(30, 81, 56, 0.28) !important; }
    .bb-app [class*="border-amber-"], .bb-app [class*="border-orange-"] { border-color: rgba(169, 79, 50, 0.3) !important; }
    .bb-app [class~="text-white"], .bb-app [class~="text-slate-100"], .bb-app [class~="text-slate-200"], .bb-app [class~="text-slate-950"], .bb-app [class~="text-slate-900"] { color: var(--bb-ink) !important; }
    .bb-app [class*="text-white/"] { color: var(--bb-ink) !important; }
    .bb-app [class~="text-slate-300"], .bb-app [class~="text-slate-400"], .bb-app [class~="text-slate-500"], .bb-app [class~="text-slate-600"] { color: var(--bb-muted) !important; }
    .bb-app [class*="text-emerald-"], .bb-app [class*="text-cyan-"], .bb-app [class*="text-sky-"], .bb-app [class*="text-blue-"], .bb-app [class*="text-purple-"] { color: var(--bb-forest) !important; }
    .bb-app [class*="text-amber-"], .bb-app [class*="text-orange-"] { color: var(--bb-clay) !important; }
    .bb-app [class*="absolute"] [class~="text-white"] { color: #fff !important; }

    .bevel-emerald-btn, .bevel-amber-btn, .bevel-cyan-btn, .tactile-btn {
      border-radius: 4px !important;
      box-shadow: none !important;
      transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
    }
    .bevel-emerald-btn { background: var(--bb-forest) !important; color: var(--bb-paper) !important; }
    .bevel-amber-btn, .bevel-cyan-btn { background: transparent !important; border: 1px solid var(--bb-rule); color: var(--bb-ink) !important; }
    .bb-app input, .bb-app textarea, .bb-app select {
      max-width: 100%; border-color: var(--bb-rule) !important; border-radius: 4px !important;
      background: var(--bb-surface) !important; color: var(--bb-ink) !important;
    }
    .bb-app input::placeholder, .bb-app textarea::placeholder { color: #778278; }
    .bb-app input:focus, .bb-app textarea:focus, .bb-app select:focus { outline: 2px solid var(--bb-forest); outline-offset: 2px; }
    .bb-app button:focus-visible, .bb-app a:focus-visible { outline: 2px solid var(--bb-clay); outline-offset: 3px; }
    .bb-app button { transition-duration: 150ms; }
    .bb-app table { width: 100%; border-collapse: collapse; }
    .bb-app th { color: var(--bb-ink); font-weight: 600; }
    .bb-app td, .bb-app th { border-color: var(--bb-rule); }
    .bb-app footer { border-color: var(--bb-rule) !important; background: #e9e4d8 !important; }
    .bb-app > nav[class*="fixed"][class*="bottom-0"] { border-color: var(--bb-rule) !important; background: var(--bb-paper) !important; backdrop-filter: none !important; padding-bottom: max(8px, env(safe-area-inset-bottom)); }
    .bb-app > nav[class*="fixed"][class*="bottom-0"] [class~="text-white"], .bb-app > nav[class*="fixed"][class*="bottom-0"] [class*="text-slate-"] { color: var(--bb-ink) !important; }
    .bb-app ::selection { color: var(--bb-paper); background: var(--bb-forest); }
    .bb-app ::-webkit-scrollbar { width: 10px; height: 10px; }
    .bb-app ::-webkit-scrollbar-track { background: var(--bb-paper); }
    .bb-app ::-webkit-scrollbar-thumb { border: 2px solid var(--bb-paper); border-radius: 0; background: #879689; }

    @media (max-width: 760px) {
      .bb-header { padding-inline: 8px !important; }
      .bb-main { padding: 28px 16px !important; }
      .bb-home-intro { grid-template-columns: 1fr; gap: 30px; }
      .bb-home-index { max-width: none; }
      .bb-app main h1 { font-size: clamp(2.35rem, 11vw, 3.5rem); }
      .bb-app main h2 { font-size: clamp(1.55rem, 8vw, 2rem); }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
    }
  `}</style>
);

// Simple card wrapper for editorial directory entries.
// ============================================================================
const EditorialCard = ({ children, className = '', onClick }) => (
  <div className={className} onClick={onClick}>
    {children}
  </div>
);


const INITIAL_SERVERS = [
  { id: 'srv-bdzone', name: 'BDZONE Network', ip: 'play.bdzonemc.com', edition: 'Listing details unconfirmed', versions: '', modes: [], descriptionEn: 'This name and Java address are unconfirmed. Check the address and other details with the server owner before joining.' },
  { id: 'srv-cyanplex', name: 'Cyan Plex Network', ip: 'play.cyanplex.net', edition: 'Listing details unconfirmed', versions: '', modes: [], descriptionEn: 'This name and Java address are unconfirmed. Check the address and other details with the server owner before joining.' },
  { id: 'srv-bms', name: 'Bangladeshi Minecraft Society (BMS)', ip: 'play.minecraftbangladesh.com:5555', edition: 'Listing details unconfirmed', versions: '', modes: [], descriptionEn: 'This name and Java address are unconfirmed. Check the address and other details with the server owner before joining.' },
  { id: 'srv-mavenshive', name: "Maven's Hive", ip: 'play.mavenshive.com', edition: 'Listing details unconfirmed', versions: '', modes: [], descriptionEn: 'This name and Java address are unconfirmed. Check the address and other details with the server owner before joining.' },
  { id: 'srv-bongocraft', name: 'BongoCraft Network', ip: 'play.bongocraft.fun:25575', edition: 'Listing details unconfirmed', versions: '', modes: [], descriptionEn: 'This name and Java address are unconfirmed. Check the address and other details with the server owner before joining.' },
  { id: 'srv-royalsmp', name: 'RoyalSMP Bangladesh', ip: 'play.royalsmp.fun', edition: 'Listing details unconfirmed', versions: '', modes: [], descriptionEn: 'This name and Java address are unconfirmed. Check the address and other details with the server owner before joining.' }
];

const BlockBanglaLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 select-none" role="img" aria-label="BLOCKBANGLA logo">
    <polygon points="32,6 56,19 32,32 8,19" fill="#1E5138" stroke="#183326" strokeWidth="1.5" />
    <polygon points="8,19 32,32 32,58 8,45" fill="#A94F32" stroke="#183326" strokeWidth="1.5" />
    <polygon points="32,32 56,19 56,45 32,58" fill="#E8E4D8" stroke="#183326" strokeWidth="1.5" />
    <polygon points="8,19 16,23.3 16,28 8,23.7" fill="#2D6849" />
    <polygon points="24,27.6 32,32 32,37 24,32.6" fill="#1E5138" />
    <polygon points="32,32 40,27.6 40,33 32,37.3" fill="#E8E4D8" />
    <polygon points="48,23.3 56,19 56,24 48,28.3" fill="#D7D1C1" />
    <circle cx="32" cy="19" r="5.5" fill="#A94F32" stroke="#F3EFE4" strokeWidth="1.2" />
    <polygon points="32,10 35,17 32,21 29,17" fill="#F3EFE4" />
    <polygon points="24,15 30,17 29,21 23,19" fill="#F3EFE4" />
    <polygon points="40,15 34,17 35,21 41,19" fill="#F3EFE4" />
    <polyline points="8,19 32,32 56,19" stroke="#F3EFE4" strokeWidth="1.2" strokeOpacity="0.7" />
    <line x1="32" y1="32" x2="32" y2="58" stroke="#F3EFE4" strokeWidth="1.2" strokeOpacity="0.65" />
  </svg>
);

// 3. Directory rendering
// ============================================================================

const ServerVisualHeader = ({ srv, tele }) => {
  const cleanHost = String(srv.ip || '').split(':')[0];
  const iconUrl = tele?.icon || `https://api.mcsrvstat.us/icon/${encodeURIComponent(cleanHost)}`;
  const pct = tele?.online && tele?.playersMax > 0
    ? Math.min(100, Math.round((tele.playersOnline / tele.playersMax) * 100))
    : 0;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 border-b border-slate-300 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={iconUrl} alt="" className="h-11 w-11 shrink-0 border border-slate-300 bg-white object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div className="min-w-0"><h3 className="truncate text-base font-display font-bold">{srv.name}</h3><div className="truncate font-mono-code text-xs text-slate-600">{srv.ip}</div></div>
        </div>
        <div className="shrink-0 text-right text-xs">
          <div className="font-bold">{tele?.loading ? 'Checking...' : !tele?.checkedAt ? 'Not checked' : tele.rttMs == null ? 'Status API unavailable' : tele.online ? 'Online' : 'No response from address'}</div>
          <div className="font-mono-code text-slate-600">{tele?.online ? (tele.playersOnline == null ? 'Player count not returned' : tele.playersOnline + ' / ' + (tele.playersMax ?? 'not returned') + ' players') : 'Listing details unconfirmed'}</div>
        </div>
      </div>
      <div className="h-1 w-full bg-slate-200"><div className="h-full bg-[#1E5138]" style={{ width: `${tele?.online ? Math.max(6, pct) : 0}%` }} /></div>
    </div>
  );
};

function formatDhakaTime(dateObj) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(dateObj);
  } catch (e) {
    return dateObj.toLocaleTimeString();
  }
}

// ============================================================================
// 4. MAIN APPLICATION COMPONENT (`export default function App()`)
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgressPct, setScrollProgressPct] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

  // Navigation & Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Server directory and current status checks
  const [servers] = useState(INITIAL_SERVERS);
  const [serverTelemetry, setServerTelemetry] = useState({});
  const [serverSearch, setServerSearch] = useState('');
  const [customIpInput, setCustomIpInput] = useState('');
  const [customEditionInput, setCustomEditionInput] = useState('java');
  const [isPingingCustom, setIsPingingCustom] = useState(false);
  const [customPingResult, setCustomPingResult] = useState(null);
  const [autoPollServers, setAutoPollServers] = useState(true);

  // Server tool states
  const [coordX, setCoordX] = useState(0);
  const [coordZ, setCoordZ] = useState(0);
  const [coordMode, setCoordMode] = useState('overworld-to-nether');
  const [skinLookupUser, setSkinLookupUser] = useState('');
  const [skinLookupData, setSkinLookupData] = useState(null);
  const [skinLookupError, setSkinLookupError] = useState(null);
  const [skinLookupLoading, setSkinLookupLoading] = useState(false);
  const [wikiQuery, setWikiQuery] = useState('');
  const [wikiResults, setWikiResults] = useState([]);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiError, setWikiError] = useState(null);
  const [motdLine1, setMotdLine1] = useState('');
  const [motdLine2, setMotdLine2] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    title: '',
    subtitle: '',
    link: '',
    description: ''
  });
  const [formNotice, setFormNotice] = useState(null);

  // Navigation Lists
  const primaryNavItems = useMemo(
    () => [
      { id: 'home', labelEn: 'Home', labelBn: 'হোম', icon: Compass },
      { id: 'servers', labelEn: 'Server directory', labelBn: 'সার্ভার ডিরেক্টরি', icon: Server },
      { id: 'toolbox', labelEn: 'Server tools', labelBn: 'সার্ভার টুলস', icon: Wrench },
      { id: 'about', labelEn: 'About', labelBn: 'পরিচিতি', icon: Award }
    ],
    []
  );

  const secondaryNavItems = useMemo(
    () => [],
    []
  );

  const navItems = useMemo(
    () => [...primaryNavItems, ...secondaryNavItems],
    [primaryNavItems, secondaryNavItems]
  );

  // Clock & Scroll Listener
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setHeaderScrolled(y > 24);
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgressPct(Math.min(100, Math.round((y / maxScroll) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchTabWithMotion = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    },
    [reducedMotion]
  );

  const handleCopyText = useCallback(
    (text, key) => {
      try {
        navigator.clipboard.writeText(text);
      } catch (e) {}
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    },
    []
  );

  // Live Server Status Query (mcsrvstat.us v3 + mcstatus.io v2 fallback)
  const queryLiveServerStatus = useCallback(async (ipAddress, edition = 'java', serverId = null) => {
    const cleanIp = String(ipAddress || '').trim();
    if (!cleanIp) return;
    if (!serverId) setIsPingingCustom(true);
    else {
      setServerTelemetry((prev) => ({
        ...prev,
        [serverId]: { ...(prev[serverId] || {}), loading: true }
      }));
    }

    const t0 = performance.now();
    try {
      const endpoint =
        edition === 'bedrock'
          ? `https://api.mcsrvstat.us/bedrock/3/${encodeURIComponent(cleanIp)}`
          : `https://api.mcsrvstat.us/3/${encodeURIComponent(cleanIp)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const rttMs = Math.round(performance.now() - t0);
      const payload = {
        ip: cleanIp,
        online: Boolean(data.online),
        playersOnline: data.players?.online ?? null,
        playersMax: data.players?.max ?? null,
        version: data.version || data.protocol?.name || 'Not returned by API',
        motd:
          (Array.isArray(data.motd?.clean) ? data.motd.clean.join(' ') : data.motd?.clean) ||
          'No MOTD returned by status API',
        icon: data.icon || null,
        rttMs,
        checkedAt: formatDhakaTime(new Date()),
        loading: false
      };
      if (serverId) {
        setServerTelemetry((prev) => ({ ...prev, [serverId]: payload }));
      } else {
        setCustomPingResult(payload);
        setIsPingingCustom(false);
      }
    } catch (e) {
      const fallback = {
        ip: cleanIp,
        online: false,
        playersOnline: null,
        playersMax: null,
        version: 'Not returned by API',
        motd: 'Unable to reach public status API right now',
        rttMs: null,
        checkedAt: formatDhakaTime(new Date()),
        loading: false
      };
      if (serverId) {
        setServerTelemetry((prev) => ({ ...prev, [serverId]: fallback }));
      } else {
        setCustomPingResult(fallback);
        setIsPingingCustom(false);
      }
    }
  }, []);

  useEffect(() => {
    servers.forEach((srv, idx) => {
      setTimeout(() => queryLiveServerStatus(srv.ip, 'java', srv.id), idx * 180);
    });
  }, [servers, queryLiveServerStatus]);

  useEffect(() => {
    if (!autoPollServers) return undefined;
    const id = setInterval(() => {
      servers.forEach((srv, idx) => {
        setTimeout(() => queryLiveServerStatus(srv.ip, 'java', srv.id), idx * 180);
      });
    }, 45000);
    return () => clearInterval(id);
  }, [autoPollServers, servers, queryLiveServerStatus]);

  const liveEcosystemStats = useMemo(() => {
    const vals = Object.values(serverTelemetry);
    const onlineList = vals.filter((v) => v?.online);
    const checkedCount = vals.filter((v) => v?.checkedAt && !v.loading).length;
    return {
      totalTracked: servers.length,
      onlineNodes: onlineList.length,
      checkedCount
    };
  }, [serverTelemetry, servers.length]);

  const filteredServers = useMemo(() => {
    const q = serverSearch.trim().toLowerCase();
    return servers.filter((server) =>
      !q || server.name.toLowerCase().includes(q) || server.ip.toLowerCase().includes(q)
    );
  }, [servers, serverSearch]);

  const lookupMinecraftSkin = useCallback(async (username) => {
    const cleanUsername = String(username || '').trim();
    if (!cleanUsername) {
      setSkinLookupError('Enter a Minecraft username first.');
      return;
    }
    setSkinLookupError(null);
    setSkinLookupData(null);
    setSkinLookupLoading(true);
    try {
      const res = await fetch(
        `https://playerdb.co/api/player/minecraft/${encodeURIComponent(cleanUsername)}`
      );
      const data = await res.json();
      const player = data?.data?.player;
      if (!res.ok || !player) throw new Error('No profile returned');
      setSkinLookupData({
        username: player.username,
        uuid: player.id,
        avatar: `https://mc-heads.net/avatar/${encodeURIComponent(player.username)}/64`
      });
    } catch (e) {
      setSkinLookupError('No public profile was returned. Check the name and try again.');
    } finally {
      setSkinLookupLoading(false);
    }
  }, []);

  const searchMinecraftWiki = useCallback(async (q) => {
    const cleanQuery = String(q || '').trim();
    if (!cleanQuery) {
      setWikiError('Enter a search term first.');
      return;
    }
    setWikiError(null);
    setWikiResults([]);
    setWikiLoading(true);
    try {
      const res = await fetch(
        `https://minecraft.wiki/api.php?action=opensearch&search=${encodeURIComponent(
          cleanQuery
        )}&limit=5&format=json&origin=*`
      );
      const data = await res.json();
      if (!res.ok || !Array.isArray(data[1]) || !Array.isArray(data[3])) throw new Error('No results returned');
      const results = data[1].map((title, idx) => ({
        title,
        url: data[3][idx] || `https://minecraft.wiki/w/${encodeURIComponent(title)}`
      }));
      setWikiResults(results);
      if (results.length === 0) setWikiError('No matching pages were returned.');
    } catch (e) {
      setWikiError('The Minecraft Wiki search could not be reached. Try again later.');
    } finally {
      setWikiLoading(false);
    }
  }, []);

  const handleSubmission = async (e) => {
    e.preventDefault();
    const title = String(formData.title || '').trim();
    const result = await submitToFormspreeModal({
      email: formData.email,
      _subject: '[BLOCKBANGLA ' + (activeModal || 'submission') + '] ' + title,
      title,
      author: String(formData.subtitle || '').trim() || formData.email,
      link: String(formData.link || '').trim(),
      message: String(formData.description || '').trim()
    });
    setFormNotice({
      text: result.ok
        ? 'Sent to the configured Formspree inbox. This page does not publish submissions.'
        : 'Formspree did not accept the submission. Check the form details and try again.'
    });
    if (result.ok) setFormData({ email: '', title: '', subtitle: '', link: '', description: '' });
  };
  const globalSearchResults = useMemo(() => {
    const q = globalQuery.trim().toLowerCase();
    if (!q) return [];
    return servers
      .filter((server) => server.name.toLowerCase().includes(q) || server.ip.toLowerCase().includes(q))
      .map((server) => ({ title: server.name + " (" + server.ip + ")", type: 'Server', tab: 'servers' }))
      .slice(0, 10);
  }, [globalQuery, servers]);

  return (
    <div className="bb-app relative min-h-screen w-full max-w-full overflow-x-hidden shader-void-bg text-slate-100 font-sans-bd pb-20 xl:pb-0 selection:bg-emerald-500 selection:text-slate-950">
      <V2GlobalStyles />

      {/* Top Scroll Progress Indicator Bar */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-1 bg-slate-950/60 pointer-events-none">
        <div
          className="h-full bg-[#1E5138] transition-all duration-75"
          style={{ width: `${scrollProgressPct}%` }}
        />
      </div>

      {/* ================================================================== */}
      {/* SITE NAVIGATION */}
      {/* ================================================================== */}
      <header className="bb-header sticky top-2 sm:top-3 z-50 w-full max-w-7xl mx-auto px-2.5 sm:px-4">
        <div
          className={`border-b border-slate-300 bg-[#F3EFE4] px-3 sm:px-5 transition-all duration-300 ${
            headerScrolled ? 'py-2' : 'py-3'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10 text-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
              <span>{lang === 'bn' ? 'ঢাকা' : 'Dhaka'} · {formatDhakaTime(new Date(nowMs))}</span>
              <span className="hidden sm:inline">{liveEcosystemStats.checkedCount} of {servers.length} listed addresses checked - {liveEcosystemStats.onlineNodes} last reported online</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setLang((l) => (l === 'en' ? 'bn' : 'en'))} className="px-2.5 py-1 border border-slate-300 text-xs font-bold">
                {lang === 'en' ? 'বাংলা' : 'EN'}
              </button>
              <button type="button" onClick={() => setReducedMotion((rm) => !rm)} className="px-2.5 py-1 border border-slate-300 text-xs">
                {reducedMotion ? 'Motion: Off' : 'Motion: On'}
              </button>
            </div>
          </div>

          {/* Main Floating HUD Navigation Row */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => switchTabWithMotion('home', 'BLOCKBANGLA')}
              className="flex items-center gap-2.5 text-left group min-w-0"
            >
              <BlockBanglaLogo size={headerScrolled ? 34 : 38} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl font-display font-black tracking-tight text-white group-hover:text-emerald-400 transition truncate">
                    BLOCK<span className="text-emerald-400">BANGLA</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-pixel-hud px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    SERVERS · STATUS · TOOLS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {lang === 'bn'
                    ? 'বাংলাদেশের মাইনক্রাফট কমিউনিটির ঘর'
                    : 'Bangladesh Minecraft server directory & tools'}
                </p>
              </div>
            </button>

            {/* Desktop HUD Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => switchTabWithMotion(item.id, item.labelEn)}
                    className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                      isActive
                        ? 'bevel-emerald-btn text-slate-950'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setFormNotice(null);
                  setActiveModal('submit-server');
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'যুক্ত করুন' : 'Submit'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:border-emerald-400/50 text-xs transition active:scale-95"
              >
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>⌘K</span>
              </button>
            </nav>

            {/* Mobile HUD Triggers */}
            <div className="flex lg:hidden items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400"
                aria-label="Open Global Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-bold"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span>{lang === 'bn' ? 'মেনু' : 'HUD'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Expandable Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-3 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        switchTabWithMotion(item.id, item.labelEn);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold ${
                        isActive
                          ? 'bevel-emerald-btn text-slate-950'
                          : 'bg-white/5 text-slate-200 border border-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ================================================================== */}
      {/* MAIN CONTENT VIEWPORT                                              */}
      {/* ================================================================== */}
      <main className="bb-main relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-16 overflow-x-hidden">
        {/* ================================================================ */}
        {/* HOME                 */}
        {/* ================================================================ */}
        {activeTab === 'home' && (
          <div className="bb-home-page">
            <section className="bb-home-intro">
              <div className="bb-home-copy">
                <div className="bb-kicker">BLOCKBANGLA / BANGLADESH MINECRAFT DIRECTORY</div>
                <h1>
                  {lang === 'bn'
                    ? 'বাংলাদেশের Minecraft সার্ভার খুঁজুন। দেখে নিন সার্ভারটি চালু আছে কি না।'
                    : 'Find a Minecraft server in Bangladesh. Check if it’s online.'}
                </h1>
                <p>
                  {lang === 'bn'
                    ? 'তালিকায় থাকা সার্ভারের ঠিকানা পরীক্ষা করুন। যোগ দেওয়ার আগে সার্ভারের মালিকের কাছ থেকে সংস্করণ ও অন্যান্য তথ্য নিশ্চিত করুন।'
                    : 'Check the listed server addresses. Confirm the edition and other details with the server owner before you join.'}
                </p>
                <div className="bb-home-actions">
                  <button type="button" onClick={() => switchTabWithMotion('servers', 'Server directory')}>
                    {lang === 'bn' ? 'সার্ভার দেখুন' : 'Browse servers'}
                  </button>
                  <button type="button" onClick={() => switchTabWithMotion('toolbox')}>
                    {lang === 'bn' ? 'সার্ভার টুলস' : 'Server tools'}
                  </button>
                </div>
              </div>

              <aside className="bb-home-index" aria-label="In this directory">
                <div className="bb-kicker">Start here</div>
                <button className="bb-index-row" type="button" onClick={() => switchTabWithMotion('servers')}>
                  <span>01</span><span><strong>Server directory</strong><small>See listed addresses and current connection responses.</small></span>
                </button>
                <button className="bb-index-row" type="button" onClick={() => switchTabWithMotion('toolbox')}>
                  <span>02</span><span><strong>Server tools</strong><small>Coordinates, text preview, public profiles and wiki search.</small></span>
                </button>
                <button className="bb-index-row" type="button" onClick={() => switchTabWithMotion('about')}>
                  <span>03</span><span><strong>Send an update</strong><small>Send a listing or correction.</small></span>
                </button>
              </aside>
            </section>

            <section className="bb-home-note" aria-label={lang === 'bn' ? 'তথ্য যাচাই' : 'How information is checked'}>
              <strong>{lang === 'bn' ? 'তথ্য যাচাই' : 'How information is checked'}</strong>
              <p>
                {lang === 'bn'
                  ? 'নাম ও ঠিকানাগুলো দেওয়া অ্যাপ ফাইল থেকে নেওয়া। তালিকার তথ্য মালিকের কাছ থেকে নিশ্চিত করুন; লাইভ চেক শুধু পাবলিক স্ট্যাটাস API-এর বর্তমান উত্তর দেখায়।'
                  : 'The listed server names and Java addresses are unconfirmed. Live checks show only the current response from a public status API.'}
              </p>
              <button type="button" onClick={() => switchTabWithMotion('about')}>
                {lang === 'bn' ? 'তথ্য পাঠান' : 'Send an update'}
              </button>
            </section>
          </div>
        )}

        {/* SERVER DIRECTORY                 */}
        {/* ================================================================ */}
        {activeTab === 'servers' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="bb-kicker">DIRECTORY / CURRENT STATUS CHECKS</span>
                <h1 className="text-3xl font-display font-extrabold text-white mt-1">
                  {lang === 'bn'
                    ? 'বাংলাদেশের Minecraft সার্ভার ডিরেক্টরি'
                    : 'Minecraft servers in Bangladesh'}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoPollServers((p) => !p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-code border transition ${
                    autoPollServers
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${autoPollServers ? 'text-emerald-400 animate-pulse' : ''}`} />
                  <span>{autoPollServers ? 'Auto-check: every 45 sec' : 'Auto-check: paused'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    servers.forEach((srv, i) =>
                      setTimeout(() => queryLiveServerStatus(srv.ip, 'java', srv.id), i * 200)
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono-code"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check listed addresses</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormNotice(null);
                    setActiveModal('submit-server');
                  }}
                  className="tactile-btn px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Send a listing
                </button>
              </div>
            </div>

            <p className="max-w-4xl border-l-4 border-[#A94F32] bg-[#E8E4D8] px-5 py-4 text-sm text-slate-700">
              These six server names and Java addresses are unconfirmed. A status response shows what a public query service received at that moment; it does not verify ownership, safety, edition support, or in-game latency.
            </p>

            {/* Live Any-Server Status Inspector */}
            <div className="p-5 rounded-2xl bg-[#0D1513] border border-cyan-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono-code text-cyan-400">
                    PUBLIC STATUS API
                  </span>
                  <h3 className="text-base font-display font-bold text-white">
                    Check a server address
                  </h3>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={customIpInput}
                  onChange={(e) => setCustomIpInput(e.target.value)}
                  placeholder="Enter a Java or Bedrock server address"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-slate-700 text-sm font-mono-code text-white"
                />
                <select
                  value={customEditionInput}
                  onChange={(e) => setCustomEditionInput(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-slate-700 text-xs font-mono-code text-slate-200"
                >
                  <option value="java">Java Edition (25565)</option>
                  <option value="bedrock">Bedrock Edition (19132)</option>
                </select>
                <button
                  type="button"
                  onClick={() => queryLiveServerStatus(customIpInput, customEditionInput, null)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-code"
                >
                  {isPingingCustom ? 'Querying...' : 'Inspect Live Status'}
                </button>
              </div>

              {customPingResult && (
                <div className="p-4 rounded-xl bg-[#070B0A] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code">
                  <div>
                    <div className="text-white font-bold">
                      {customPingResult.ip}:{' '}
                      <span
                        className={
                          customPingResult.online ? 'text-emerald-400' : 'text-rose-400'
                        }
                      >
                        {customPingResult.rttMs == null ? 'STATUS API UNAVAILABLE' : customPingResult.online ? 'ONLINE' : 'NO RESPONSE FROM ADDRESS'}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-1">MOTD: {customPingResult.motd || 'Not returned'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-300 font-bold">
                      Players: {customPingResult.playersOnline == null ? 'Not returned' : `${customPingResult.playersOnline} / ${customPingResult.playersMax ?? 'not returned'}`}
                    </div>
                    <div className="text-slate-500">
                      Version: {customPingResult.version} • Checked: {customPingResult.checkedAt}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={serverSearch}
                onChange={(e) => setServerSearch(e.target.value)}
                placeholder="Search by server name or address"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D1513] border border-slate-800 text-sm text-white"
              />
            </div>

            {/* Server Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServers.map((srv, idx) => {
                const tele = serverTelemetry[srv.id];
                return (
                  <EditorialCard
                    key={srv.id}
                    staggerIndex={idx}
                    reducedMotion={reducedMotion}
                    className="rounded-2xl bg-[#0D1513] border border-slate-800 hover:border-cyan-500/40 p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3.5">
                      <ServerVisualHeader srv={srv} tele={tele} />

                      {/* Live MOTD Ticker & Protocol Telemetry */}
                      <div className="p-2.5 rounded-xl bg-[#060A09] border border-emerald-500/20 flex items-center justify-between gap-2 text-[11px] font-mono-code">
                        <div className="truncate text-emerald-300">
                          <span className="text-slate-500 mr-1.5">MOTD:</span>
                          {tele?.motd || 'No status data yet'}
                        </div>
                        <span className="shrink-0 px-2 py-0.5 rounded bg-slate-900 text-cyan-300">
                          {tele?.version || 'Version not returned'}
                        </span>
                      </div>

                      <div className="border-l-2 border-[#A94F32] pl-3 text-xs font-mono-code">
                        <span className="block text-slate-500 text-[10px]">ADDRESS FROM SUPPLIED FILE</span>
                        <span className="text-emerald-800">{srv.ip}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {srv.descriptionEn}
                      </p>

                      <div className="p-2.5 border-t border-slate-300 text-[11px] font-mono-code text-slate-400 flex flex-wrap items-center justify-between gap-2">
                        <span>
                          Status query: <strong className="text-slate-700">{tele?.checkedAt || 'Waiting for first check'}</strong>
                        </span>
                        <span>Listing details need confirmation</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyText(srv.ip, srv.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
                        >
                          {copiedKey === srv.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === srv.id ? 'Copied!' : 'Copy IP'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => queryLiveServerStatus(srv.ip, 'java', srv.id)}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-mono-code"
                        >
                          Refresh Status
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormNotice(null);
                            setFormData((prev) => ({
                              ...prev,
                              title: `Correction Report: ${srv.name} (${srv.ip})`
                            }));
                            setActiveModal('report-inaccuracy');
                          }}
                          className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 text-xs font-mono-code"
                          title="Send a correction for this listing"
                        >
                          Report
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedDetailItem({ type: 'server', data: srv })}
                        className="text-xs font-mono-code text-slate-300 hover:text-white underline"
                      >
                        Listing details →
                      </button>
                    </div>
                  </EditorialCard>
                );
              })}
            </div>

          </div>
        )}

        {/* SERVER TOOLS                   */}
        {/* ================================================================ */}
        {activeTab === 'toolbox' && (
          <div className="bb-tool-page grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 lg:sticky lg:top-28 h-fit border-t-4 border-[#A94F32] bg-[#E8E4D8] p-5">
              <div className="bb-kicker">TOOLS / FOUR SHORTCUTS</div>
              <h1 className="mt-3 text-3xl">Minecraft tools</h1>
              <p className="mt-4 text-sm text-slate-600">Small utilities for coordinates, server list text and public Minecraft references.</p>
              <nav aria-label="Tool index" className="mt-5 divide-y divide-slate-400">
                <a className="block py-3 text-sm font-bold" href="#coordinates">01 / Coordinate converter</a>
                <a className="block py-3 text-sm font-bold" href="#motd">02 / MOTD preview</a>
                <a className="block py-3 text-sm font-bold" href="#profile">03 / Public profile lookup</a>
                <a className="block py-3 text-sm font-bold" href="#wiki">04 / Minecraft Wiki search</a>
              </nav>
            </aside>

            <div className="lg:col-span-9 divide-y divide-slate-300">
              <section id="coordinates" className="grid grid-cols-1 md:grid-cols-12 gap-5 py-6 scroll-mt-28">
                <div className="md:col-span-4">
                  <div className="bb-kicker">01 / COORDINATES</div>
                  <h2 className="mt-2 text-xl">Overworld and Nether</h2>
                  <p className="mt-2 text-sm text-slate-600">Enter X and Z. The converter uses the 8-to-1 coordinate scale.</p>
                </div>
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-bold">X
                      <input type="number" value={coordX} onChange={(e) => setCoordX(Number(e.target.value) || 0)} className="mt-1 w-full px-3 py-2 font-mono-code" />
                    </label>
                    <label className="text-xs font-bold">Z
                      <input type="number" value={coordZ} onChange={(e) => setCoordZ(Number(e.target.value) || 0)} className="mt-1 w-full px-3 py-2 font-mono-code" />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setCoordMode('overworld-to-nether')} className={coordMode === 'overworld-to-nether' ? 'bg-[#1E5138] px-3 py-2 text-sm font-bold text-[#F3EFE4]' : 'border border-slate-400 px-3 py-2 text-sm'}>Overworld to Nether</button>
                    <button type="button" onClick={() => setCoordMode('nether-to-overworld')} className={coordMode === 'nether-to-overworld' ? 'bg-[#1E5138] px-3 py-2 text-sm font-bold text-[#F3EFE4]' : 'border border-slate-400 px-3 py-2 text-sm'}>Nether to Overworld</button>
                  </div>
                  <p className="border-l-2 border-[#1E5138] pl-3 font-mono-code text-sm">
                    X: {coordMode === 'overworld-to-nether' ? Math.floor(coordX / 8) : coordX * 8}
                    {' -> '}
                    Z: {coordMode === 'overworld-to-nether' ? Math.floor(coordZ / 8) : coordZ * 8}
                  </p>
                </div>
              </section>

              <section id="motd" className="grid grid-cols-1 md:grid-cols-12 gap-5 py-6 scroll-mt-28">
                <div className="md:col-span-4">
                  <div className="bb-kicker">02 / MOTD</div>
                  <h2 className="mt-2 text-xl">Preview your server-list MOTD</h2>
                  <p className="mt-2 text-sm text-slate-600">This shows plain text after removing basic &amp; color codes. It stays in your browser and does not contact a server.</p>
                </div>
                <div className="md:col-span-8 space-y-3">
                  <input aria-label="MOTD line one" value={motdLine1} onChange={(e) => setMotdLine1(e.target.value)} className="w-full px-3 py-2 font-mono-code" placeholder="Line one" />
                  <input aria-label="MOTD line two" value={motdLine2} onChange={(e) => setMotdLine2(e.target.value)} className="w-full px-3 py-2 font-mono-code" placeholder="Line two" />
                  <div className="border-l-2 border-[#A94F32] bg-[#E8E4D8] p-4 font-mono-code text-sm">
                    <div className="font-bold">MOTD preview - local only</div>
                    <div>{motdLine1 ? motdLine1.replace(/&[0-9a-fk-or]/gi, '') : 'Enter the first line above.'}</div>
                    <div>{motdLine2 ? motdLine2.replace(/&[0-9a-fk-or]/gi, '') : 'Enter the second line above.'}</div>
                  </div>
                  <button type="button" onClick={() => handleCopyText(motdLine1 + String.fromCharCode(10) + motdLine2, 'motd-copy')} className="border-b border-[#1E5138] py-2 text-sm font-bold">
                    {copiedKey === 'motd-copy' ? 'Copied' : 'Copy raw text'}
                  </button>
                </div>
              </section>

              <section id="profile" className="grid grid-cols-1 md:grid-cols-12 gap-5 py-6 scroll-mt-28">
                <div className="md:col-span-4">
                  <div className="bb-kicker">03 / PUBLIC PROFILE</div>
                  <h2 className="mt-2 text-xl">Look up a Minecraft username</h2>
                  <p className="mt-2 text-sm text-slate-600">Looks up public profile data through PlayerDB. It does not sign you in or confirm account ownership.</p>
                </div>
                <div className="md:col-span-8 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <input aria-label="Minecraft username" value={skinLookupUser} onChange={(e) => setSkinLookupUser(e.target.value)} placeholder="Minecraft username" className="min-w-0 flex-1 px-3 py-2 font-mono-code" />
                    <button type="button" onClick={() => lookupMinecraftSkin(skinLookupUser)} disabled={skinLookupLoading} className="bg-[#1E5138] px-4 py-2 text-sm font-bold text-[#F3EFE4] disabled:opacity-50">{skinLookupLoading ? 'Looking up...' : 'Look up'}</button>
                  </div>
                  {skinLookupError && <p className="text-sm text-[#A94F32]" role="status">{skinLookupError}</p>}
                  {skinLookupData && (
                    <div className="flex items-center gap-3 border-y border-slate-300 py-3">
                      <img src={skinLookupData.avatar} alt="" className="h-12 w-12 border border-slate-300" />
                      <div className="text-sm"><strong>{skinLookupData.username}</strong><div className="font-mono-code text-xs text-slate-500">UUID: {skinLookupData.uuid}</div></div>
                    </div>
                  )}
                </div>
              </section>

              <section id="wiki" className="grid grid-cols-1 md:grid-cols-12 gap-5 py-6 scroll-mt-28">
                <div className="md:col-span-4">
                  <div className="bb-kicker">04 / MINECRAFT WIKI</div>
                  <h2 className="mt-2 text-xl">Search the wiki</h2>
                  <p className="mt-2 text-sm text-slate-600">Results link to Minecraft Wiki pages.</p>
                </div>
                <div className="md:col-span-8 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <input aria-label="Wiki search" value={wikiQuery} onChange={(e) => setWikiQuery(e.target.value)} placeholder="Item, block, biome?" className="min-w-0 flex-1 px-3 py-2" />
                    <button type="button" onClick={() => searchMinecraftWiki(wikiQuery)} disabled={wikiLoading} className="border border-slate-400 px-4 py-2 text-sm font-bold disabled:opacity-50">{wikiLoading ? 'Searching...' : 'Search'}</button>
                  </div>
                  {wikiError && <p className="text-sm text-[#A94F32]" role="status">{wikiError}</p>}
                  {wikiResults.length === 0 && !wikiError && !wikiLoading && <p className="py-2 text-sm text-slate-500">Search for a Minecraft item, block or biome.</p>}
                  <div className="divide-y divide-slate-300">
                    {wikiResults.map((result) => (
                      <a key={result.url} href={result.url} target="_blank" rel="noopener noreferrer" className="flex justify-between gap-4 py-3 text-sm hover:text-[#1E5138]">
                        <span>{result.title}</span><span className="text-xs" aria-hidden="true">Open</span>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-10">
            <header className="max-w-4xl border-b border-slate-300 pb-6">
              <div className="bb-kicker">ABOUT / DIRECTORY NOTES</div>
              <h1 className="mt-3">{lang === 'bn' ? 'বাংলাদেশের Minecraft সার্ভার ডিরেক্টরি' : 'A Minecraft server directory for Bangladesh'}</h1>
              <p className="mt-5 max-w-3xl text-slate-600">
                {lang === 'bn'
                  ? 'BLOCKBANGLA-তে থাকা সার্ভারের নাম ও ঠিকানা দেওয়া অ্যাপ ফাইল থেকে এসেছে। পাবলিক স্ট্যাটাস API শুধু সেই মুহূর্তে ঠিকানাটি কী উত্তর দিয়েছে তা দেখায়; মালিকানা, নিরাপত্তা বা সার্ভারের সব তথ্য যাচাই করে না।'
                  : 'The server names and addresses currently listed are unconfirmed. A public status API shows only how an address answered at that moment; it does not confirm ownership, safety, or every listing detail.'}
              </p>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-y border-slate-300 py-7">
              <div className="lg:col-span-4"><div className="bb-kicker">STATUS CHECK</div><h2 className="mt-2 text-xl">A status reply is not an endorsement.</h2></div>
              <p className="lg:col-span-7 text-slate-600">The directory queries a public status API for online state, player count, version, and response time. The response time measures the browser-to-API request, not in-game ping. Check the server’s own site before joining or paying.</p>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <div className="bb-kicker">SEND A CORRECTION OR LISTING</div>
                <h2 className="mt-2 text-2xl">Send a server listing or correction.</h2>
                <p className="mt-3 text-sm text-slate-600">The form sends to the configured Formspree inbox. This page has no connected CMS or public submission queue.</p>
              </div>
              <div className="lg:col-span-8 bg-[#F8FAFC] p-5 sm:p-8">
                {fsContactState.succeeded ? (
                  <div className="space-y-4 py-4">
                    <h3 className="text-xl font-bold">Message sent.</h3>
                    <p className="text-sm text-slate-600">Your submission was accepted by Formspree. It has not been published on the site.</p>
                    <button type="button" onClick={resetFsContact} className="border-b border-emerald-700 py-2 text-sm font-bold">Send another</button>
                  </div>
                ) : (
                  <form action={FORMSPREE_ENDPOINT} method="POST" onSubmit={submitToFormspreeContact} className="space-y-4">
                    <label className="block text-sm font-bold">Name or Minecraft username<input type="text" name="name" required className="mt-1 w-full px-3 py-2" /></label>
                    <label className="block text-sm font-bold">Email<input type="email" name="email" required className="mt-1 w-full px-3 py-2" /></label>
                    <label className="block text-sm font-bold">What is this about?
                      <select name="topic" className="mt-1 w-full px-3 py-2">
                        <option>Server listing</option><option>Correction</option><option>General feedback</option>
                      </select>
                    </label>
                    <label className="block text-sm font-bold">Public link or server address<input type="text" name="link" placeholder="https://… or server.example" className="mt-1 w-full px-3 py-2" /></label>
                    <label className="block text-sm font-bold">Details<textarea name="message" required rows={4} placeholder="Include dates and sources when available." className="mt-1 w-full px-3 py-2" /></label>
                    <FormspreeValidationError prefix="Form" field="form" errors={fsContactState.errors} />
                    <button type="submit" disabled={fsContactState.submitting} className="bg-[#1E5138] px-5 py-3 text-sm font-bold text-[#F3EFE4] disabled:opacity-50">
                      {fsContactState.submitting ? 'Sending…' : 'Send to BLOCKBANGLA'}
                    </button>
                    <p className="text-xs text-slate-500">Only include contact details you’re comfortable sharing. Do not send passwords or private account data.</p>
                  </form>
                )}
              </div>
            </section>
          </div>
        )}

      </main>

      {/* ================================================================== */}
      {/* FULLSCREEN HIGH-RESOLUTION VISUAL LIGHTBOX MODAL                   */}
      {/* ================================================================== */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#0D1513] border border-emerald-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code text-emerald-400">
                SEARCH / SERVER LISTINGS
              </span>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              autoFocus
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              placeholder="Search server name or address"
              className="w-full px-4 py-3 rounded-xl bg-[#070B0A] border border-slate-700 text-sm text-white"
            />
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {globalSearchResults.length > 0 ? (
                globalSearchResults.map((res, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      switchTabWithMotion(res.tab, res.type.toUpperCase());
                      setSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-[#070B0A] hover:bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-white">{res.title}</span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {res.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">
                  Search the listed server names and addresses.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* LISTING DETAILS */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="listing-detail-title" className="w-full max-w-lg space-y-4 border border-slate-300 bg-[#F3EFE4] p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="bb-kicker">LISTING SOURCE NOTE</div>
              <button type="button" onClick={() => setSelectedDetailItem(null)} className="text-sm underline">Close</button>
            </div>
            <h2 id="listing-detail-title" className="text-2xl font-display font-bold">
              {selectedDetailItem.data.name}
            </h2>
            <p className="border-l-2 border-[#A94F32] pl-3 font-mono-code text-sm">Address: {selectedDetailItem.data.ip}</p>
            <p className="text-sm text-slate-600">This name and address are unconfirmed. Check with the server owner before joining. A public status response does not verify ownership, safety, or edition support.</p>
          </section>
        </div>
      )}
      {/* LISTING / CORRECTION FORM                                         */}
      {/* ================================================================== */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1513] border border-emerald-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-code text-emerald-400 uppercase block">
                  SERVER LISTING / CORRECTION
                </span>
                <h3 className="text-lg font-display font-bold text-white uppercase">
                  {activeModal.replace('-', ' ')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Choose the type of message */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'submit-server', label: 'Server listing' },
                { id: 'report-inaccuracy', label: 'Report Correction' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveModal(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-code transition ${
                    activeModal === m.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="border-l-4 border-[#A94F32] bg-[#E8E4D8] p-3 text-xs text-slate-700">
              This form sends your message to Formspree. It does not publish a listing or create a public submission queue. Include a source link when you have one.
            </div>

            {formNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200">
                {formNotice.text}
              </div>
            )}
            <form
              action={FORMSPREE_ENDPOINT}
              method="POST"
              onSubmit={handleSubmission}
              className="space-y-3"
            >
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email for a reply"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-slate-700 text-sm text-white"
              />
              <FormspreeValidationError
                prefix="Email"
                field="email"
                errors={fsModalState.errors}
              />
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Server name or listing title"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-slate-700 text-sm text-white"
              />
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Your name or Minecraft username (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-slate-700 text-sm text-white"
              />
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="Public source link or server address (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-slate-700 text-sm text-white"
              />
              <textarea
                rows={3}
                name="message"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What should be added or corrected? Include confirmed Java/Bedrock addresses if available."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-slate-700 text-sm text-white"
              />
              <FormspreeValidationError
                prefix="Message"
                field="message"
                errors={fsModalState.errors}
              />
              <button
                type="submit"
                disabled={fsModalState.submitting}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs"
              >
                {fsModalState.submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* FOOTER WITH OFFICIAL MOJANG USAGE GUIDELINES DISCLAIMER            */}
      {/* ================================================================== */}
      <footer className="mt-16 border-t border-emerald-500/20 bg-[#050807] py-10 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <BlockBanglaLogo size={28} />
              <span className="font-display font-extrabold text-white text-base">
                BLOCK<span className="text-emerald-400">BANGLA</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-xl">
              NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
              BLOCKBANGLA is a Minecraft server directory for Bangladesh. Public status checks do not verify ownership, safety, or every listing detail.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-mono-code text-emerald-400">
              <button
                type="button"
                onClick={() => switchTabWithMotion('about')}
                className="hover:underline"
              >
                About this directory
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormNotice(null);
                  setActiveModal('report-inaccuracy');
                }}
                className="text-amber-300 hover:underline"
              >
                Report a listing
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 font-mono-code">
            {navItems.slice(0, 8).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => switchTabWithMotion(n.id, n.labelEn)}
                className="hover:text-emerald-400 transition"
              >
                {n.labelEn}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* STICKY MOBILE BOTTOM NAVIGATION BAR (FOR SMARTPHONE PLAYERS)       */}
      {/* ================================================================== */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060A09]/95 border-t border-emerald-500/30 px-2 py-1.5 grid grid-cols-4 gap-1">
        {[
          { id: 'home', labelEn: 'Home', labelBn: 'হোম', icon: Compass },
          { id: 'servers', labelEn: 'Servers', labelBn: 'সার্ভার', icon: Server },
          { id: 'toolbox', labelEn: 'Tools', labelBn: 'টুলস', icon: Wrench },
          { id: 'about', labelEn: 'About', labelBn: 'পরিচিতি', icon: Award }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTabWithMotion(item.id, item.labelEn)}
              className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-semibold transition ${
                isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
