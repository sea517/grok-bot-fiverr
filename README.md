# grok-bot-fiverr

Source of truth for a **Grok Bot** that sources and screens freelancers on Fiverr, then invites strong applicants to a GitHub take-home.

There is **no Fiverr API/MCP connector**. Login, search, and DMs run through the bot’s browser session.

## Pipeline

1. **Sign in to Fiverr** (browser) — session persists on the bot computer.
2. **Search candidates** by a keyword (see `config/search.example.yaml` or dashboard `campaign.json`).
3. **Contact by DM** using the first message from campaign config / outreach templates in `templates/`.
4. **Text technical assessment** in the Fiverr chat (stage machine in the skill).
5. **GitHub take-home invite** using the stack → repo map, then fork / timebox / submission instructions.

## Dashboard

Operator web UI for keyword + first outreach message (and optional shortlist / status / notes).

```bash
cd dashboard
npm install
npm run dev
```

- Saves drafts in the browser (`localStorage`)
- **Export** downloads `campaign.json` — place it at `config/campaign.json` for the bot (file is gitignored)
- Schema: `config/campaign.example.json`

## Day-to-day

1. Prefer the dashboard: set keyword + first DM, export → `config/campaign.json`.
2. Or copy example YAML: `config/search.example.yaml` → local search settings (keep secrets out of git).
3. Copy `config/stack-repo-map.example.yaml` and fill real take-home repo URLs.
4. Tell the bot to follow `skills/fiverr-recruiting/SKILL.md` (it reads `config/campaign.json` when present).

## Secrets (names only — never commit values)

| Secret / session | Purpose |
| --- | --- |
| Fiverr browser login | Search + DM + assessment chat |
| `GITHUB_TOKEN` (or connected GitHub) | Invite candidate to take-home repo |
| `OPENROUTER_API_KEY` (optional) | Generate interview follow-up questions |

## Layout

```
dashboard/                          # operator Vite + React UI
skills/fiverr-recruiting/SKILL.md   # primary bot skill
templates/                          # DM + assessment copy
config/*.example.yaml               # search + stack→repo map
config/campaign.example.json        # dashboard export schema
docs/stages.md                      # stage reference
```

## Contributing

Work lands via pull request on this repo. Do not commit tokens, passwords, or candidate PII.
