/**
 * OpenRoad Refinance Integration Constants
 * Single source of truth for refinance URL generation
 */

const OPENROAD_BASE_URL = "https://www.openroadlending.com/applyone/"
const AFFILIATE_ID = "1445"
const DEFAULT_SUB_ID = "enteryoursubidhere"

/**
 * Generate OpenRoad refinance URL with affiliate tracking
 * @param subId - Optional custom sub ID (e.g., referral code or user ID). Must be non-sensitive data only.
 * @returns Complete OpenRoad refinance URL with tracking parameters
 */
export function getOpenRoadRefiUrl(subId?: string): string {
  const url = new URL(OPENROAD_BASE_URL)
  const params = new URLSearchParams()
  
  // Always include affiliate ID
  params.set("aid", AFFILIATE_ID)
  
  // Include opt_1 parameter with subId or default
  const effectiveSubId = subId && subId.trim() !== "" ? subId : DEFAULT_SUB_ID
  params.set("opt_1", effectiveSubId)
  
  url.search = params.toString()
  
  return url.toString()
}
