"use client";

import { useState, useEffect } from "react";

// ── Raimak CRM Color System (Bright Navy) ────────────────────────────────────
const C = {
  bg:          "#F4F7FC",
  sidebar:     "#0E2347",
  card:        "#FFFFFF",
  border:      "#D1DFF0",
  cyan:        "#0284C7",
  green:       "#059669",
  amber:       "#D97706",
  purple:      "#7C3AED",
  red:         "#DC2626",
  text:        "#0F1E36",
  textMuted:   "#5A7A9F",
  activeBg:    "#1A3A6E",
};

const LOB = {
  Frontier:         { bg: "#E0F2FE", text: "#0284C7", border: "#BAE6FD", dot: "#0284C7" },
  Kinetic:          { bg: "#D1FAE5", text: "#059669", border: "#A7F3D0", dot: "#059669" },
  "Verizon Mobile": { bg: "#EDE9FE", text: "#7C3AED", border: "#DDD6FE", dot: "#7C3AED" },
};

const STAGE_COLOR = {
  Active:      "#059669",
  Negotiate:   "#D97706",
  Negotiation: "#D97706",
  Propose:     "#0284C7",
  Qualify:     "#64748B",
};

const accounts = [
  {
    id: 1, name: "City of Springfield", contact: "Dana Reyes",
    email: "dana@springfieldgov.org", city: "Springfield, IL", phone: "217-555-0182",
    revenue: "$2,400,000", employees: 850, lob: ["Frontier", "Verizon Mobile"],
    contracts: [
      { id: "C-001", name: "Fiber Infrastructure Upgrade", stage: "Active",      value: "$1,200,000", close: "12/31/2025", lob: "Frontier"       },
      { id: "C-002", name: "Enterprise Mobile Fleet",      stage: "Negotiation", value: "$840,000",   close: "9/15/2025",  lob: "Verizon Mobile" },
    ],
    timeline: [
      { type: "call",    label: "Call with Dana Reyes", date: "Today, 9:14 AM",    note: "Reviewed Q3 renewal terms for fiber contract."        },
      { type: "email",   label: "Email sent",           date: "Yesterday, 3:00 PM",note: "Sent updated pricing proposal for mobile fleet."       },
      { type: "meeting", label: "QBR Meeting",          date: "Jun 2, 2025",        note: "Quarterly business review — discussed expansion plans."},
    ],
  },
  {
    id: 2, name: "Hawthorne Logistics", contact: "Marcus Bell",
    email: "mbell@hawthorne.com", city: "Chicago, IL", phone: "312-555-0047",
    revenue: "$5,100,000", employees: 1200, lob: ["Kinetic", "Frontier"],
    contracts: [
      { id: "C-003", name: "SD-WAN Nationwide Rollout",      stage: "Propose", value: "$2,300,000", close: "10/01/2025", lob: "Kinetic"  },
      { id: "C-004", name: "Dark Fiber Lease — Chicago Hub", stage: "Active",  value: "$620,000",   close: "01/01/2026", lob: "Frontier" },
    ],
    timeline: [
      { type: "meeting", label: "Executive Briefing", date: "Jun 5, 2025", note: "Presented SD-WAN architecture to CTO and IT director."     },
      { type: "call",    label: "Follow-up call",     date: "Jun 3, 2025", note: "Marcus confirmed budget approval pending legal review."    },
    ],
  },
  {
    id: 3, name: "Meridian Health Group", contact: "Priya Nair",
    email: "p.nair@meridianhealth.org", city: "St. Louis, MO", phone: "314-555-0099",
    revenue: "$8,700,000", employees: 3400, lob: ["Verizon Mobile", "Kinetic"],
    contracts: [
      { id: "C-005", name: "HIPAA-Compliant Mobile Devices", stage: "Active",  value: "$3,100,000", close: "03/31/2026", lob: "Verizon Mobile" },
      { id: "C-006", name: "Hospital WAN Upgrade",           stage: "Qualify", value: "$1,400,000", close: "11/15/2025", lob: "Kinetic"        },
    ],
    timeline: [
      { type: "email", label: "RFP Response Sent", date: "Jun 6, 2025",  note: "Submitted full proposal in response to Meridian RFP."    },
      { type: "call",  label: "Discovery Call",    date: "May 28, 2025", note: "Identified need for HIPAA-compliant MDM solution."        },
    ],
  },
  {
    id: 4, name: "TerraVerde Construction", contact: "Luis Garza",
    email: "lgarza@terraverde.com", city: "Kansas City, MO", phone: "816-555-0213",
    revenue: "$1,800,000", employees: 410, lob: ["Frontier"],
    contracts: [
      { id: "C-007", name: "Field Office Connectivity", stage: "Negotiate", value: "$390,000", close: "08/31/2025", lob: "Frontier" },
    ],
    timeline: [
      { type: "call", label: "Intro Call", date: "Jun 1, 2025", note: "Discussed temporary connectivity needs for remote job sites." },
    ],
  },
];

const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" };

function useGoogleFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

const Label = ({ children, style, sidebar }) => (
  <span style={{ ...mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: sidebar ? "#4A90C4" : C.textMuted, ...style }}>
    {children}
  </span>
);

const LOBBadge = ({ lob }) => {
  const s = LOB[lob] || { bg: "#1a1a2e", text: "#aaa", border: "#aaa3", dot: "#aaa" };
  return (
    <span style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, borderRadius: 3, padding: "2px 8px", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, ...mono, letterSpacing: 0.5, textTransform: "uppercase" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, boxShadow: `0 0 5px ${s.dot}`, flexShrink: 0 }} />
      {lob}
    </span>
  );
};

const StageBadge = ({ stage }) => {
  const col = STAGE_COLOR[stage] || C.textMuted;
  return (
    <span style={{ background: col + "18", color: col, border: `1px solid ${col}55`, borderRadius: 3, padding: "2px 8px", fontSize: 10, fontWeight: 700, ...mono, letterSpacing: 0.5, textTransform: "uppercase" }}>
      {stage}
    </span>
  );
};

const TIcon = ({ type }) => <span style={{ fontSize: 13 }}>{{ call: "📞", email: "✉️", meeting: "📅" }[type] || "📌"}</span>;

export default function RaimakCRM() {
  useGoogleFonts();
  const [view, setView]     = useState("accounts");
  const [sel, setSel]       = useState(null);
  const [tab, setTab]       = useState("Summary");
  const [q, setQ]           = useState("");
  const [hov, setHov]       = useState(null);

  const filtered = accounts.filter(a =>
    a.name.toLowerCase().includes(q.toLowerCase()) ||
    a.contact.toLowerCase().includes(q.toLowerCase()) ||
    a.lob.some(l => l.toLowerCase().includes(q.toLowerCase()))
  );

  const nav = [
    { id: "accounts",   label: "Accounts",    icon: "▣" },
    { id: "pipeline",   label: "Pipeline",    icon: "◈", badge: "7" },
    { id: "contacts",   label: "Contacts",    icon: "◎" },
    { id: "activities", label: "Activity Log", icon: "◇" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", background: C.bg, color: C.text, display: "flex", height: "100vh", minHeight: "100vh", overflow: "hidden", fontSize: 13 }}>

      {/* SIDEBAR */}
      <div style={{ width: 200, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 6, background: C.cyan + "22", border: `1px solid ${C.cyan}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ ...mono, fontWeight: 900, fontSize: 14, color: C.cyan }}>R</span>
            </div>
            <div>
              <div style={{ ...mono, fontWeight: 900, fontSize: 13, color: "#FFFFFF", letterSpacing: 2 }}>RAIMAK</div>
              <div style={{ ...mono, fontSize: 9, color: "#93C5DE", letterSpacing: 1 }}>CRM • V1.0</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "10px 8px", flex: 1 }}>
          <Label sidebar style={{ padding: "0 8px 8px", display: "block" }}>Navigation</Label>
          {nav.map(n => {
            const active = view === n.id;
            return (
              <div key={n.id} onClick={() => { setView(n.id); setSel(null); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 4, cursor: "pointer", marginBottom: 1, background: active ? C.activeBg : "transparent", borderLeft: `2px solid ${active ? C.cyan : "transparent"}`, color: active ? C.cyan : "#93C5DE", transition: "all 0.12s" }}>
                <span style={{ ...mono, fontSize: 11 }}>{n.icon}</span>
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, flex: 1 }}>{n.label}</span>
                {n.badge && <span style={{ background: C.cyan + "22", color: C.cyan, borderRadius: 10, padding: "1px 7px", fontSize: 10, ...mono, fontWeight: 700 }}>{n.badge}</span>}
              </div>
            );
          })}

          <Label sidebar style={{ padding: "16px 8px 8px", display: "block" }}>Lines of Business</Label>
          {Object.entries(LOB).map(([name, s]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 4, cursor: "pointer", color: s.text, fontSize: 11 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0, boxShadow: `0 0 6px ${s.dot}` }} />
              <span style={{ fontWeight: 500, color: "#E0EEFF" }}>{name}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1A3A6E", border: "1px solid #2A5298", display: "flex", alignItems: "center", justifyContent: "center", ...mono, fontWeight: 700, fontSize: 11, color: "#67E8F9" }}>JD</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>Jordan Davis</div>
            <div style={{ fontSize: 10, color: C.textMuted }}>Account Executive</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Accounts List */}
        {(view === "accounts" || view === "contacts") && (
          <div style={{ width: sel ? 360 : "100%", borderRight: sel ? `1px solid ${C.border}` : "none", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ ...mono, fontWeight: 900, fontSize: 16, letterSpacing: 2, textTransform: "uppercase" }}>{view === "accounts" ? "Accounts" : "Contacts"}</div>
                <div style={{ ...mono, fontSize: 10, color: C.cyan, marginTop: 3, letterSpacing: 1 }}>// MY ACTIVE · {filtered.length} RECORDS</div>
              </div>
              <button style={{ background: C.cyan, border: "none", borderRadius: 4, color: "#000", padding: "7px 14px", fontWeight: 700, fontSize: 11, cursor: "pointer", ...mono, letterSpacing: 1 }}>+ ADD ACCOUNT</button>
            </div>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
              <input placeholder="// filter by keyword..." value={q} onChange={e => setQ(e.target.value)}
                style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "7px 12px", color: C.cyan, fontSize: 11, outline: "none", boxSizing: "border-box", ...mono }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr auto" : "2fr 1fr 1fr 1fr 150px", padding: "6px 16px", borderBottom: `1px solid ${C.border}`, background: C.card + "88" }}>
              {["Account Name", ...(!sel ? ["Phone", "City", "Primary Contact"] : []), "Lines of Business"].map(h => <Label key={h}>{h}</Label>)}
            </div>
            <div style={{ overflow: "auto", flex: 1 }}>
              {filtered.map(a => (
                <div key={a.id} onClick={() => { setSel(a); setTab("Summary"); }}
                  onMouseEnter={() => setHov(a.id)} onMouseLeave={() => setHov(null)}
                  style={{ display: "grid", gridTemplateColumns: sel ? "1fr auto" : "2fr 1fr 1fr 1fr 150px", padding: "10px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", alignItems: "center", background: sel?.id === a.id ? C.activeBg : hov === a.id ? C.card : "transparent", borderLeft: `2px solid ${sel?.id === a.id ? C.cyan : "transparent"}`, transition: "all 0.1s" }}>
                  <span style={{ color: C.cyan, fontWeight: 600, fontSize: 12 }}>{a.name}</span>
                  {!sel && <span style={{ color: C.textMuted, fontSize: 11, ...mono }}>{a.phone}</span>}
                  {!sel && <span style={{ color: C.textMuted, fontSize: 11 }}>{a.city}</span>}
                  {!sel && <span style={{ color: C.textMuted, fontSize: 11 }}>{a.contact}</span>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{a.lob.slice(0, sel ? 1 : 3).map(l => <LOBBadge key={l} lob={l} />)}</div>
                </div>
              ))}
              <div style={{ ...mono, fontSize: 10, color: C.textMuted, padding: "10px 16px" }}>Rows: {filtered.length}</div>
            </div>
          </div>
        )}

        {/* Pipeline */}
        {view === "pipeline" && (
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            <div style={{ ...mono, fontWeight: 900, fontSize: 16, letterSpacing: 2, textTransform: "uppercase" }}>Pipeline</div>
            <div style={{ ...mono, fontSize: 10, color: C.cyan, marginTop: 3, marginBottom: 20, letterSpacing: 1 }}>// CONTRACT PIPELINE STATUS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, minWidth: 800 }}>
              {["Qualify", "Propose", "Negotiate", "Active"].map(stage => {
                const col = STAGE_COLOR[stage];
                const contracts = accounts.flatMap(a =>
                  a.contracts.filter(c => c.stage === stage || (stage === "Negotiate" && c.stage === "Negotiation")).map(c => ({ ...c, account: a.name }))
                );
                const total = contracts.reduce((s, c) => s + parseFloat(c.value.replace(/[$,]/g, "")), 0);
                return (
                  <div key={stage}>
                    <div style={{ padding: "10px 12px", background: col + "18", borderTop: `2px solid ${col}`, borderRadius: "4px 4px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ ...mono, fontWeight: 800, color: col, fontSize: 11, letterSpacing: 1 }}>{stage.toUpperCase()}</span>
                      <span style={{ background: col + "33", color: col, borderRadius: 10, padding: "1px 8px", fontSize: 10, ...mono }}>{contracts.length}</span>
                    </div>
                    {total > 0 && <div style={{ ...mono, fontSize: 10, color: C.textMuted, marginBottom: 10, paddingLeft: 2 }}>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(total)} total</div>}
                    {contracts.map(c => (
                      <div key={c.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${col}`, borderRadius: 4, padding: 12, marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{c.name}</div>
                        <div style={{ color: C.textMuted, fontSize: 10, marginBottom: 8, ...mono }}>{c.account}</div>
                        <LOBBadge lob={c.lob} />
                        <div style={{ marginTop: 8, color: C.green, fontWeight: 800, fontSize: 14, ...mono }}>{c.value}</div>
                        <div style={{ color: C.textMuted, fontSize: 10, marginTop: 2, ...mono }}>CLOSE: {c.close}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity Log */}
        {view === "activities" && (
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            <div style={{ ...mono, fontWeight: 900, fontSize: 16, letterSpacing: 2, textTransform: "uppercase" }}>Activity Log</div>
            <div style={{ ...mono, fontSize: 10, color: C.cyan, marginTop: 3, marginBottom: 20, letterSpacing: 1 }}>// ALL INTERACTIONS ACROSS ACCOUNTS</div>
            {accounts.flatMap(a => a.timeline.map(t => ({ ...t, account: a.name }))).map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 4, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <TIcon type={t.type} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{t.label}</div>
                  <div style={{ color: C.cyan, fontSize: 10, marginTop: 2, ...mono }}>{t.account}</div>
                  <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>{t.note}</div>
                  <div style={{ color: C.textMuted, fontSize: 10, marginTop: 4, ...mono }}>{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Account Detail */}
        {sel && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 6, background: C.cyan + "18", border: `1px solid ${C.cyan}44`, display: "flex", alignItems: "center", justifyContent: "center", ...mono, fontWeight: 900, fontSize: 14, color: C.cyan }}>
                    {sel.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{sel.name}</div>
                    <div style={{ ...mono, fontSize: 9, color: C.cyan, marginTop: 3, letterSpacing: 1 }}>// ACCOUNT · {sel.city.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ ...mono, fontWeight: 800, color: C.green, fontSize: 14 }}>{sel.revenue}</div>
                    <Label>Annual Revenue</Label>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ ...mono, fontWeight: 800, fontSize: 14 }}>{sel.employees.toLocaleString()}</div>
                    <Label>Employees</Label>
                  </div>
                  <button onClick={() => setSel(null)} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4, color: C.textMuted, padding: "5px 10px", cursor: "pointer", fontSize: 11, ...mono }}>✕ CLOSE</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                {["Summary", "Contracts", "Timeline"].map(t => (
                  <div key={t} onClick={() => setTab(t)} style={{ padding: "5px 14px", cursor: "pointer", ...mono, fontSize: 10, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", color: tab === t ? C.cyan : C.textMuted, borderBottom: `2px solid ${tab === t ? C.cyan : "transparent"}` }}>{t}</div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              <div style={{ flex: 1, padding: 18, overflow: "auto" }}>

                {tab === "Summary" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.cyan}`, borderRadius: 4, padding: 16 }}>
                      <Label style={{ display: "block", marginBottom: 12 }}>Account Information</Label>
                      {[["Account Name", sel.name], ["Phone", sel.phone], ["City", sel.city], ["Annual Revenue", sel.revenue], ["Employees", sel.employees.toLocaleString()]].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                          <Label>{k}</Label>
                          <span style={{ fontWeight: 500, fontSize: 12, ...mono, color: C.text }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.purple}`, borderRadius: 4, padding: 16 }}>
                        <Label style={{ display: "block", marginBottom: 12 }}>Primary Contact</Label>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.purple + "33", border: `1px solid ${C.purple}55`, display: "flex", alignItems: "center", justifyContent: "center", ...mono, fontWeight: 800, fontSize: 12, color: C.purple }}>
                            {sel.contact.split(" ").map(w => w[0]).join("")}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: C.cyan, fontSize: 12 }}>{sel.contact}</div>
                            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, ...mono }}>{sel.email}</div>
                          </div>
                        </div>
                      </div>
                      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.amber}`, borderRadius: 4, padding: 16 }}>
                        <Label style={{ display: "block", marginBottom: 12 }}>Lines of Business</Label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{sel.lob.map(l => <LOBBadge key={l} lob={l} />)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === "Contracts" && (
                  <div>
                    <Label style={{ display: "block", marginBottom: 14 }}>Active Contracts & Opportunities</Label>
                    {sel.contracts.map(c => {
                      const col = STAGE_COLOR[c.stage] || C.textMuted;
                      return (
                        <div key={c.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${col}`, borderRadius: 4, padding: 14, marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.name}</div>
                              <div style={{ color: C.textMuted, fontSize: 10, marginBottom: 8, ...mono }}>{c.id} · CLOSE: {c.close}</div>
                              <div style={{ display: "flex", gap: 6 }}><StageBadge stage={c.stage} /><LOBBadge lob={c.lob} /></div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ ...mono, fontWeight: 900, fontSize: 16, color: C.green }}>{c.value}</div>
                              <Label style={{ display: "block", marginTop: 2 }}>Contract Value</Label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {tab === "Timeline" && (
                  <div>
                    <Label style={{ display: "block", marginBottom: 14 }}>Activity Timeline</Label>
                    <div style={{ background: C.cyan + "0D", border: `1px solid ${C.cyan}33`, borderLeft: `3px solid ${C.cyan}`, borderRadius: 4, padding: 14, marginBottom: 18 }}>
                      <div style={{ ...mono, fontWeight: 800, color: C.cyan, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>// AI HIGHLIGHTS</div>
                      {sel.timeline.map((t, i) => (
                        <div key={i} style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, display: "flex", gap: 6 }}>
                          <span style={{ color: C.cyan }}>▸</span> {t.note}
                        </div>
                      ))}
                    </div>
                    {sel.timeline.map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${C.border}`, marginBottom: 14 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 4, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <TIcon type={t.type} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{t.label}</div>
                          <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>{t.note}</div>
                          <div style={{ ...mono, color: C.textMuted, fontSize: 10, marginTop: 4 }}>{t.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Rail */}
              <div style={{ width: 210, borderLeft: `1px solid ${C.border}`, padding: 14, flexShrink: 0, overflow: "auto", background: "#F8FAFD", borderRadius: "0 0 0 0" }}>
                <Label style={{ display: "block", marginBottom: 10, color: C.textMuted }}>Assistant</Label>
                <div style={{ background: C.amber + "12", border: `1px solid ${C.amber}33`, borderLeft: `3px solid ${C.amber}`, borderRadius: 4, padding: 10, marginBottom: 14 }}>
                  <div style={{ ...mono, fontSize: 10, fontWeight: 800, color: C.amber, marginBottom: 5, letterSpacing: 1 }}>🔔 REMINDER</div>
                  {sel.contracts.slice(0, 1).map(c => (
                    <div key={c.id} style={{ fontSize: 11, color: C.textMuted }}>Closing soon: <span style={{ color: C.text, fontWeight: 600 }}>{c.name}</span></div>
                  ))}
                </div>
                <Label style={{ display: "block", marginBottom: 10, marginTop: 14 }}>Open Contracts</Label>
                {sel.contracts.map(c => {
                  const col = STAGE_COLOR[c.stage] || C.textMuted;
                  return (
                    <div key={c.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: 10, marginBottom: 8, borderTop: `2px solid ${col}` }}>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 5 }}>{c.name}</div>
                      <StageBadge stage={c.stage} />
                      <div style={{ ...mono, fontSize: 13, color: C.green, fontWeight: 800, marginTop: 6 }}>{c.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
