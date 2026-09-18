import {
  type CampaignConfig,
  STORAGE_KEY,
  defaultCampaign,
} from './types'

export function loadCampaign(): CampaignConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultCampaign()
    const parsed = JSON.parse(raw) as Partial<CampaignConfig>
    return {
      ...defaultCampaign(),
      ...parsed,
      schema_version: 1,
    }
  } catch {
    return defaultCampaign()
  }
}

export function saveCampaign(campaign: CampaignConfig): CampaignConfig {
  const next: CampaignConfig = {
    ...campaign,
    schema_version: 1,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function toExportJson(campaign: CampaignConfig): string {
  const payload: CampaignConfig = {
    schema_version: 1,
    campaign_name: campaign.campaign_name.trim(),
    keyword: campaign.keyword.trim(),
    first_message: campaign.first_message.trim(),
    shortlist_size: Number(campaign.shortlist_size) || 8,
    status: campaign.status,
    notes: campaign.notes.trim(),
    updated_at: new Date().toISOString(),
  }
  return `${JSON.stringify(payload, null, 2)}\n`
}

export function downloadCampaignJson(campaign: CampaignConfig): void {
  const blob = new Blob([toExportJson(campaign)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'campaign.json'
  a.click()
  URL.revokeObjectURL(url)
}
