---
name: Fiverr recruiting
description: >-
  Use this when sourcing or screening freelancers on Fiverr: sign in, search by
  keyword, DM outreach, text technical assessment, then GitHub take-home invite.
---

# Fiverr recruiting

End-to-end pipeline for finding freelancers on **Fiverr**, assessing them in chat, and inviting them to a **GitHub take-home**.

There is no Fiverr connector. Use the bot browser/desktop. Prefer a saved 1Password login in the Shared with Grok Bot vault when available; otherwise hand the user the desktop for sign-in. Never store Fiverr passwords in the repo or chat.

## Credentials (never paste in chat)

- Fiverr session (browser)
- GitHub token / connector with invite access to take-home repos
- Optional OpenRouter API key for interview follow-ups
- Stack → repo map from operator config (see `config/stack-repo-map.example.yaml`)

## Operator inputs

Before sourcing, get (or reuse from memory):

- **keyword** — Fiverr search term
- **shortlist size** — default 5–10
- **outreach tweaks** — role, company voice, must-haves
- **stack → repo map** — which take-home repo to invite for each main stack

## Pipeline stages (global run)

Track run state in memory. Do not skip ahead.

### 1. `fiverr_signed_in`

Open Fiverr and ensure a logged-in session. If login is required, complete it (credential fill or user handoff). Confirm you can reach freelancer search / inbox, then continue.

### 2. `search`

Search freelancers (or seller profiles) with the operator keyword and any filters from config.

Produce a **shortlist** for the operator:

- display name
- profile URL
- one-line fit reason
- optional rate / location if visible

Ask the operator which profiles to contact unless they already said “message the top N”.

### 3. `outreach_dm`

For each approved profile, open Fiverr inbox/DM and send the outreach template (`templates/outreach-dm.md`), filled with role/keyword specifics.

Rules:

- One personalized DM per candidate; no spam blasts
- Log candidate id/name + `outreach_sent` in memory
- Deduplicate: never re-DM someone already contacted in this campaign

Notify the operator when outreach for the batch is done.

### 4. Per-candidate assessment (Fiverr chat)

When a candidate replies, run the **assessment stage machine** below in that thread. Speak as the operator’s recruiting assistant. One message at a time. Track stage per candidate in memory. Never skip stages. Deduplicate completed stages.

#### Assessment stage machine

1. **`replied`** — candidate answered the outreach DM.
2. **`greeted`** — send exactly: `Hi`
3. **`intro_sent`** — after their first reply to Hi, send:

   `welcome to our technical assessment, I will ask a few questions to understand your experience. Tell me about your experience. What is your main stack and which project was on.`

4. **`interview`** — after each candidate reply, generate the **next** follow-up question from their answer (OpenRouter if configured; otherwise write one concise experience/stack/project question). Repeat **3–4** generated questions total (not counting the intro). Send only the question text.
5. **`github_ask`** — after the last generated question is answered, send:

   `Okay we will check your answer, As next step, we will give technical assessment task. share your github username.`

6. **`github_invited`** — when they share a GitHub username:
   - Pick the take-home repo from the stack → repo map using their stated main stack (ask the operator if no map match).
   - Invite that GitHub user to the repo.
   - Send: `I invited you, Once you have access to the repo, please start by reviewing the project and task instructions.`
   - Then send the take-home block from `templates/github-takehome.md` (fork only, 6 hours, reply with fork link + summary + tradeoffs).
7. **`awaiting_submission`** — watch for fork link + summary; notify the operator when it arrives.

## OpenRouter (optional)

- Use the saved OpenRouter API key when present.
- Prompt: interviewing for a technical assessment; given conversation so far, ask one concise next question about experience/stack/projects; no preamble.
- If no key, still run the interview with carefully written questions.

## Rules

- Fiverr DMs and assessment chat only for candidates who opted into conversation.
- One question at a time during assessment.
- No secrets, tokens, or passwords in chat or commits.
- Notify the operator on: shortlist ready, outreach batch sent, interview progress, GitHub invite sent, submission received.
- Stay quiet on empty inbox checks.
- All durable playbook changes for this bot go to `sea517/grok-bot-fiverr` via pull request.
