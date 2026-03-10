/**
 * Data Service Layer
 * Simulates async service calls backed by local JSON data files.
 * Replace fetch() calls here when a real API is available.
 */

import { PROFILES_DATA } from "@/components/data/profiles";
import { DOCUMENT_CONFIGS_DATA } from "@/components/data/documentConfigs";
import { TRANSACTIONS_DATA } from "@/components/data/transactions";
import {
  ENGINE_DATA,
  DOC_TYPE_DATA,
  LATENCY_DATA,
  VOLUME_DATA,
  DASHBOARD_VOLUME,
  RECENT_TRANSACTIONS,
} from "@/components/data/analytics";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Profiles ────────────────────────────────────────────────────────────────
let _profiles = [...PROFILES_DATA];

export const profilesService = {
  getAll: async () => { await delay(); return [..._profiles]; },
  create: async (data) => { await delay(); const item = { ...data, id: Date.now() }; _profiles = [..._profiles, item]; return item; },
  update: async (id, data) => { await delay(); _profiles = _profiles.map((p) => p.id === id ? { ...p, ...data } : p); return _profiles.find((p) => p.id === id); },
  remove: async (id) => { await delay(); _profiles = _profiles.filter((p) => p.id !== id); },
};

// ── Document Configs ─────────────────────────────────────────────────────────
let _docConfigs = [...DOCUMENT_CONFIGS_DATA];

export const documentConfigsService = {
  getAll: async () => { await delay(); return [..._docConfigs]; },
  create: async (data) => { await delay(); const item = { ...data, id: Date.now() }; _docConfigs = [..._docConfigs, item]; return item; },
  update: async (id, data) => { await delay(); _docConfigs = _docConfigs.map((d) => d.id === id ? { ...d, ...data } : d); return _docConfigs.find((d) => d.id === id); },
  remove: async (id) => { await delay(); _docConfigs = _docConfigs.filter((d) => d.id !== id); },
};

// ── Transactions ─────────────────────────────────────────────────────────────
let _transactions = [...TRANSACTIONS_DATA];

export const transactionsService = {
  getAll: async () => { await delay(); return [..._transactions]; },
  update: async (id, data) => { await delay(); _transactions = _transactions.map((t) => t.id === id ? { ...t, ...data } : t); return _transactions.find((t) => t.id === id); },
};

// ── Analytics ────────────────────────────────────────────────────────────────
export const analyticsService = {
  getEngineData: async () => { await delay(); return ENGINE_DATA; },
  getDocTypeData: async () => { await delay(); return DOC_TYPE_DATA; },
  getLatencyData: async () => { await delay(); return LATENCY_DATA; },
  getVolumeData: async (range) => { await delay(); return VOLUME_DATA[range] || VOLUME_DATA["Last 30 Days"]; },
  getDashboardVolume: async () => { await delay(); return DASHBOARD_VOLUME; },
  getRecentTransactions: async () => { await delay(); return RECENT_TRANSACTIONS; },
};