// lib/graph.js
// Microsoft Graph API client for Raimak CRM <-> SharePoint integration

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

// ── Token Management ─────────────────────────────────────────────────────────
// Calls our own Next.js API route which holds the client secret securely
export async function getAccessToken() {
  const res = await fetch("/api/auth/token");
  if (!res.ok) throw new Error("Failed to get access token");
  const { access_token } = await res.json();
  return access_token;
}

// ── Generic SharePoint List Helpers ─────────────────────────────────────────
const SITE_ID  = process.env.NEXT_PUBLIC_SP_SITE_ID;
const BASE_URL = `${GRAPH_BASE}/sites/${SITE_ID}/lists`;

async function spGet(listId, query = "") {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/${listId}/items?expand=fields${query ? "&" + query : ""}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`SharePoint GET failed: ${res.status}`);
  const data = await res.json();
  return data.value.map(item => ({ id: item.id, ...item.fields }));
}

async function spPost(listId, fields) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/${listId}/items`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`SharePoint POST failed: ${res.status}`);
  return res.json();
}

async function spPatch(listId, itemId, fields) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/${listId}/items/${itemId}/fields`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error(`SharePoint PATCH failed: ${res.status}`);
  return res.json();
}

// ── List IDs (from SharePoint) ───────────────────────────────────────────────
// These come from your .env.local / Vercel environment variables
const LIST_IDS = {
  leads:       process.env.NEXT_PUBLIC_SP_LIST_LEADS,       // Existing LMS list
  agents:      process.env.NEXT_PUBLIC_SP_LIST_AGENTS,      // Existing LMS Contractors list
  accounts:    process.env.NEXT_PUBLIC_SP_LIST_ACCOUNTS,    // New CRM list
  contracts:   process.env.NEXT_PUBLIC_SP_LIST_CONTRACTS,   // New CRM list
  orders:      process.env.NEXT_PUBLIC_SP_LIST_ORDERS,      // New CRM list
  activityLog: process.env.NEXT_PUBLIC_SP_LIST_ACTIVITY,    // Existing LMS list (shared)
};

// ── Agents (reads from LMS Contractors list) ─────────────────────────────────
export async function getAgents() {
  const items = await spGet(LIST_IDS.agents);
  return items.map(a => ({
    id:      a.id,
    name:    a.Title || a.ContractorName || a.Name,
    email:   a.Email || a.ContractorEmail || "",
    phone:   a.Phone || "",
    role:    a.Role || "Agent",
  }));
}

// ── Leads (reads from LMS Leads list — sold leads only) ──────────────────────
export async function getSoldLeads() {
  const items = await spGet(LIST_IDS.leads, "$filter=fields/Status eq 'Sold'");
  return items.map(l => ({
    id:      l.id,
    name:    l.Title || l.CustomerName,
    phone:   l.Phone || "",
    address: l.Address || "",
    city:    l.City || "",
    agent:   l.AssignedTo || l.AgentName || "",
    lob:     l.LineOfBusiness || l.LOB || "Frontier",
    soldDate:l.SoldDate || l.Modified,
  }));
}

// ── CRM Accounts ─────────────────────────────────────────────────────────────
export async function getAccounts() {
  const items = await spGet(LIST_IDS.accounts);
  return items.map(a => ({
    id:        a.id,
    name:      a.Title,
    contact:   a.PrimaryContact || "",
    email:     a.Email || "",
    phone:     a.Phone || "",
    city:      a.City || "",
    revenue:   a.AnnualRevenue || "",
    employees: parseInt(a.Employees) || 0,
    lob:       a.LinesOfBusiness ? a.LinesOfBusiness.split(",") : ["Frontier"],
  }));
}

export async function createAccount(data) {
  return spPost(LIST_IDS.accounts, {
    Title:           data.name,
    PrimaryContact:  data.contact,
    Email:           data.email,
    Phone:           data.phone,
    City:            data.city,
    AnnualRevenue:   data.revenue,
    Employees:       data.employees,
    LinesOfBusiness: Array.isArray(data.lob) ? data.lob.join(",") : data.lob,
    CreatedFromLMS:  data.fromLMS || false,
  });
}

export async function updateAccount(itemId, data) {
  return spPatch(LIST_IDS.accounts, itemId, data);
}

// ── CRM Contracts ────────────────────────────────────────────────────────────
export async function getContracts(accountId) {
  const filter = accountId ? `$filter=fields/AccountID eq '${accountId}'` : "";
  const items = await spGet(LIST_IDS.contracts, filter);
  return items.map(c => ({
    id:        c.id,
    accountId: c.AccountID,
    name:      c.Title,
    value:     c.ContractValue || "",
    stage:     c.Stage || "Qualify",
    closeDate: c.CloseDate || "",
    lob:       c.LineOfBusiness || "Frontier",
  }));
}

export async function createContract(data) {
  return spPost(LIST_IDS.contracts, {
    Title:           data.name,
    AccountID:       data.accountId,
    ContractValue:   data.value,
    Stage:           data.stage,
    CloseDate:       data.close,
    LineOfBusiness:  data.lob,
  });
}

export async function updateContractStage(itemId, stage) {
  return spPatch(LIST_IDS.contracts, itemId, { Stage: stage });
}

// ── CRM Orders ───────────────────────────────────────────────────────────────
export async function getOrders(accountId) {
  const filter = accountId ? `$filter=fields/AccountID eq '${accountId}'` : "";
  const items = await spGet(LIST_IDS.orders, filter);
  return items.map(o => ({
    id:          o.id,
    accountId:   o.AccountID,
    product:     o.Title,
    status:      o.OrderStatus || "Pending",
    installDate: o.InstallDate || "",
    agent:       o.AssignedAgent || "",
    value:       o.OrderValue || "",
  }));
}

export async function createOrder(data) {
  return spPost(LIST_IDS.orders, {
    Title:          data.product,
    AccountID:      data.accountId,
    OrderStatus:    data.status,
    InstallDate:    data.installDate,
    AssignedAgent:  data.agent,
    OrderValue:     data.value,
  });
}

export async function updateOrderStatus(itemId, status) {
  // This writes back to SharePoint so LMS can also see the updated status
  return spPatch(LIST_IDS.orders, itemId, { OrderStatus: status });
}

// ── Activity Log (shared with LMS) ───────────────────────────────────────────
export async function logActivity(data) {
  return spPost(LIST_IDS.activityLog, {
    Title:       data.label,
    AccountName: data.account,
    AgentName:   data.agent || "",
    ActionType:  data.type,
    Notes:       data.note,
    Source:      "CRM",  // vs "LMS" so you can filter by origin
  });
}

export async function getActivityLog(accountName) {
  const filter = accountName ? `$filter=fields/AccountName eq '${accountName}'` : "";
  const items = await spGet(LIST_IDS.activityLog, filter);
  return items.map(a => ({
    id:      a.id,
    label:   a.Title,
    account: a.AccountName || "",
    agent:   a.AgentName || "",
    type:    a.ActionType || "note",
    note:    a.Notes || "",
    date:    a.Created,
    source:  a.Source || "CRM",
  }));
}
