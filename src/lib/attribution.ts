export interface AttributionData {
  source: string;
  medium: string;
  campaign: string;
  timestamp: number;
  firstVisit: string;
  path: string;
}

const STORAGE_KEY = "rf_attribution";

export function getAttribution(): AttributionData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    //
  }
  return null;
}

export function captureAttribution(): AttributionData {
  const params = new URLSearchParams(window.location.search);
  const data: AttributionData = {
    source: params.get("utm_source") || params.get("ref") || "direct",
    medium: params.get("utm_medium") || "none",
    campaign: params.get("utm_campaign") || params.get("ref") || "organic",
    timestamp: Date.now(),
    firstVisit: new Date().toISOString(),
    path: window.location.pathname,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    //
  }
  return data;
}

export function trackAttribution(): void {
  if (!getAttribution()) {
    captureAttribution();
  }
}

export function getAttributionHistory(): AttributionData[] {
  try {
    const stored = localStorage.getItem("rf_attribution_history");
    if (stored) return JSON.parse(stored);
  } catch {
    //
  }
  return [];
}

export function addAttributionHistory(data: AttributionData): void {
  const history = getAttributionHistory();
  history.push(data);
  localStorage.setItem("rf_attribution_history", JSON.stringify(history));
}
