// /services/dealService.ts

import type { Deal } from "../types";

const STORAGE_KEY = "crm_deals";

// Load all deals from localStorage
export function loadDeals(): Deal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Deal[];
  } catch {
    return [];
  }
}

// Save deals
export function saveDeals(deals: Deal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
}

// Create a new deal
export function createDeal(deal: Deal) {
  const existing = loadDeals();
  const updated = [deal, ...existing];
  saveDeals(updated);
  return updated;
}

// Update deal fields
export function updateDeal(id: string, patch: Partial<Deal>) {
  const existing = loadDeals();
  const updated = existing.map(d => d.id === id ? { ...d, ...patch } : d);
  saveDeals(updated);
  return updated;
}

// Replace all deals (used for CSV import)
export function replaceDeals(newDeals: Deal[]) {
  saveDeals(newDeals);
  return newDeals;
}
