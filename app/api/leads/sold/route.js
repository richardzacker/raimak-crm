// app/api/leads/sold/route.js
// Power Automate calls this endpoint when a lead is marked Sold in the LMS
// It auto-creates a CRM Account from the sold lead

import { createAccount } from "@/lib/graph";

export async function POST(request) {
  try {
    const lead = await request.json();

    // Map LMS lead fields to CRM account fields
    await createAccount({
      name:     lead.CustomerName || lead.Title,
      contact:  lead.ContactName  || lead.CustomerName,
      email:    lead.Email        || "",
      phone:    lead.Phone        || "",
      city:     lead.City         || lead.Address || "",
      revenue:  "",
      employees: 0,
      lob:      [lead.LineOfBusiness || lead.LOB || "Frontier"],
      fromLMS:  true,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Sold lead webhook error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
