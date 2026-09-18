# grok-bot-fiverr

Source of truth for a **Grok Bot** that sources and screens freelancers on Fiverr, then invites strong applicants to a GitHub take-home.

There is **no Fiverr API/MCP connector**. Login, search, and DMs run through the bot’s browser session.

## Pipeline

1. **Sign in to Fiverr** (browser) — session persists on the bot computer.
2. **Search candidates** by a keyword (see `config/search.example.yaml`).
3. **Contact by DM** using outreach templates in `templates/`.
4. **Text technical assessment** in the Fiverr chat (stage machine in the skill).
5. **GitHub take-home invite** using the stack → repo map, then fork / timebox / submission instructions.

## Day-to-day

1. Copy example config: `config/search.example.yaml` → your live search settings (keep secrets out of git).
2. Copy `config/stack-repo-map.example.yaml` and fill real take-home repo URLs.
3. Tell the bot: keyword to search, how many people to shortlist, and any outreach tweaks.
4. Bot follows `skills/fiverr-recruiting/SKILL.md`.

## Secrets (names only — never commit values)

| Secret / session | Purpose |
| --- | --- |
| Fiverr browser login | Search + DM + assessment chat |
| `GITHUB_TOKEN` (or connected GitHub) | Invite candidate to take-home repo |
| `OPENROUTER_API_KEY` (optional) | Generate interview follow-up questions |

## Layout

```
skills/fiverr-recruiting/SKILL.md   # primary bot skill
templates/                          # DM + assessment copy
config/*.example.yaml               # search + stack→repo map
docs/stages.md                      # stage reference
```

## Contributing

Work lands via pull request on this repo. Do not commit tokens, passwords, or candidate PII.
