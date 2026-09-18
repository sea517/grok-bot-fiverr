import { useEffect, useMemo, useState } from 'react'
import {
  type CampaignConfig,
  type CampaignStatus,
  STATUS_OPTIONS,
} from './types'
import {
  downloadCampaignJson,
  loadCampaign,
  saveCampaign,
} from './storage'
import './App.css'

type Toast = { kind: 'ok' | 'err'; text: string } | null

export default function App() {
  const [campaign, setCampaign] = useState<CampaignConfig>(() => loadCampaign())
  const [toast, setToast] = useState<Toast>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  const canSave = useMemo(() => {
    return campaign.keyword.trim().length > 0 && campaign.first_message.trim().length > 0
  }, [campaign.keyword, campaign.first_message])

  function patch<K extends keyof CampaignConfig>(key: K, value: CampaignConfig[K]) {
    setCampaign((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  function handleSave() {
    if (!canSave) {
      setToast({
        kind: 'err',
        text: 'Keyword and first outreach message are required.',
      })
      return
    }
    const saved = saveCampaign(campaign)
    setCampaign(saved)
    setDirty(false)
    setToast({ kind: 'ok', text: 'Saved to browser localStorage.' })
  }

  function handleExport() {
    if (!canSave) {
      setToast({
        kind: 'err',
        text: 'Add keyword + first message before exporting.',
      })
      return
    }
    const saved = saveCampaign(campaign)
    setCampaign(saved)
    setDirty(false)
    downloadCampaignJson(saved)
    setToast({
      kind: 'ok',
      text: 'Downloaded campaign.json — place it at config/campaign.json for the bot.',
    })
  }

  function handleReset() {
    const blank = saveCampaign({
      schema_version: 1,
      campaign_name: '',
      keyword: '',
      first_message: '',
      shortlist_size: 8,
      status: 'draft',
      notes: '',
      updated_at: new Date().toISOString(),
    })
    setCampaign(blank)
    setDirty(false)
    setToast({ kind: 'ok', text: 'Form cleared (localStorage updated).' })
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <h1>Fiverr recruiting — operator dashboard</h1>
            <p className="muted">
              Set keyword + first DM, then export <code>config/campaign.json</code> for Grok Bot.
            </p>
          </div>
        </div>
        <div className="top-actions">
          {dirty && <span className="pill warn">Unsaved changes</span>}
          <button type="button" className="btn ghost" onClick={handleReset}>
            Reset
          </button>
          <button type="button" className="btn secondary" onClick={handleSave} disabled={!canSave}>
            Save
          </button>
          <button type="button" className="btn primary" onClick={handleExport} disabled={!canSave}>
            Export campaign.json
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="panel form-panel">
          <h2>Campaign inputs</h2>

          <label className="field">
            <span className="label">
              Search keyword <em>*</em>
            </span>
            <input
              type="text"
              value={campaign.keyword}
              onChange={(e) => patch('keyword', e.target.value)}
              placeholder="e.g. react typescript"
              autoComplete="off"
            />
            <span className="hint">Used by the bot for Fiverr freelancer search.</span>
          </label>

          <label className="field">
            <span className="label">
              First outreach DM <em>*</em>
            </span>
            <textarea
              rows={10}
              value={campaign.first_message}
              onChange={(e) => patch('first_message', e.target.value)}
              placeholder="Paste the first message the bot should send…"
            />
            <span className="hint">
              Supports placeholders like <code>{'{{candidate_name}}'}</code>,{' '}
              <code>{'{{keyword}}'}</code>, <code>{'{{sender_name}}'}</code>.
            </span>
          </label>

          <div className="row">
            <label className="field">
              <span className="label">Campaign name</span>
              <input
                type="text"
                value={campaign.campaign_name}
                onChange={(e) => patch('campaign_name', e.target.value)}
                placeholder="optional label"
                autoComplete="off"
              />
            </label>

            <label className="field narrow">
              <span className="label">Shortlist size</span>
              <input
                type="number"
                min={1}
                max={50}
                value={campaign.shortlist_size}
                onChange={(e) =>
                  patch('shortlist_size', Math.max(1, Number(e.target.value) || 1))
                }
              />
            </label>
          </div>

          <label className="field">
            <span className="label">Notes</span>
            <textarea
              rows={3}
              value={campaign.notes}
              onChange={(e) => patch('notes', e.target.value)}
              placeholder="Filters, must-haves, voice notes for the operator…"
            />
          </label>
        </section>

        <aside className="side">
          <section className="panel status-panel">
            <h2>Campaign status</h2>
            <p className="muted small">
              Local stub for the operator — the bot can mirror this field from{' '}
              <code>campaign.json</code>.
            </p>
            <div className="status-grid" role="radiogroup" aria-label="Campaign status">
              {STATUS_OPTIONS.map((opt) => {
                const active = campaign.status === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`status-card ${active ? 'active' : ''}`}
                    onClick={() => patch('status', opt.value as CampaignStatus)}
                  >
                    <strong>{opt.label}</strong>
                    <span>{opt.hint}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="panel preview-panel">
            <h2>Export preview</h2>
            <dl className="kv">
              <div>
                <dt>Keyword</dt>
                <dd>{campaign.keyword.trim() || '—'}</dd>
              </div>
              <div>
                <dt>Shortlist</dt>
                <dd>{campaign.shortlist_size}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`pill status-${campaign.status}`}>{campaign.status}</span>
                </dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd className="mono">
                  {campaign.updated_at
                    ? new Date(campaign.updated_at).toLocaleString()
                    : '—'}
                </dd>
              </div>
            </dl>
            <ol className="steps">
              <li>Save or Export from this dashboard.</li>
              <li>
                Place the file at <code>config/campaign.json</code> (gitignored).
              </li>
              <li>Tell Grok Bot to run the Fiverr recruiting skill.</li>
            </ol>
          </section>
        </aside>
      </main>

      {toast && (
        <div className={`toast ${toast.kind}`} role="status">
          {toast.text}
        </div>
      )}
    </div>
  )
}
