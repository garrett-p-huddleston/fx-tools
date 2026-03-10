import { useState } from "react";

const TIERS = [
  {
    id: 1,
    label: "TIER 1",
    subtitle: "High-Conviction Targets",
    color: "#C9A84C",
    description:
      "Your three primary firms. Bespoke, deeply researched outreach only. You are not applying — you are starting a relationship. One good conversation here changes everything.",
    tasks: [
      {
        id: "t1-1",
        firm: "Goldman Sachs",
        location: "London / Frankfurt",
        action:
          "Find 2–3 people on the FX or treasury desk via LinkedIn. Look for Associates or VPs (2–5 yrs tenure). Search: 'Goldman Sachs FX trader London' / 'Goldman Sachs treasury Frankfurt'",
      },
      {
        id: "t1-2",
        firm: "Brevan Howard",
        location: "Geneva",
        action:
          "Identify FX macro traders or risk managers. Brevan is relationship-driven — find anyone connected to the Geneva office. Search LinkedIn + check CFA Institute profiles. Note: roles rarely post publicly.",
      },
      {
        id: "t1-3",
        firm: "ING",
        location: "Luxembourg / Amsterdam",
        action:
          "Search 'ING treasury Amsterdam' and 'ING FX dealer'. ING has a large corporate treasury function — look for Treasury Dealer, FX Sales, or Risk roles. Also check DACT (Dutch Association of Corporate Treasurers) for ING members.",
      },
      {
        id: "t1-4",
        firm: "Booking Holdings",
        location: "Amsterdam",
        action:
          "Your prior primary target. Find the treasury team directly — search 'Booking Holdings treasury Amsterdam'. Look for FX risk or treasury analyst profiles. This is a corporate treasury function inside a tech multinational.",
      },
    ],
  },
  {
    id: 2,
    label: "TIER 2",
    subtitle: "Adjacent High-Quality Firms",
    color: "#8B9E8B",
    description:
      "Strong firms in your target cities with active FX or treasury functions. Personalized but templated outreach. Volume of 30–50 contacts. These are your pipeline depth.",
    tasks: [
      { id: "t2-1", firm: "ABN AMRO", location: "Amsterdam", action: "Large Dutch bank with active FX dealing and corporate treasury advisory. Search 'ABN AMRO FX Amsterdam'. Look for treasury sales and dealer roles." },
      { id: "t2-2", firm: "Rabobank", location: "Amsterdam / Utrecht", action: "Major Dutch financial institution with global FX and treasury operations. Search 'Rabobank treasury dealer' or 'Rabobank FX risk'." },
      { id: "t2-3", firm: "NIBC Bank", location: "Amsterdam", action: "Boutique Dutch bank with active treasury. Smaller team = higher access. Search 'NIBC treasury Amsterdam'." },
      { id: "t2-4", firm: "Airbus", location: "Amsterdam (treasury hub)", action: "Airbus runs a major treasury center in Amsterdam managing multi-currency FX exposure. Your Airbnb FX capstone maps directly here. Search 'Airbus treasury Amsterdam FX'." },
      { id: "t2-5", firm: "Heineken", location: "Amsterdam", action: "Large multinational with significant FX hedging needs across 190+ markets. Corporate treasury function based in Amsterdam. Search 'Heineken treasury FX Amsterdam'." },
      { id: "t2-6", firm: "Philips", location: "Amsterdam", action: "Global multinational with active FX and treasury risk management. Search 'Philips corporate treasury Amsterdam'." },
      { id: "t2-7", firm: "UBS", location: "Zurich", action: "Major Swiss bank with large FX and treasury operations. Search 'UBS FX dealer Zurich' or 'UBS treasury intern'. Note: competitive but active recruiters." },
      { id: "t2-8", firm: "Julius Baer", location: "Zurich", action: "Private bank with active FX dealing for UHNW clients. Search 'Julius Baer FX Zurich'. Smaller, more relationship-accessible than the bulge brackets." },
      { id: "t2-9", firm: "Nestlé", location: "Vevey / Zurich", action: "One of the world's largest multinationals — treasury manages FX across 186 countries. Search 'Nestlé treasury FX Vevey'." },
      { id: "t2-10", firm: "Novartis", location: "Basel / Zurich", action: "Major pharma multinational with sophisticated FX hedging program. Search 'Novartis treasury Basel FX'." },
      { id: "t2-11", firm: "HSBC", location: "London", action: "One of the largest FX dealers globally. Search 'HSBC FX London' and 'HSBC treasury intern'. Their Global Markets graduate program is worth checking." },
      { id: "t2-12", firm: "Barclays", location: "London", action: "Active FX dealer and corporate treasury advisory. Search 'Barclays FX London' and 'Barclays treasury risk intern'." },
      { id: "t2-13", firm: "Standard Chartered", location: "London", action: "Strong emerging markets FX focus — your Spanish and international profile is relevant here. Search 'Standard Chartered FX treasury London'." },
      { id: "t2-14", firm: "Shell", location: "London / The Hague", action: "Massive commodity-linked FX exposure. Shell's treasury is one of the most sophisticated corporate treasury functions in the world. Search 'Shell treasury FX London'." },
      { id: "t2-15", firm: "Unilever", location: "London / Rotterdam", action: "Consumer goods multinational with active FX hedging across 190+ markets. Search 'Unilever treasury FX London'." },
    ],
  },
  {
    id: 3,
    label: "TIER 3",
    subtitle: "Volume & Warm Network",
    color: "#7A8A9A",
    description:
      "Auburn alumni abroad, CFA charterholders, professional association members. You're not asking for anything — you're building awareness. Cast wide, let response rate filter.",
    tasks: [
      { id: "t3-1", firm: "Auburn Alumni Network", location: "Netherlands / UK / Switzerland", action: "Go to LinkedIn → Search Auburn University alumni → Filter by location (Netherlands, United Kingdom, Switzerland) → Filter by industry (Financial Services, Banking, Capital Markets). Connect with every relevant result." },
      { id: "t3-2", firm: "DACT", location: "Netherlands", action: "Dutch Association of Corporate Treasurers. Find their LinkedIn page and follow. Look for members who post publicly — engage with their content before cold messaging." },
      { id: "t3-3", firm: "ACT (UK)", location: "London", action: "Association of Corporate Treasurers. Large UK professional body. Search 'ACT treasury London' on LinkedIn. Members are actively engaged — this is a warm community, not a cold list." },
      { id: "t3-4", firm: "EACT", location: "Europe-wide", action: "European Association of Corporate Treasurers. Find their LinkedIn presence and member companies. Look for conference speakers and panelists." },
      { id: "t3-5", firm: "CFA Institute Members", location: "Amsterdam / Zurich / London", action: "Search LinkedIn for CFA charterholders with treasury or FX titles in your target cities. Filter: 'CFA' in title + 'treasury' or 'FX' + location." },
      { id: "t3-6", firm: "LinkedIn FX/Treasury Communities", location: "Global", action: "Search and join LinkedIn groups: 'Corporate Treasury Network', 'FX Markets Professionals', 'Treasury & Cash Management'. Post once every 1–2 weeks about FX topics to build passive visibility." },
      { id: "t3-7", firm: "MSF Program Network", location: "Auburn → Europe", action: "Ask your MSF program director directly: does anyone in the Auburn finance faculty have European industry contacts? Are there alumni from the MSF program now working in Europe?" },
    ],
  },
];

const STORAGE_KEY = "fx-outreach-checked";

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export default function OutreachTodo() {
  const [checked, setChecked] = useState(loadChecked);
  const [expanded, setExpanded] = useState({ 1: true, 2: true, 3: true });

  const toggle = (id) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleTier = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalTasks = TIERS.flatMap((t) => t.tasks).length;
  const completedTasks = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Georgia', 'Times New Roman', serif", padding: "48px 24px", color: "#1C1C1C" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#C9A84C", textTransform: "uppercase", marginBottom: 8, fontFamily: "'Courier New', monospace" }}>
            FX Treasury — European Search
          </div>
          <h1 style={{ fontSize: 28, fontWeight: "normal", margin: "0 0 6px 0", letterSpacing: "-0.01em", color: "#1C1C1C" }}>
            Outreach Research Checklist
          </h1>
          <div style={{ fontSize: 13, color: "#666", fontFamily: "'Courier New', monospace" }}>
            Amsterdam · London · Zurich · Geneva
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'Courier New', monospace", color: "#888", marginBottom: 6 }}>
              <span>PROGRESS</span>
              <span>{completedTasks}/{totalTasks} — {pct}%</span>
            </div>
            <div style={{ height: 2, background: "#DDD5C4", borderRadius: 1 }}>
              <div style={{ height: 2, width: `${pct}%`, background: "#C9A84C", borderRadius: 1, transition: "width 0.4s ease" }} />
            </div>
          </div>
        </div>

        {TIERS.map((tier) => {
          const tierCompleted = tier.tasks.filter((t) => checked[t.id]).length;
          const isOpen = expanded[tier.id];
          return (
            <div key={tier.id} style={{ marginBottom: 32 }}>
              <button onClick={() => toggleTier(tier.id)} style={{ width: "100%", background: "none", border: "none", borderTop: `2px solid ${tier.color}`, padding: "16px 0 12px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.2em", color: tier.color, fontFamily: "'Courier New', monospace", fontWeight: "bold" }}>{tier.label}</span>
                    <span style={{ fontSize: 15, color: "#1C1C1C", fontWeight: "normal" }}>{tier.subtitle}</span>
                    <span style={{ fontSize: 10, fontFamily: "'Courier New', monospace", color: "#999" }}>{tierCompleted}/{tier.tasks.length}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", lineHeight: 1.6, maxWidth: 580 }}>{tier.description}</p>
                </div>
                <span style={{ fontSize: 12, color: "#999", fontFamily: "'Courier New', monospace", marginTop: 2, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div style={{ paddingTop: 4 }}>
                  {tier.tasks.map((task) => {
                    const done = !!checked[task.id];
                    return (
                      <div key={task.id} onClick={() => toggle(task.id)} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid #E8E0D0", cursor: "pointer", opacity: done ? 0.45 : 1, transition: "opacity 0.2s ease" }}>
                        <div style={{ width: 16, height: 16, border: `1.5px solid ${done ? tier.color : "#BBB0A0"}`, borderRadius: 2, flexShrink: 0, marginTop: 2, background: done ? tier.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease" }}>
                          {done && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 14, fontWeight: "bold", color: done ? "#999" : "#1C1C1C", textDecoration: done ? "line-through" : "none" }}>{task.firm}</span>
                            <span style={{ fontSize: 10, fontFamily: "'Courier New', monospace", color: tier.color, letterSpacing: "0.08em" }}>{task.location}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 12, color: done ? "#AAA" : "#555", lineHeight: 1.65 }}>{task.action}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid #DDD5C4", fontSize: 11, fontFamily: "'Courier New', monospace", color: "#AAA", display: "flex", justifyContent: "space-between" }}>
          <span>TARGET: 10 T1 · 30–50 T2 · 20+ T3/week</span>
          <span>June–December 2026</span>
        </div>
      </div>
    </div>
  );
}
