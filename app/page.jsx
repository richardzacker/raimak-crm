"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// ── Color System ─────────────────────────────────────────────────────────────
const C = {
  bg:       "#F4F7FC", sidebar: "#0E2347", card: "#FFFFFF",
  border:   "#D1DFF0", cyan:    "#0284C7", green:  "#059669",
  amber:    "#D97706", purple:  "#7C3AED", red:    "#DC2626",
  text:     "#0F1E36", textMuted: "#5A7A9F", activeBg: "#1A3A6E",
};
const LOB = {
  Frontier:         { bg:"#E0F2FE", text:"#0284C7", border:"#BAE6FD", dot:"#0284C7" },
  Kinetic:          { bg:"#D1FAE5", text:"#059669", border:"#A7F3D0", dot:"#059669" },
  "Verizon Mobile": { bg:"#EDE9FE", text:"#7C3AED", border:"#DDD6FE", dot:"#7C3AED" },
};
const STAGE_COLOR = {
  Active:"#059669", Negotiate:"#D97706", Negotiation:"#D97706",
  Propose:"#0284C7", Qualify:"#64748B",
};
const ORDER_STATUS_COLOR = {
  "Pending":   "#D97706",
  "Scheduled": "#0284C7",
  "Installed": "#059669",
  "Cancelled": "#DC2626",
};
const mono = { fontFamily:"'JetBrains Mono','Fira Code','Courier New',monospace" };

// ── Seed Data ─────────────────────────────────────────────────────────────────
const AGENTS = [
  { id:"a1", name:"Jordan Davis",   sales:18, revenue:142000, installs:15 },
  { id:"a2", name:"Priya Nair",     sales:24, revenue:198000, installs:22 },
  { id:"a3", name:"Marcus Bell",    sales:11, revenue:87000,  installs:10 },
  { id:"a4", name:"Dana Reyes",     sales:19, revenue:155000, installs:17 },
  { id:"a5", name:"Luis Garza",     sales:8,  revenue:64000,  installs:7  },
];
const initAccounts = [
  { id:1, name:"City of Springfield",   contact:"Dana Reyes",   email:"dana@springfieldgov.org",  city:"Springfield, IL", phone:"217-555-0182", revenue:"$2,400,000", employees:850,  lob:["Frontier","Verizon Mobile"],
    contracts:[
      { id:"C-001", name:"Fiber Infrastructure Upgrade", stage:"Active",      value:"$1,200,000", close:"12/31/2025", lob:"Frontier"       },
      { id:"C-002", name:"Enterprise Mobile Fleet",      stage:"Negotiation", value:"$840,000",   close:"9/15/2025",  lob:"Verizon Mobile" },
    ],
    orders:[
      { id:"O-001", product:"Fiber 1Gig Install",    status:"Installed", installDate:"2025-03-15", agent:"Dana Reyes",   value:"$4,200"  },
      { id:"O-002", product:"Mobile Device Package", status:"Scheduled", installDate:"2025-07-10", agent:"Jordan Davis", value:"$8,700"  },
    ],
    timeline:[
      { type:"call",    label:"Call with Dana Reyes", date:"Today, 9:14 AM",    note:"Reviewed Q3 renewal terms for fiber contract." },
      { type:"email",   label:"Email sent",           date:"Yesterday, 3:00 PM",note:"Sent updated pricing proposal for mobile fleet." },
      { type:"meeting", label:"QBR Meeting",          date:"Jun 2, 2025",        note:"Quarterly business review — discussed expansion plans." },
    ],
  },
  { id:2, name:"Hawthorne Logistics",   contact:"Marcus Bell",  email:"mbell@hawthorne.com",       city:"Chicago, IL",     phone:"312-555-0047", revenue:"$5,100,000", employees:1200, lob:["Kinetic","Frontier"],
    contracts:[
      { id:"C-003", name:"SD-WAN Nationwide Rollout",      stage:"Propose", value:"$2,300,000", close:"10/01/2025", lob:"Kinetic"  },
      { id:"C-004", name:"Dark Fiber Lease — Chicago Hub", stage:"Active",  value:"$620,000",   close:"01/01/2026", lob:"Frontier" },
    ],
    orders:[
      { id:"O-003", product:"SD-WAN Node x12",     status:"Pending",   installDate:"2025-08-20", agent:"Marcus Bell", value:"$14,400" },
      { id:"O-004", product:"Dark Fiber Activation",status:"Installed", installDate:"2025-02-01", agent:"Priya Nair",  value:"$6,000"  },
    ],
    timeline:[
      { type:"meeting", label:"Executive Briefing", date:"Jun 5, 2025", note:"Presented SD-WAN architecture to CTO." },
      { type:"call",    label:"Follow-up call",     date:"Jun 3, 2025", note:"Marcus confirmed budget approval pending legal." },
    ],
  },
  { id:3, name:"Meridian Health Group", contact:"Priya Nair",   email:"p.nair@meridianhealth.org", city:"St. Louis, MO",   phone:"314-555-0099", revenue:"$8,700,000", employees:3400, lob:["Verizon Mobile","Kinetic"],
    contracts:[
      { id:"C-005", name:"HIPAA-Compliant Mobile Devices", stage:"Active",  value:"$3,100,000", close:"03/31/2026", lob:"Verizon Mobile" },
      { id:"C-006", name:"Hospital WAN Upgrade",           stage:"Qualify", value:"$1,400,000", close:"11/15/2025", lob:"Kinetic"        },
    ],
    orders:[
      { id:"O-005", product:"MDM Suite x200",     status:"Installed", installDate:"2025-01-15", agent:"Priya Nair",   value:"$22,000" },
      { id:"O-006", product:"WAN Equipment",      status:"Scheduled", installDate:"2025-09-01", agent:"Jordan Davis", value:"$11,200" },
    ],
    timeline:[
      { type:"email", label:"RFP Response Sent", date:"Jun 6, 2025",  note:"Submitted full proposal in response to Meridian RFP." },
      { type:"call",  label:"Discovery Call",    date:"May 28, 2025", note:"Identified need for HIPAA-compliant MDM solution."    },
    ],
  },
  { id:4, name:"TerraVerde Construction",contact:"Luis Garza",  email:"lgarza@terraverde.com",     city:"Kansas City, MO", phone:"816-555-0213", revenue:"$1,800,000", employees:410,  lob:["Frontier"],
    contracts:[
      { id:"C-007", name:"Field Office Connectivity", stage:"Negotiate", value:"$390,000", close:"08/31/2025", lob:"Frontier" },
    ],
    orders:[
      { id:"O-007", product:"Temp Connectivity Kit", status:"Pending", installDate:"2025-08-01", agent:"Luis Garza", value:"$3,100" },
    ],
    timeline:[
      { type:"call", label:"Intro Call", date:"Jun 1, 2025", note:"Discussed connectivity needs for remote job sites." },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function useGoogleFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel  = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700;800&display=swap";
    document.head.appendChild(l);
  }, []);
}

const Label = ({ children, style, light }) => (
  <span style={{ ...mono, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color: light ? "#4A90C4" : C.textMuted, ...style }}>
    {children}
  </span>
);
const LOBBadge = ({ lob }) => {
  const s = LOB[lob] || { bg:"#f3f4f6", text:"#374151", border:"#e5e7eb", dot:"#9ca3af" };
  return (
    <span style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}`, borderRadius:3, padding:"2px 8px", fontSize:10, fontWeight:700, display:"inline-flex", alignItems:"center", gap:5, ...mono, letterSpacing:0.5, textTransform:"uppercase" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, flexShrink:0 }} />{lob}
    </span>
  );
};
const StageBadge = ({ stage }) => {
  const col = STAGE_COLOR[stage] || C.textMuted;
  return <span style={{ background:col+"18", color:col, border:`1px solid ${col}55`, borderRadius:3, padding:"2px 8px", fontSize:10, fontWeight:700, ...mono, letterSpacing:0.5, textTransform:"uppercase" }}>{stage}</span>;
};
const StatusBadge = ({ status }) => {
  const col = ORDER_STATUS_COLOR[status] || C.textMuted;
  return <span style={{ background:col+"18", color:col, border:`1px solid ${col}55`, borderRadius:3, padding:"2px 8px", fontSize:10, fontWeight:700, ...mono, letterSpacing:0.5, textTransform:"uppercase" }}>{status}</span>;
};
const Card = ({ children, style, topColor }) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderTop: topColor ? `2px solid ${topColor}` : `1px solid ${C.border}`, borderRadius:6, padding:16, ...style }}>
    {children}
  </div>
);
const Modal = ({ title, onClose, children }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, width:520, maxHeight:"85vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ ...mono, fontWeight:800, fontSize:13, letterSpacing:1.5, textTransform:"uppercase", color:C.text }}>{title}</div>
        <button onClick={onClose} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:4, color:C.textMuted, padding:"4px 10px", cursor:"pointer", fontSize:12 }}>✕</button>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  </div>
);
const Field = ({ label, children }) => (
  <div style={{ marginBottom:14 }}>
    <Label style={{ display:"block", marginBottom:5 }}>{label}</Label>
    {children}
  </div>
);
const Input = ({ value, onChange, placeholder, type }) => (
  <input type={type||"text"} value={value} onChange={onChange} placeholder={placeholder||""}
    style={{ width:"100%", background:"#F8FAFD", border:`1px solid ${C.border}`, borderRadius:4, padding:"8px 12px", color:C.text, fontSize:12, outline:"none", boxSizing:"border-box", fontFamily:"Inter, sans-serif" }} />
);
const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange}
    style={{ width:"100%", background:"#F8FAFD", border:`1px solid ${C.border}`, borderRadius:4, padding:"8px 12px", color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
const Btn = ({ onClick, children, variant, style }) => (
  <button onClick={onClick} style={{
    background: variant==="outline" ? "transparent" : C.cyan,
    border: variant==="outline" ? `1px solid ${C.border}` : "none",
    color: variant==="outline" ? C.textMuted : "#fff",
    borderRadius:4, padding:"8px 16px", fontWeight:700, fontSize:12,
    cursor:"pointer", ...mono, letterSpacing:0.5, ...style
  }}>{children}</button>
);

// ── Metric Card ───────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, color, icon }) => (
  <Card topColor={color} style={{ padding:16 }}>
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
      <div>
        <Label style={{ display:"block", marginBottom:6 }}>{label}</Label>
        <div style={{ ...mono, fontSize:28, fontWeight:900, color:color||C.text, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:11, color:C.textMuted, marginTop:4 }}>{sub}</div>}
      </div>
      <span style={{ fontSize:22 }}>{icon}</span>
    </div>
  </Card>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function RaimakCRM() {
  useGoogleFonts();
  const [accounts, setAccounts] = useState(initAccounts);
  const [view, setView]   = useState("accounts");
  const [sel,  setSel]    = useState(null);
  const [tab,  setTab]    = useState("Summary");
  const [q,    setQ]      = useState("");
  const [hov,  setHov]    = useState(null);
  const [reportTab, setReportTab] = useState("sales");

  // Modals
  const [showAddAccount,  setShowAddAccount]  = useState(false);
  const [showAddContract, setShowAddContract] = useState(false);
  const [showAddOrder,    setShowAddOrder]    = useState(false);

  // Add Account form
  const [newAccount, setNewAccount] = useState({ name:"", contact:"", email:"", phone:"", city:"", revenue:"", employees:"", lob:["Frontier"] });

  // Add Contract form
  const [newContract, setNewContract] = useState({ name:"", value:"", stage:"Qualify", close:"", lob:"Frontier" });

  // Add Order form
  const [newOrder, setNewOrder] = useState({ product:"", status:"Pending", installDate:"", agent:"Jordan Davis", value:"" });

  const filtered = accounts.filter(a =>
    a.name.toLowerCase().includes(q.toLowerCase()) ||
    a.contact.toLowerCase().includes(q.toLowerCase()) ||
    a.lob.some(l => l.toLowerCase().includes(q.toLowerCase()))
  );

  // Aggregate stats
  const allOrders    = accounts.flatMap(a => (a.orders||[]).map(o => ({ ...o, account:a.name })));
  const allContracts = accounts.flatMap(a => a.contracts.map(c => ({ ...c, account:a.name })));
  const totalRevenue = allContracts.reduce((s,c) => s + parseFloat(c.value.replace(/[$,]/g,"")), 0);
  const activeCount  = allContracts.filter(c => c.stage==="Active").length;
  const pendingOrders= allOrders.filter(o => o.status==="Pending").length;
  const installedOrders = allOrders.filter(o => o.status==="Installed").length;

  // Revenue by LOB for pie
  const revByLOB = Object.keys(LOB).map(l => ({
    name: l,
    value: allContracts.filter(c=>c.lob===l).reduce((s,c)=>s+parseFloat(c.value.replace(/[$,]/g,"")),0)
  }));
  const LOB_PIE_COLORS = ["#0284C7","#059669","#7C3AED"];

  // Monthly pipeline (mock)
  const monthlyData = [
    { month:"Jan", revenue:42000, installs:8  },
    { month:"Feb", revenue:68000, installs:12 },
    { month:"Mar", revenue:55000, installs:9  },
    { month:"Apr", revenue:91000, installs:17 },
    { month:"May", revenue:78000, installs:14 },
    { month:"Jun", revenue:112000,installs:21 },
  ];

  // Handlers
  const handleAddAccount = () => {
    const a = { ...newAccount, id: Date.now(), employees: parseInt(newAccount.employees)||0, contracts:[], orders:[], timeline:[] };
    setAccounts(prev => [...prev, a]);
    setNewAccount({ name:"", contact:"", email:"", phone:"", city:"", revenue:"", employees:"", lob:["Frontier"] });
    setShowAddAccount(false);
  };
  const handleAddContract = () => {
    const c = { ...newContract, id:`C-${Date.now()}` };
    setAccounts(prev => prev.map(a => a.id===sel.id ? { ...a, contracts:[...a.contracts, c] } : a));
    setSel(prev => ({ ...prev, contracts:[...prev.contracts, c] }));
    setNewContract({ name:"", value:"", stage:"Qualify", close:"", lob:"Frontier" });
    setShowAddContract(false);
  };
  const handleAddOrder = () => {
    const o = { ...newOrder, id:`O-${Date.now()}` };
    setAccounts(prev => prev.map(a => a.id===sel.id ? { ...a, orders:[...(a.orders||[]), o] } : a));
    setSel(prev => ({ ...prev, orders:[...(prev.orders||[]), o] }));
    setNewOrder({ product:"", status:"Pending", installDate:"", agent:"Jordan Davis", value:"" });
    setShowAddOrder(false);
  };

  const navItems = [
    { id:"accounts",  label:"Accounts",    icon:"▣" },
    { id:"pipeline",  label:"Pipeline",    icon:"◈", badge: allContracts.filter(c=>c.stage!=="Active").length },
    { id:"orders",    label:"Orders",      icon:"◉", badge: pendingOrders||null },
    { id:"reports",   label:"Reports",     icon:"◇" },
    { id:"activities",label:"Activity Log",icon:"≡" },
  ];

  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", background:C.bg, color:C.text, display:"flex", height:"100vh", overflow:"hidden", fontSize:13 }}>

      {/* SIDEBAR */}
      <div style={{ width:210, background:C.sidebar, borderRight:`1px solid #1A3A6B`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid #1A3A6B" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:6, background:"#22D3EE22", border:"1px solid #22D3EE55", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ ...mono, fontWeight:900, fontSize:14, color:"#38BDF8" }}>R</span>
            </div>
            <div>
              <div style={{ ...mono, fontWeight:900, fontSize:13, color:"#FFFFFF", letterSpacing:2 }}>RAIMAK</div>
              <div style={{ ...mono, fontSize:9, color:"#93C5DE", letterSpacing:1 }}>CRM • V2.0</div>
            </div>
          </div>
        </div>
        <div style={{ padding:"10px 8px", flex:1, overflowY:"auto" }}>
          <Label light style={{ padding:"0 8px 8px", display:"block" }}>Navigation</Label>
          {navItems.map(n => {
            const active = view===n.id;
            return (
              <div key={n.id} onClick={() => { setView(n.id); setSel(null); }}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:4, cursor:"pointer", marginBottom:1, background: active ? C.activeBg : "transparent", borderLeft:`2px solid ${active ? "#38BDF8" : "transparent"}`, color: active ? "#38BDF8" : "#93C5DE", transition:"all 0.12s" }}>
                <span style={{ ...mono, fontSize:11 }}>{n.icon}</span>
                <span style={{ fontSize:12, fontWeight: active ? 600 : 400, flex:1 }}>{n.label}</span>
                {n.badge ? <span style={{ background:"#22D3EE22", color:"#38BDF8", borderRadius:10, padding:"1px 7px", fontSize:10, ...mono, fontWeight:700 }}>{n.badge}</span> : null}
              </div>
            );
          })}
          <Label light style={{ padding:"16px 8px 8px", display:"block" }}>Lines of Business</Label>
          {Object.entries(LOB).map(([name,s]) => (
            <div key={name} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", borderRadius:4, cursor:"pointer", fontSize:11 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0, boxShadow:`0 0 6px ${s.dot}` }} />
              <span style={{ fontWeight:500, color:"#E0EEFF" }}>{name}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:12, borderTop:"1px solid #1A3A6B", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"#1A3A6E", border:"1px solid #2A5298", display:"flex", alignItems:"center", justifyContent:"center", ...mono, fontWeight:700, fontSize:11, color:"#67E8F9" }}>JD</div>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"#F0F6FF" }}>Jordan Davis</div>
            <div style={{ fontSize:10, color:"#93C5DE" }}>Account Executive</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ── ACCOUNTS ── */}
        {(view==="accounts" || view==="contacts") && (
          <div style={{ width: sel ? 380 : "100%", borderRight: sel ? `1px solid ${C.border}` : "none", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div>
                <div style={{ ...mono, fontWeight:900, fontSize:16, letterSpacing:2, textTransform:"uppercase" }}>Accounts</div>
                <div style={{ ...mono, fontSize:10, color:C.cyan, marginTop:3, letterSpacing:1 }}>// MY ACTIVE · {filtered.length} RECORDS</div>
              </div>
              <Btn onClick={() => setShowAddAccount(true)}>+ ADD ACCOUNT</Btn>
            </div>
            <div style={{ padding:"10px 16px", borderBottom:`1px solid ${C.border}` }}>
              <input placeholder="// filter by keyword..." value={q} onChange={e=>setQ(e.target.value)}
                style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"7px 12px", color:C.cyan, fontSize:11, outline:"none", boxSizing:"border-box", ...mono }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns: sel ? "1fr auto" : "2fr 1fr 1fr 1fr 160px", padding:"6px 16px", borderBottom:`1px solid ${C.border}`, background:"#F8FAFD" }}>
              {["Account Name", ...(!sel?["Phone","City","Primary Contact"]:[]), "Lines of Business"].map(h=><Label key={h}>{h}</Label>)}
            </div>
            <div style={{ overflow:"auto", flex:1 }}>
              {filtered.map(a => (
                <div key={a.id} onClick={() => { setSel(a); setTab("Summary"); }}
                  onMouseEnter={()=>setHov(a.id)} onMouseLeave={()=>setHov(null)}
                  style={{ display:"grid", gridTemplateColumns: sel ? "1fr auto" : "2fr 1fr 1fr 1fr 160px", padding:"10px 16px", borderBottom:`1px solid ${C.border}`, cursor:"pointer", alignItems:"center", background: sel?.id===a.id ? "#EFF6FF" : hov===a.id ? "#F8FAFD" : "transparent", borderLeft:`2px solid ${sel?.id===a.id ? C.cyan : "transparent"}`, transition:"all 0.1s" }}>
                  <span style={{ color:C.cyan, fontWeight:600, fontSize:12 }}>{a.name}</span>
                  {!sel && <span style={{ color:C.textMuted, fontSize:11, ...mono }}>{a.phone}</span>}
                  {!sel && <span style={{ color:C.textMuted, fontSize:11 }}>{a.city}</span>}
                  {!sel && <span style={{ color:C.textMuted, fontSize:11 }}>{a.contact}</span>}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>{a.lob.slice(0, sel?1:3).map(l=><LOBBadge key={l} lob={l}/>)}</div>
                </div>
              ))}
              <div style={{ ...mono, fontSize:10, color:C.textMuted, padding:"10px 16px" }}>Rows: {filtered.length}</div>
            </div>
          </div>
        )}

        {/* ── PIPELINE ── */}
        {view==="pipeline" && (
          <div style={{ flex:1, overflow:"auto", padding:20 }}>
            <div style={{ ...mono, fontWeight:900, fontSize:16, letterSpacing:2, textTransform:"uppercase" }}>Pipeline</div>
            <div style={{ ...mono, fontSize:10, color:C.cyan, marginTop:3, marginBottom:20, letterSpacing:1 }}>// CONTRACT PIPELINE STATUS</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, minWidth:800 }}>
              {["Qualify","Propose","Negotiate","Active"].map(stage => {
                const col = STAGE_COLOR[stage];
                const contracts = accounts.flatMap(a => a.contracts.filter(c=>c.stage===stage||(stage==="Negotiate"&&c.stage==="Negotiation")).map(c=>({...c,account:a.name})));
                const total = contracts.reduce((s,c)=>s+parseFloat(c.value.replace(/[$,]/g,"")),0);
                return (
                  <div key={stage}>
                    <div style={{ padding:"10px 12px", background:col+"18", borderTop:`2px solid ${col}`, borderRadius:"4px 4px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ ...mono, fontWeight:800, color:col, fontSize:11, letterSpacing:1 }}>{stage.toUpperCase()}</span>
                      <span style={{ background:col+"33", color:col, borderRadius:10, padding:"1px 8px", fontSize:10, ...mono }}>{contracts.length}</span>
                    </div>
                    {total>0 && <div style={{ ...mono, fontSize:10, color:C.textMuted, marginBottom:10, paddingLeft:2 }}>{new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(total)} total</div>}
                    {contracts.map(c => (
                      <Card key={c.id} topColor={col} style={{ padding:12, marginBottom:8, cursor:"pointer" }}>
                        <div style={{ fontWeight:600, fontSize:12, marginBottom:4 }}>{c.name}</div>
                        <div style={{ color:C.textMuted, fontSize:10, marginBottom:8, ...mono }}>{c.account}</div>
                        <LOBBadge lob={c.lob}/>
                        <div style={{ marginTop:8, color:C.green, fontWeight:800, fontSize:14, ...mono }}>{c.value}</div>
                        <div style={{ color:C.textMuted, fontSize:10, marginTop:2, ...mono }}>CLOSE: {c.close}</div>
                      </Card>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {view==="orders" && (
          <div style={{ flex:1, overflow:"auto", padding:20 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
              <div>
                <div style={{ ...mono, fontWeight:900, fontSize:16, letterSpacing:2, textTransform:"uppercase" }}>Orders</div>
                <div style={{ ...mono, fontSize:10, color:C.cyan, marginTop:3, letterSpacing:1 }}>// INSTALL DATES & ORDER STATUSES · {allOrders.length} RECORDS</div>
              </div>
            </div>
            {/* Status summary */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
              {Object.entries(ORDER_STATUS_COLOR).map(([status,col]) => {
                const count = allOrders.filter(o=>o.status===status).length;
                return (
                  <Card key={status} topColor={col} style={{ padding:14 }}>
                    <Label style={{ display:"block", marginBottom:6 }}>{status}</Label>
                    <div style={{ ...mono, fontSize:26, fontWeight:900, color:col }}>{count}</div>
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>orders</div>
                  </Card>
                );
              })}
            </div>
            {/* Orders table */}
            <Card>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr 1fr", padding:"8px 12px", borderBottom:`1px solid ${C.border}`, background:"#F8FAFD", borderRadius:"4px 4px 0 0" }}>
                {["Order ID","Product","Account","Agent","Install Date","Status"].map(h=><Label key={h}>{h}</Label>)}
              </div>
              {allOrders.map((o,i) => (
                <div key={o.id} style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr 1fr", padding:"11px 12px", borderBottom:`1px solid ${C.border}`, alignItems:"center", background: i%2===0 ? "#FFFFFF" : "#F8FAFD" }}>
                  <span style={{ ...mono, fontSize:11, color:C.cyan, fontWeight:700 }}>{o.id}</span>
                  <span style={{ fontSize:12, fontWeight:500 }}>{o.product}</span>
                  <span style={{ fontSize:11, color:C.textMuted }}>{o.account}</span>
                  <span style={{ fontSize:11, color:C.textMuted }}>{o.agent}</span>
                  <span style={{ ...mono, fontSize:11 }}>{o.installDate}</span>
                  <StatusBadge status={o.status}/>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── REPORTS ── */}
        {view==="reports" && (
          <div style={{ flex:1, overflow:"auto", padding:20 }}>
            <div style={{ ...mono, fontWeight:900, fontSize:16, letterSpacing:2, textTransform:"uppercase" }}>Reports</div>
            <div style={{ ...mono, fontSize:10, color:C.cyan, marginTop:3, marginBottom:16, letterSpacing:1 }}>// SALES · INSTALLS · ORDERS · REVENUE</div>

            {/* Report Tabs */}
            <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:`1px solid ${C.border}`, paddingBottom:0 }}>
              {[["sales","Agent Sales"],["installs","Install Dates"],["orders","Order Status"],["revenue","Revenue"]].map(([id,label]) => (
                <div key={id} onClick={()=>setReportTab(id)}
                  style={{ padding:"8px 16px", cursor:"pointer", ...mono, fontSize:10, letterSpacing:1, fontWeight:700, textTransform:"uppercase", color: reportTab===id ? C.cyan : C.textMuted, borderBottom:`2px solid ${reportTab===id ? C.cyan : "transparent"}`, marginBottom:-1 }}>
                  {label}
                </div>
              ))}
            </div>

            {/* Agent Sales */}
            {reportTab==="sales" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
                  <MetricCard label="Total Sales" value={AGENTS.reduce((s,a)=>s+a.sales,0)} sub="All agents combined" color={C.cyan} icon="🏆"/>
                  <MetricCard label="Total Revenue" value={"$"+new Intl.NumberFormat("en-US").format(AGENTS.reduce((s,a)=>s+a.revenue,0))} sub="Closed contracts" color={C.green} icon="💰"/>
                  <MetricCard label="Top Agent" value={AGENTS.sort((a,b)=>b.sales-a.sales)[0].name.split(" ")[0]} sub={`${AGENTS[0].sales} sales this period`} color={C.amber} icon="⭐"/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <Card topColor={C.cyan}>
                    <Label style={{ display:"block", marginBottom:14 }}>Sales by Agent</Label>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={AGENTS}>
                        <XAxis dataKey="name" tick={{ fontSize:10, fill:C.textMuted }} tickFormatter={v=>v.split(" ")[0]}/>
                        <YAxis tick={{ fontSize:10, fill:C.textMuted }}/>
                        <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, fontSize:11 }}/>
                        <Bar dataKey="sales" fill={C.cyan} radius={[3,3,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card topColor={C.green}>
                    <Label style={{ display:"block", marginBottom:14 }}>Revenue by Agent</Label>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={AGENTS}>
                        <XAxis dataKey="name" tick={{ fontSize:10, fill:C.textMuted }} tickFormatter={v=>v.split(" ")[0]}/>
                        <YAxis tick={{ fontSize:10, fill:C.textMuted }} tickFormatter={v=>"$"+v/1000+"k"}/>
                        <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, fontSize:11 }} formatter={v=>"$"+new Intl.NumberFormat("en-US").format(v)}/>
                        <Bar dataKey="revenue" fill={C.green} radius={[3,3,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
                <Card style={{ marginTop:16 }}>
                  <Label style={{ display:"block", marginBottom:14 }}>Agent Leaderboard</Label>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", padding:"6px 12px", background:"#F8FAFD", borderRadius:4, marginBottom:4 }}>
                    {["Agent","Sales","Revenue","Installs"].map(h=><Label key={h}>{h}</Label>)}
                  </div>
                  {[...AGENTS].sort((a,b)=>b.revenue-a.revenue).map((a,i) => (
                    <div key={a.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", padding:"10px 12px", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:24, height:24, borderRadius:"50%", background: i===0?C.amber+"33":C.cyan+"18", border:`1px solid ${i===0?C.amber:C.cyan}55`, display:"flex", alignItems:"center", justifyContent:"center", ...mono, fontSize:10, fontWeight:800, color:i===0?C.amber:C.cyan }}>{i+1}</div>
                        <span style={{ fontWeight:600, fontSize:12 }}>{a.name}</span>
                      </div>
                      <span style={{ ...mono, fontWeight:700, color:C.cyan }}>{a.sales}</span>
                      <span style={{ ...mono, fontWeight:700, color:C.green }}>${new Intl.NumberFormat("en-US").format(a.revenue)}</span>
                      <span style={{ ...mono, fontWeight:700, color:C.purple }}>{a.installs}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* Install Dates */}
            {reportTab==="installs" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
                  <MetricCard label="Total Installs" value={installedOrders} sub="Completed" color={C.green} icon="✅"/>
                  <MetricCard label="Scheduled" value={allOrders.filter(o=>o.status==="Scheduled").length} sub="Upcoming installs" color={C.cyan} icon="📅"/>
                  <MetricCard label="Pending" value={pendingOrders} sub="Awaiting scheduling" color={C.amber} icon="⏳"/>
                </div>
                <Card topColor={C.green}>
                  <Label style={{ display:"block", marginBottom:14 }}>Monthly Installs Trend</Label>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="month" tick={{ fontSize:11, fill:C.textMuted }}/>
                      <YAxis tick={{ fontSize:11, fill:C.textMuted }}/>
                      <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, fontSize:11 }}/>
                      <Line type="monotone" dataKey="installs" stroke={C.green} strokeWidth={2} dot={{ fill:C.green, r:4 }}/>
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
                <Card style={{ marginTop:16 }}>
                  <Label style={{ display:"block", marginBottom:14 }}>Upcoming Install Schedule</Label>
                  <div style={{ display:"grid", gridTemplateColumns:"1.5fr 2fr 1fr 1fr 1fr", padding:"6px 12px", background:"#F8FAFD", borderRadius:4, marginBottom:4 }}>
                    {["Order ID","Product","Account","Agent","Install Date"].map(h=><Label key={h}>{h}</Label>)}
                  </div>
                  {allOrders.filter(o=>o.status==="Scheduled"||o.status==="Pending").map((o,i) => (
                    <div key={o.id} style={{ display:"grid", gridTemplateColumns:"1.5fr 2fr 1fr 1fr 1fr", padding:"10px 12px", borderBottom:`1px solid ${C.border}`, alignItems:"center", background: i%2===0?"#FFFFFF":"#F8FAFD" }}>
                      <span style={{ ...mono, fontSize:11, color:C.cyan, fontWeight:700 }}>{o.id}</span>
                      <span style={{ fontSize:12 }}>{o.product}</span>
                      <span style={{ fontSize:11, color:C.textMuted }}>{o.account}</span>
                      <span style={{ fontSize:11, color:C.textMuted }}>{o.agent}</span>
                      <span style={{ ...mono, fontSize:11, fontWeight:600, color:C.amber }}>{o.installDate}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* Order Status */}
            {reportTab==="orders" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
                  {Object.entries(ORDER_STATUS_COLOR).map(([status,col]) => (
                    <MetricCard key={status} label={status} value={allOrders.filter(o=>o.status===status).length} sub="orders" color={col} icon={{ Pending:"⏳", Scheduled:"📅", Installed:"✅", Cancelled:"❌" }[status]}/>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <Card topColor={C.cyan}>
                    <Label style={{ display:"block", marginBottom:14 }}>Order Status Distribution</Label>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={Object.entries(ORDER_STATUS_COLOR).map(([k,col])=>({ name:k, value:allOrders.filter(o=>o.status===k).length, col }))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name,value })=>`${name}: ${value}`} labelLine={{ stroke:C.textMuted }}>
                          {Object.entries(ORDER_STATUS_COLOR).map(([k,col],i) => <Cell key={i} fill={col}/>)}
                        </Pie>
                        <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, fontSize:11 }}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card topColor={C.green}>
                    <Label style={{ display:"block", marginBottom:14 }}>Orders by Account</Label>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={accounts.map(a=>({ name:a.name.split(" ")[0], orders:(a.orders||[]).length }))}>
                        <XAxis dataKey="name" tick={{ fontSize:10, fill:C.textMuted }}/>
                        <YAxis tick={{ fontSize:10, fill:C.textMuted }}/>
                        <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, fontSize:11 }}/>
                        <Bar dataKey="orders" fill={C.purple} radius={[3,3,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </div>
            )}

            {/* Revenue */}
            {reportTab==="revenue" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
                  <MetricCard label="Total Pipeline" value={"$"+new Intl.NumberFormat("en-US").format(totalRevenue)} sub="All contract values" color={C.cyan} icon="📈"/>
                  <MetricCard label="Active Contracts" value={activeCount} sub="Currently live" color={C.green} icon="✅"/>
                  <MetricCard label="Avg Contract" value={"$"+new Intl.NumberFormat("en-US").format(Math.round(totalRevenue/Math.max(allContracts.length,1)))} sub="Per contract" color={C.purple} icon="💡"/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <Card topColor={C.cyan}>
                    <Label style={{ display:"block", marginBottom:14 }}>Monthly Revenue Trend</Label>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={monthlyData}>
                        <XAxis dataKey="month" tick={{ fontSize:11, fill:C.textMuted }}/>
                        <YAxis tick={{ fontSize:11, fill:C.textMuted }} tickFormatter={v=>"$"+v/1000+"k"}/>
                        <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, fontSize:11 }} formatter={v=>"$"+new Intl.NumberFormat("en-US").format(v)}/>
                        <Line type="monotone" dataKey="revenue" stroke={C.cyan} strokeWidth={2} dot={{ fill:C.cyan, r:4 }}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card topColor={C.purple}>
                    <Label style={{ display:"block", marginBottom:14 }}>Revenue by Line of Business</Label>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={revByLOB} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${name.split(" ")[0]}: $${Math.round(value/1000)}k`} labelLine={{ stroke:C.textMuted }}>
                          {revByLOB.map((_,i) => <Cell key={i} fill={LOB_PIE_COLORS[i]}/>)}
                        </Pie>
                        <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, fontSize:11 }} formatter={v=>"$"+new Intl.NumberFormat("en-US").format(v)}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
                <Card style={{ marginTop:16 }}>
                  <Label style={{ display:"block", marginBottom:14 }}>Contract Revenue by Account</Label>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", padding:"6px 12px", background:"#F8FAFD", borderRadius:4, marginBottom:4 }}>
                    {["Account","Contracts","Total Value","Status"].map(h=><Label key={h}>{h}</Label>)}
                  </div>
                  {accounts.map((a,i) => {
                    const total = a.contracts.reduce((s,c)=>s+parseFloat(c.value.replace(/[$,]/g,"")),0);
                    return (
                      <div key={a.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", padding:"10px 12px", borderBottom:`1px solid ${C.border}`, alignItems:"center", background:i%2===0?"#FFFFFF":"#F8FAFD" }}>
                        <span style={{ fontWeight:600, fontSize:12 }}>{a.name}</span>
                        <span style={{ ...mono, fontWeight:700, color:C.cyan }}>{a.contracts.length}</span>
                        <span style={{ ...mono, fontWeight:700, color:C.green }}>${new Intl.NumberFormat("en-US").format(total)}</span>
                        <div style={{ display:"flex", gap:4 }}>{a.lob.map(l=><LOBBadge key={l} lob={l}/>)}</div>
                      </div>
                    );
                  })}
                </Card>
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVITY LOG ── */}
        {view==="activities" && (
          <div style={{ flex:1, overflow:"auto", padding:20 }}>
            <div style={{ ...mono, fontWeight:900, fontSize:16, letterSpacing:2, textTransform:"uppercase" }}>Activity Log</div>
            <div style={{ ...mono, fontSize:10, color:C.cyan, marginTop:3, marginBottom:20, letterSpacing:1 }}>// ALL INTERACTIONS ACROSS ACCOUNTS</div>
            {accounts.flatMap(a=>a.timeline.map(t=>({...t,account:a.name}))).map((t,i) => (
              <div key={i} style={{ display:"flex", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:32, height:32, borderRadius:4, background:C.card, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:13 }}>
                  {{"call":"📞","email":"✉️","meeting":"📅"}[t.type]||"📌"}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:12 }}>{t.label}</div>
                  <div style={{ color:C.cyan, fontSize:10, marginTop:2, ...mono }}>{t.account}</div>
                  <div style={{ color:C.textMuted, fontSize:11, marginTop:3 }}>{t.note}</div>
                  <div style={{ color:C.textMuted, fontSize:10, marginTop:4, ...mono }}>{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ACCOUNT DETAIL ── */}
        {sel && (view==="accounts"||view==="contacts") && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, background:C.card }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:6, background:C.cyan+"18", border:`1px solid ${C.cyan}44`, display:"flex", alignItems:"center", justifyContent:"center", ...mono, fontWeight:900, fontSize:14, color:C.cyan }}>
                    {sel.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{sel.name}</div>
                    <div style={{ ...mono, fontSize:9, color:C.cyan, marginTop:3, letterSpacing:1 }}>// ACCOUNT · {sel.city.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <Btn variant="outline" onClick={()=>setShowAddContract(true)}>+ Contract</Btn>
                  <Btn variant="outline" onClick={()=>setShowAddOrder(true)}>+ Order</Btn>
                  <button onClick={()=>setSel(null)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:4, color:C.textMuted, padding:"5px 10px", cursor:"pointer", fontSize:11, ...mono }}>✕</button>
                </div>
              </div>
              <div style={{ display:"flex", gap:0, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
                {["Summary","Contracts","Orders","Timeline"].map(t => (
                  <div key={t} onClick={()=>setTab(t)} style={{ padding:"5px 14px", cursor:"pointer", ...mono, fontSize:10, letterSpacing:1, fontWeight:700, textTransform:"uppercase", color: tab===t ? C.cyan : C.textMuted, borderBottom:`2px solid ${tab===t ? C.cyan : "transparent"}` }}>{t}</div>
                ))}
              </div>
            </div>

            <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
              <div style={{ flex:1, padding:18, overflow:"auto" }}>

                {tab==="Summary" && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <Card topColor={C.cyan}>
                      <Label style={{ display:"block", marginBottom:12 }}>Account Information</Label>
                      {[["Account Name",sel.name],["Phone",sel.phone],["City",sel.city],["Annual Revenue",sel.revenue],["Employees",sel.employees.toLocaleString()]].map(([k,v]) => (
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                          <Label>{k}</Label>
                          <span style={{ fontWeight:500, fontSize:12, ...mono, color:C.text }}>{v}</span>
                        </div>
                      ))}
                    </Card>
                    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                      <Card topColor={C.purple}>
                        <Label style={{ display:"block", marginBottom:12 }}>Primary Contact</Label>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:"50%", background:C.purple+"33", border:`1px solid ${C.purple}55`, display:"flex", alignItems:"center", justifyContent:"center", ...mono, fontWeight:800, fontSize:12, color:C.purple }}>
                            {sel.contact.split(" ").map(w=>w[0]).join("")}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, color:C.cyan, fontSize:12 }}>{sel.contact}</div>
                            <div style={{ fontSize:10, color:C.textMuted, marginTop:2, ...mono }}>{sel.email}</div>
                          </div>
                        </div>
                      </Card>
                      <Card topColor={C.amber}>
                        <Label style={{ display:"block", marginBottom:12 }}>Lines of Business</Label>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{sel.lob.map(l=><LOBBadge key={l} lob={l}/>)}</div>
                      </Card>
                    </div>
                  </div>
                )}

                {tab==="Contracts" && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <Label>Active Contracts & Opportunities</Label>
                      <Btn onClick={()=>setShowAddContract(true)}>+ Add Contract</Btn>
                    </div>
                    {sel.contracts.map(c => {
                      const col = STAGE_COLOR[c.stage]||C.textMuted;
                      return (
                        <Card key={c.id} topColor={col} style={{ marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                            <div>
                              <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{c.name}</div>
                              <div style={{ color:C.textMuted, fontSize:10, marginBottom:8, ...mono }}>{c.id} · CLOSE: {c.close}</div>
                              <div style={{ display:"flex", gap:6 }}><StageBadge stage={c.stage}/><LOBBadge lob={c.lob}/></div>
                            </div>
                            <div style={{ textAlign:"right" }}>
                              <div style={{ ...mono, fontWeight:900, fontSize:16, color:C.green }}>{c.value}</div>
                              <Label style={{ display:"block", marginTop:2 }}>Contract Value</Label>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                    {sel.contracts.length===0 && <div style={{ color:C.textMuted, fontSize:12, padding:20, textAlign:"center" }}>No contracts yet. Click + Add Contract to get started.</div>}
                  </div>
                )}

                {tab==="Orders" && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <Label>Orders & Install Dates</Label>
                      <Btn onClick={()=>setShowAddOrder(true)}>+ Add Order</Btn>
                    </div>
                    {(sel.orders||[]).map(o => {
                      const col = ORDER_STATUS_COLOR[o.status]||C.textMuted;
                      return (
                        <Card key={o.id} topColor={col} style={{ marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                            <div>
                              <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{o.product}</div>
                              <div style={{ color:C.textMuted, fontSize:10, marginBottom:8, ...mono }}>{o.id} · AGENT: {o.agent}</div>
                              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                <StatusBadge status={o.status}/>
                                <span style={{ ...mono, fontSize:10, color:C.textMuted }}>📅 {o.installDate}</span>
                              </div>
                            </div>
                            <div style={{ textAlign:"right" }}>
                              <div style={{ ...mono, fontWeight:900, fontSize:16, color:C.green }}>{o.value}</div>
                              <Label style={{ display:"block", marginTop:2 }}>Order Value</Label>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                    {(!sel.orders||sel.orders.length===0) && <div style={{ color:C.textMuted, fontSize:12, padding:20, textAlign:"center" }}>No orders yet. Click + Add Order to get started.</div>}
                  </div>
                )}

                {tab==="Timeline" && (
                  <div>
                    <Label style={{ display:"block", marginBottom:14 }}>Activity Timeline</Label>
                    <div style={{ background:C.cyan+"0D", border:`1px solid ${C.cyan}33`, borderLeft:`3px solid ${C.cyan}`, borderRadius:4, padding:14, marginBottom:18 }}>
                      <div style={{ ...mono, fontWeight:800, color:C.cyan, fontSize:10, letterSpacing:1, marginBottom:8 }}>// AI HIGHLIGHTS</div>
                      {sel.timeline.map((t,i) => (
                        <div key={i} style={{ fontSize:11, color:C.textMuted, marginBottom:4, display:"flex", gap:6 }}>
                          <span style={{ color:C.cyan }}>▸</span>{t.note}
                        </div>
                      ))}
                    </div>
                    {sel.timeline.map((t,i) => (
                      <div key={i} style={{ display:"flex", gap:12, paddingBottom:14, borderBottom:`1px solid ${C.border}`, marginBottom:14 }}>
                        <div style={{ width:32, height:32, borderRadius:4, background:C.card, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {{"call":"📞","email":"✉️","meeting":"📅"}[t.type]||"📌"}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:12 }}>{t.label}</div>
                          <div style={{ color:C.textMuted, fontSize:11, marginTop:3 }}>{t.note}</div>
                          <div style={{ ...mono, color:C.textMuted, fontSize:10, marginTop:4 }}>{t.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Rail */}
              <div style={{ width:210, borderLeft:`1px solid ${C.border}`, padding:14, flexShrink:0, overflow:"auto", background:"#F8FAFD" }}>
                <Label style={{ display:"block", marginBottom:10 }}>Assistant</Label>
                <div style={{ background:C.amber+"18", border:`1px solid ${C.amber}33`, borderLeft:`3px solid ${C.amber}`, borderRadius:4, padding:10, marginBottom:14 }}>
                  <div style={{ ...mono, fontSize:10, fontWeight:800, color:C.amber, marginBottom:5, letterSpacing:1 }}>🔔 REMINDER</div>
                  {sel.contracts.slice(0,1).map(c=>(
                    <div key={c.id} style={{ fontSize:11, color:C.textMuted }}>Closing soon: <span style={{ color:C.text, fontWeight:600 }}>{c.name}</span></div>
                  ))}
                </div>
                <Label style={{ display:"block", marginBottom:10, marginTop:14 }}>Open Contracts</Label>
                {sel.contracts.map(c => {
                  const col = STAGE_COLOR[c.stage]||C.textMuted;
                  return (
                    <Card key={c.id} topColor={col} style={{ padding:10, marginBottom:8 }}>
                      <div style={{ fontSize:11, fontWeight:600, marginBottom:5 }}>{c.name}</div>
                      <StageBadge stage={c.stage}/>
                      <div style={{ ...mono, fontSize:13, color:C.green, fontWeight:800, marginTop:6 }}>{c.value}</div>
                    </Card>
                  );
                })}
                <Label style={{ display:"block", marginBottom:10, marginTop:14 }}>Recent Orders</Label>
                {(sel.orders||[]).slice(0,2).map(o => (
                  <Card key={o.id} style={{ padding:10, marginBottom:8 }}>
                    <div style={{ fontSize:11, fontWeight:600, marginBottom:5 }}>{o.product}</div>
                    <StatusBadge status={o.status}/>
                    <div style={{ ...mono, fontSize:10, color:C.textMuted, marginTop:6 }}>📅 {o.installDate}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}

      {showAddAccount && (
        <Modal title="Add New Account" onClose={()=>setShowAddAccount(false)}>
          <Field label="Account Name"><Input value={newAccount.name} onChange={e=>setNewAccount({...newAccount,name:e.target.value})} placeholder="e.g. Acme Corp"/></Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Primary Contact"><Input value={newAccount.contact} onChange={e=>setNewAccount({...newAccount,contact:e.target.value})} placeholder="Full name"/></Field>
            <Field label="Email"><Input value={newAccount.email} onChange={e=>setNewAccount({...newAccount,email:e.target.value})} placeholder="email@company.com"/></Field>
            <Field label="Phone"><Input value={newAccount.phone} onChange={e=>setNewAccount({...newAccount,phone:e.target.value})} placeholder="555-000-0000"/></Field>
            <Field label="City"><Input value={newAccount.city} onChange={e=>setNewAccount({...newAccount,city:e.target.value})} placeholder="City, State"/></Field>
            <Field label="Annual Revenue"><Input value={newAccount.revenue} onChange={e=>setNewAccount({...newAccount,revenue:e.target.value})} placeholder="$0"/></Field>
            <Field label="Employees"><Input value={newAccount.employees} onChange={e=>setNewAccount({...newAccount,employees:e.target.value})} type="number" placeholder="0"/></Field>
          </div>
          <Field label="Line of Business">
            <Select value={newAccount.lob[0]} onChange={e=>setNewAccount({...newAccount,lob:[e.target.value]})} options={["Frontier","Kinetic","Verizon Mobile"]}/>
          </Field>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
            <Btn variant="outline" onClick={()=>setShowAddAccount(false)}>Cancel</Btn>
            <Btn onClick={handleAddAccount}>Save Account</Btn>
          </div>
        </Modal>
      )}

      {showAddContract && sel && (
        <Modal title={`Add Contract — ${sel.name}`} onClose={()=>setShowAddContract(false)}>
          <Field label="Contract Name"><Input value={newContract.name} onChange={e=>setNewContract({...newContract,name:e.target.value})} placeholder="e.g. Fiber Upgrade Phase 2"/></Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Contract Value"><Input value={newContract.value} onChange={e=>setNewContract({...newContract,value:e.target.value})} placeholder="$0"/></Field>
            <Field label="Close Date"><Input value={newContract.close} onChange={e=>setNewContract({...newContract,close:e.target.value})} placeholder="MM/DD/YYYY"/></Field>
            <Field label="Stage"><Select value={newContract.stage} onChange={e=>setNewContract({...newContract,stage:e.target.value})} options={["Qualify","Propose","Negotiate","Active"]}/></Field>
            <Field label="Line of Business"><Select value={newContract.lob} onChange={e=>setNewContract({...newContract,lob:e.target.value})} options={["Frontier","Kinetic","Verizon Mobile"]}/></Field>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
            <Btn variant="outline" onClick={()=>setShowAddContract(false)}>Cancel</Btn>
            <Btn onClick={handleAddContract}>Save Contract</Btn>
          </div>
        </Modal>
      )}

      {showAddOrder && sel && (
        <Modal title={`Add Order — ${sel.name}`} onClose={()=>setShowAddOrder(false)}>
          <Field label="Product / Service"><Input value={newOrder.product} onChange={e=>setNewOrder({...newOrder,product:e.target.value})} placeholder="e.g. Fiber 1Gig Install"/></Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Order Value"><Input value={newOrder.value} onChange={e=>setNewOrder({...newOrder,value:e.target.value})} placeholder="$0"/></Field>
            <Field label="Install Date"><Input value={newOrder.installDate} onChange={e=>setNewOrder({...newOrder,installDate:e.target.value})} placeholder="YYYY-MM-DD" type="date"/></Field>
            <Field label="Status"><Select value={newOrder.status} onChange={e=>setNewOrder({...newOrder,status:e.target.value})} options={["Pending","Scheduled","Installed","Cancelled"]}/></Field>
            <Field label="Assigned Agent"><Select value={newOrder.agent} onChange={e=>setNewOrder({...newOrder,agent:e.target.value})} options={AGENTS.map(a=>a.name)}/></Field>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
            <Btn variant="outline" onClick={()=>setShowAddOrder(false)}>Cancel</Btn>
            <Btn onClick={handleAddOrder}>Save Order</Btn>
          </div>
        </Modal>
      )}

    </div>
  );
}
