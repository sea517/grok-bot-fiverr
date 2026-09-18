# Operator dashboard

Vite + React + TypeScript UI for configuring a Fiverr recruiting campaign.

## Run locally

```bash
cd dashboard
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## What it does

- Edit **search keyword** and **first outreach DM** (required)
- Optional: campaign name, shortlist size, notes, campaign status
- **Save** → browser `localStorage`
- **Export campaign.json** → download a JSON file the bot reads at `config/campaign.json`

## Schema

See `../config/campaign.example.json`.

Fields: `schema_version`, `campaign_name`, `keyword`, `first_message`, `shortlist_size`, `status` (`draft` | `searching` | `outreach` | `assessing`), `notes`, `updated_at`.

Live `config/campaign.json` is gitignored — keep real campaigns local.
