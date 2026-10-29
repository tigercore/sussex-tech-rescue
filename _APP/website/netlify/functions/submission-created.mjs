// Runs automatically after every verified Netlify Forms submission and copies
// it into Odoo as a CRM lead. Settings live in Netlify environment variables:
//   ODOO_URL      e.g. https://sussex-tech-rescue.odoo.com
//   ODOO_DB       database name (shown at /web/database/selector on Odoo Online)
//   ODOO_LOGIN    login email of the Odoo user that owns the API key
//   ODOO_API_KEY  API key from that user's Preferences > Account Security
// Optional: ODOO_TEAM_ID to drop leads into a specific sales team.

const FORMS = {
  booking: (d) => ({
    name: `Booking: ${d.name || "Unknown"}${d.problem ? ` (${d.problem})` : ""}`,
    contact_name: d.name,
    phone: d.phone,
    email_from: d.email,
    zip: d.postcode,
    city: d.town,
    description: lines([
      ["Problem", d.problem],
      ["When suits", d.when],
      ["Town", d.town],
      ["Postcode", d.postcode],
      ["Sent from page", d.page],
      ["Message", d.message],
    ]),
  }),
  family: (d) => ({
    name: `Family plan: ${d["their-name"] || "Unknown"} (for ${d["your-name"] || "relative"})`,
    contact_name: d["your-name"],
    phone: d["your-phone"],
    email_from: d["your-email"],
    city: d["their-town"],
    description: lines([
      ["Plan", d.plan],
      ["Person needing help", d["their-name"]],
      ["Relationship", d.relationship],
      ["Their town", d["their-town"]],
      ["Their phone", d["their-phone"]],
      ["Send updates", d["send-updates"] === "yes" ? "Yes" : "No"],
      ["Message", d.message],
    ]),
  }),
};

function lines(pairs) {
  return pairs
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

async function rpc(url, service, method, args) {
  const res = await fetch(`${url}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args } }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.data?.message || json.error.message);
  return json.result;
}

export const handler = async (event) => {
  const { ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY, ODOO_TEAM_ID } = process.env;
  const { payload } = JSON.parse(event.body);
  const toLead = FORMS[payload.form_name];

  if (!toLead) return { statusCode: 200, body: "Form not sent to Odoo" };
  if (!ODOO_URL || !ODOO_DB || !ODOO_LOGIN || !ODOO_API_KEY) {
    console.error("Odoo settings missing; submission kept in Netlify only");
    return { statusCode: 200, body: "Odoo not configured" };
  }

  const url = ODOO_URL.replace(/\/+$/, "");
  const uid = await rpc(url, "common", "authenticate", [ODOO_DB, ODOO_LOGIN, ODOO_API_KEY, {}]);
  if (!uid) throw new Error("Odoo login failed: check ODOO_DB, ODOO_LOGIN and ODOO_API_KEY");
  const call = (model, method, args, kw = {}) =>
    rpc(url, "object", "execute_kw", [ODOO_DB, uid, ODOO_API_KEY, model, method, args, kw]);

  const tagName = `Website: ${payload.form_name}`;
  const [tagId] = await call("crm.tag", "search", [[["name", "=", tagName]]], { limit: 1 });

  const lead = Object.fromEntries(Object.entries(toLead(payload.data)).filter(([, v]) => v));
  lead.tag_ids = [tagId ? [4, tagId] : [0, 0, { name: tagName }]];
  if (ODOO_TEAM_ID) lead.team_id = Number(ODOO_TEAM_ID);

  const leadId = await call("crm.lead", "create", [lead]);
  console.log(`Created Odoo lead ${leadId} from ${payload.form_name} form`);
  return { statusCode: 200, body: "Sent to Odoo" };
};
