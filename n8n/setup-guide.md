# n8n Cloud Setup Guide — ITC Content OS

Complete these steps in order. Steps 1–4 are one-time setup. Step 5 is done after importing workflows.

---

## Step 1 — Connect Credentials in n8n Cloud

Go to **n8n Cloud → Credentials → New** for each:

### Anthropic (HTTP Header Auth)
- Type: `Header Auth`
- Name: `Anthropic API`
- Header Name: `x-api-key`
- Header Value: `[your Anthropic API key from console.anthropic.com]`

### Gmail (OAuth2)
- Type: `Gmail OAuth2 API`
- Name: `ITC Gmail`
- Follow n8n's OAuth flow — sign in as jamaal.davis3@gmail.com
- Scope needed: `https://www.googleapis.com/auth/gmail.send`

### LinkedIn (OAuth2)
- Type: `LinkedIn OAuth2 API`
- Name: `ITC LinkedIn`
- Follow n8n's OAuth flow — sign in as your LinkedIn account
- After connecting, find your Person URN:
  - Go to linkedin.com → your profile → copy the URL
  - URL format: linkedin.com/in/YOUR-HANDLE
  - In n8n, run a test node to get your URN, or use the LinkedIn API:
    `GET https://api.linkedin.com/v2/userinfo` with your OAuth token
  - URN format: `urn:li:person:XXXXXXXX`
  - Save this — you need it for LINKEDIN_PERSON_URN below

### Notion (API Key)
- Type: `Notion API`
- Name: `ITC Notion`
- Go to notion.so/my-integrations → New Integration → name it "ITC Content OS"
- Permissions needed: Read content, Update content, Insert content
- Copy the Internal Integration Token — that's your Notion API key

---

## Step 2 — Create the Notion Content Ideas Database

Create a new Notion page and add a full-page database. Name it: **ITC Content Ideas**

Add these properties exactly (name and type must match):

| Property Name | Type | Options / Notes |
|---|---|---|
| `Idea` | Title | Default — the main idea or topic |
| `Status` | Select | Options: `Ready`, `In Progress`, `Published`, `Needs Revision`, `Blocked` |
| `Priority` | Select | Options: `High`, `Medium`, `Low` |
| `Pillar` | Select | Options: `Inclusive Design as Business Value`, `Human-Centered AI`, `Power Dynamics in Product Design`, `Accessibility Beyond Compliance`, `Inclusive Tech Club Builds` |
| `Funnel Stage` | Select | Options: `Awareness`, `Consideration`, `Conversion` |
| `Notes` | Text | Free-form brief notes, context, research links |
| `Published Date` | Date | Set when published |
| `LinkedIn Post ID` | Text | Filled by n8n after publishing |
| `Slug` | Text | Auto-filled by pipeline (YYYY-MM-DD-slug) |

**Database already created via API.** Database ID: `37ba261e-654e-8134-88fe-f3f470e230e5`
View it at: https://app.notion.com/p/37ba261e654e813488fef3f470e230e5

A first test idea has already been added (Status: Ready, Priority: High).

---

## Step 3 — Set Environment Variables in n8n Cloud

Go to **n8n Cloud → Settings → Variables → Add Variable** for each:

| Variable Name | Value | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | console.anthropic.com → API Keys |
| `NOTION_CONTENT_IDEAS_DB` | `37ba261e-654e-8134-88fe-f3f470e230e5` | Already created |
| `JAMAAL_EMAIL` | `jamaal.davis3@gmail.com` | Already known |
| `LINKEDIN_PERSON_URN` | `urn:li:person:XXXXXXXX` | LinkedIn API call (Step 1) |
| `CONTENT_OS_PATH` | `C:\Users\callm\ITC gowth\inclusive-tech-club-growth-content-os` | Path on your machine |
| `N8N_APPROVAL_WEBHOOK_URL` | *(get after Step 4)* | From publish workflow webhook node |
| `N8N_DELIVERY_WEBHOOK_URL` | *(get after Step 4)* | From produce workflow webhook node |

---

## Step 4 — Import and Activate Workflows

**Import publish workflow first** (you need its webhook URL for the produce workflow):

1. n8n Cloud → Workflows → Import from file → select `n8n/publish-workflow.json`
2. Open the "Jamaal Approval Webhook" node → copy the Production Webhook URL
3. Paste it as `N8N_APPROVAL_WEBHOOK_URL` in Variables (Step 3)
4. Assign credentials: Gmail → `ITC Gmail`, Notion → `ITC Notion`, LinkedIn → `ITC LinkedIn`
5. Click **Active** toggle to activate

**Import produce workflow:**

1. n8n Cloud → Workflows → Import from file → select `n8n/produce-workflow.json`
2. Assign credentials on all HTTP Request nodes → `Anthropic API`
3. Assign credentials on Gmail nodes → `ITC Gmail`
4. Assign credentials on Notion node → `ITC Notion`
5. Click **Active** toggle to activate

---

## Step 5 — Add First Idea and Test

1. Open your Notion **ITC Content Ideas** database
2. Add a row:
   - Idea: `Why accessibility debt costs more to fix than to prevent`
   - Status: `Ready`
   - Priority: `High`
   - Notes: `Focus on the business cost angle, not the moral case`
3. In n8n, open the produce workflow → click **Test Workflow** (manual trigger)
4. Watch the pipeline run — you'll get an approval email when the angle brief is ready

---

## Checklist

- [ ] Anthropic Header Auth credential created
- [ ] Gmail OAuth2 connected as jamaal.davis3@gmail.com
- [ ] LinkedIn OAuth2 connected, Person URN saved
- [ ] Notion integration created and connected to ITC Content Ideas DB
- [ ] Notion DB created with all 9 properties
- [ ] All 7 env vars set in n8n Cloud
- [ ] publish-workflow imported and active
- [ ] produce-workflow imported and active
- [ ] Test idea added to Notion DB
- [ ] Manual test run triggered
