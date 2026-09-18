export type CampaignStatus = 'draft' | 'searching' | 'outreach' | 'assessing'

export interface CampaignConfig {
  schema_version: 1
  campaign_name: string
  keyword: string
  first_message: string
  shortlist_size: number
  status: CampaignStatus
  notes: string
  updated_at: string
}

export const STATUS_OPTIONS: { value: CampaignStatus; label: string; hint: string }[] = [
  { value: 'draft', label: 'Draft', hint: 'Configure keyword & message' },
  { value: 'searching', label: 'Searching', hint: 'Bot is sourcing candidates' },
  { value: 'outreach', label: 'Outreach', hint: 'Sending first DMs' },
  { value: 'assessing', label: 'Assessing', hint: 'Chat assessments in progress' },
]

export const STORAGE_KEY = 'fiverr-recruiting-campaign'

export function defaultCampaign(): CampaignConfig {
  return {
    schema_version: 1,
    campaign_name: '',
    keyword: '',
    first_message: '',
    shortlist_size: 8,
    status: 'draft',
    notes: '',
    updated_at: new Date().toISOString(),
  }
}
