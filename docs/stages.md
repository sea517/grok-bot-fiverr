# Stage reference

## Campaign / sourcing

| Stage | Meaning |
| --- | --- |
| `fiverr_signed_in` | Browser session can use Fiverr search + inbox |
| `search` | Keyword search done; shortlist prepared |
| `outreach_dm` | Approved candidates messaged |

## Per candidate (assessment)

| Stage | Next action |
| --- | --- |
| `replied` | Send `Hi` |
| `greeted` | Wait for reply, then send intro |
| `intro_sent` | Wait for experience/stack answer |
| `interview` | 3–4 follow-up questions, one at a time |
| `github_ask` | Wait for GitHub username |
| `github_invited` | Take-home instructions sent |
| `awaiting_submission` | Wait for fork link + summary |

Never skip stages. Persist stage per candidate in bot memory.
