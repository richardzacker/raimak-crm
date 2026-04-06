// lib/graph.js
// Microsoft Graph API — uses MSAL delegated auth (works on static GitHub Pages)

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";
const SITE_ID    = process.env.NEXT_PUBLIC_SP_SITE_ID;
const BASE_URL   = `${GRAPH_BASE}/sites/${SITE_ID}/lists`;

const LIST_IDS = {
  accounts:    process.env.NEXT_PUBLIC_SP_LIST_ACCOUNTS,
  contracts:   process.env.NEXT_PUBLIC_SP_LIST_CONTRACTS,
  orders:      process.env.NEXT_PUBLIC_SP_LIST_ORDERS,
  agents:      process.env.NEXT_PUBLIC_SP_LIST_AGENTS,
  leads:       process.env.NEXT_PUBLIC_SP_LIST_LEADS,
  activityLog: process.env.NEXT_PUBLIC_SP_LIST_ACTIVITY,
};

// ── Token via MSAL (passed in from component) ─────────────────────────────────
async function getToken(msalInstance, account) {
  const response = await msalInstance.acquireTokenSilent({
    scopes: ["https://graph.microsoft.com/Sites.ReadWrite.All"],
    account,
  });
  return response.accessToken;
}

// ── Generic helpers ───────────────────────────────────────────────────────────
async function spGet(listId, msalInstance, account, query = "") {
  const token = await getToken(msalInstance, account);
  const url = `${BASE_URL}/${listId}/items?expand=fields${query ? "&" + query : ""}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`SharePoint GET failed: ${res.status}`);
  const data = await res.json();
  return (data.value || []).map(item => ({ id: item.id, ...item.fields }));
}

async function spPost(listId, fields, msalInstance, account) {
  const token = await getToken(msalInstance, account);
  const res = await fetch(`${BASE_URL}/${listId}/items`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`SharePoint POST failed: ${res.status}`);
  return res.json();
}

async function spPatch(listId, itemId, fields, msalInstance, account) {
  const token = await getToken(msalInstance, account);
  const res = await fetch(`${BASE_URL}/${listId}/items/${itemId}/fields`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error(`SharePoint PATCH failed: ${res.status}`);
  return res.json();
}

async function spDelete(listId, itemId, msalInstance, account) {
  const token = await getToken(msalInstance, account);
  const res = await fetch(`${BASE_URL}/${listId}/items/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`SharePoint DELETE failed: ${res.status}`);
}

// ── Accounts ──────────────────────────────────────────────────────────────────
export async function getAccounts(msalInstance, account) {
  const items = await spGet(LIST_IDS.accounts, msalInstance, account);
  return items.map(a => ({
    id:        a.id,
    name:      a.Title || "",
    contact:   a.PrimaryContact || "",
    email:     a.Email || "",
    phone:     a.Phone || "",
    city:      a.City || "",
    revenue:   Number(a.AnnualRevenue) || 0,
    employees: Number(a.Employees) || 0,
    lob:       a.LinesOfBusiness ? a.LinesOfBusiness.split(",").map(s=>s.trim()) : ["Frontier"],
    contracts: [],
    orders:    [],
    timeline:  [],
  }));
}

export async function createAccount(data, msalInstance, account) {
  return spPost(LIST_IDS.accounts, {
    Title:           data.name,
    PrimaryContact:  data.contact,
    Email:           data.email,
    Phone:           data.phone,
    City:            data.city,
    AnnualRevenue:   Number(data.revenue) || 0,
    Employees:       Number(data.employees) || 0,
    LinesOfBusiness: Array.isArray(data.lob) ? data.lob.join(",") : data.lob,
  }, msalInstance, account);
}

export async function updateAccount(itemId, data, msalInstance, account) {
  return spPatch(LIST_IDS.accounts, itemId, {
    Title:           data.name,
    PrimaryContact:  data.contact,
    Email:           data.email,
    Phone:           data.phone,
    City:            data.city,
    AnnualRevenue:   Number(data.revenue) || 0,
    Employees:       Number(data.employees) || 0,
    LinesOfBusiness: Array.isArray(data.lob) ? data.lob.join(",") : data.lob,
  }, msalInstance, account);
}

// ── Contracts ─────────────────────────────────────────────────────────────────
export async function getContracts(msalInstance, account) {
  const items = await spGet(LIST_IDS.contracts, msalInstance, account);
  return items.map(c => ({
    id:        c.id,
    accountId: c.AccountID || "",
    name:      c.Title || "",
    value:     Number(c.ContractValue) || 0,
    stage:     c.Stage || "Qualify",
    close:     c.CloseDate || "",
    lob:       c.LineOfBusiness || "Frontier",
  }));
}

export async function createContract(data, msalInstance, account) {
  return spPost(LIST_IDS.contracts, {
    Title:          data.name,
    AccountID:      data.accountId,
    ContractValue:  Number(data.value) || 0,
    Stage:          data.stage,
    CloseDate:      data.close,
    LineOfBusiness: data.lob,
  }, msalInstance, account);
}

export async function updateContractStage(itemId, stage, msalInstance, account) {
  return spPatch(LIST_IDS.contracts, itemId, { Stage: stage }, msalInstance, account);
}

// ── Orders ────────────────────────────────────────────────────────────────────
export async function getOrders(msalInstance, account) {
  const items = await spGet(LIST_IDS.orders, msalInstance, account);
  return items.map(o => ({
    id:          o.id,
    accountId:   o.AccountID || "",
    product:     o.Title || "",
    status:      o.OrderStatus || "Pending",
    installDate: o.InstallDate || "",
    agent:       o.AssignedAgent || "",
    value:       Number(o.OrderValue) || 0,
    lob:         o.LineOfBusiness || "Frontier",
  }));
}

export async function createOrder(data, msalInstance, account) {
  return spPost(LIST_IDS.orders, {
    Title:          data.product,
    AccountID:      data.accountId,
    OrderStatus:    data.status,
    InstallDate:    data.installDate,
    AssignedAgent:  data.agent,
    OrderValue:     Number(data.value) || 0,
    LineOfBusiness: data.lob,
  }, msalInstance, account);
}

export async function updateOrderStatus(itemId, status, msalInstance, account) {
  return spPatch(LIST_IDS.orders, itemId, { OrderStatus: status }, msalInstance, account);
}

// ── Agents (from Contractors list) ───────────────────────────────────────────
export async function getAgents(msalInstance, account) {
  const items = await spGet(LIST_IDS.agents, msalInstance, account);
  return items.map(a => ({
    id:   a.id,
    name: a.Title || a.ContractorName || a.Name || "",
  }));
}

// ── Activity Log ──────────────────────────────────────────────────────────────
export async function logActivity(data, msalInstance, account) {
  return spPost(LIST_IDS.activityLog, {
    Title:       data.label,
    AccountName: data.account || "",
    AgentName:   data.agent || "",
    ActionType:  data.type || "note",
    Notes:       data.note || "",
    Source:      "CRM",
  }, msalInstance, account);
}

export async function getActivityLog(msalInstance, account) {
  const items = await spGet(LIST_IDS.activityLog, msalInstance, account,
    "$orderby=fields/Created desc&$top=50");
  return items.map(a => ({
    id:      a.id,
    label:   a.Title || "",
    account: a.AccountName || "",
    agent:   a.AgentName || "",
    type:    a.ActionType || "note",
    note:    a.Notes || "",
    date:    a.Created || "",
    source:  a.Source || "CRM",
  }));
}
