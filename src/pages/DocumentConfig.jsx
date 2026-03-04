import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowLeft, FileText, Zap, Tag, EyeOff, ChevronRight, Search, Plus, History, Code2, LayoutList, Save, X, Sparkles, FileUp, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ConfigBar from "@/components/extraction/ConfigBar";
import TaskDescription from "@/components/extraction/TaskDescription";
import FieldCard from "@/components/extraction/FieldCard";

const DOCUMENTS = [
  {
    id: 1,
    name: "Blackstone Q1 2026",
    fileName: "Blackstone_Q1_2026.pdf",
    type: "alts-schedule",
    typeLabel: "Alts Schedule",
    configs: {
      extraction: {
        enabled: true,
        engine: "Gen AI - LLM",
        model: "GPT-4 Turbo",
        mode: "Accurate",
        temperature: 0.2,
        fields: ["Fund Name", "Investment Date", "Capital Called", "Distributions", "NAV"],
      },
      classification: { enabled: false },
      redaction: { enabled: false },
    },
  },
  {
    id: 2,
    name: "Apollo Fund Report",
    fileName: "Apollo_Fund_Report.pdf",
    type: "quarterly-report",
    typeLabel: "Quarterly Report",
    configs: {
      extraction: {
        enabled: true,
        engine: "Template Based",
        model: "-",
        mode: "Fast",
        temperature: 0,
        fields: ["Total Assets", "Net Income", "Return %", "Benchmark"],
      },
      classification: {
        enabled: true,
        model: "GPT-4o",
        categories: ["Equity Report", "Fixed Income", "Alternative Investment", "Mixed Asset"],
      },
      redaction: { enabled: false },
    },
  },
  {
    id: 3,
    name: "KKR Quarterly Dec",
    fileName: "KKR_Quarterly_Dec.pdf",
    type: "quarterly-report",
    typeLabel: "Quarterly Report",
    configs: {
      extraction: { enabled: false },
      classification: {
        enabled: true,
        model: "GPT-4o",
        categories: ["Private Equity", "Real Assets", "Credit"],
      },
      redaction: {
        enabled: true,
        patterns: ["SSN", "Account Numbers", "Personal Names"],
        method: "Black Box",
      },
    },
  },
  {
    id: 4,
    name: "Carlyle Alts Q4",
    fileName: "Carlyle_Alts_Q4.pdf",
    type: "alts-schedule",
    typeLabel: "Alts Schedule",
    configs: {
      extraction: {
        enabled: true,
        engine: "Gen AI - LLM",
        model: "GPT-4 Turbo",
        mode: "Accurate",
        temperature: 0.1,
        fields: ["Commitment", "Unfunded", "Fair Value", "Multiple"],
      },
      classification: { enabled: false },
      redaction: {
        enabled: true,
        patterns: ["Account Numbers", "Tax IDs"],
        method: "Mask",
      },
    },
  },
];

const CONFIG_TABS = [
  { key: "extraction", label: "Extraction", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
  { key: "classification", label: "Classification", icon: Tag, color: "text-purple-600", bg: "bg-purple-50" },
  { key: "redaction", label: "Redaction", icon: EyeOff, color: "text-rose-600", bg: "bg-rose-50" },
];

function ExtractionDetail({ config }) {
  if (!config.enabled) return <DisabledState label="Extraction" />;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Engine", value: config.engine },
          { label: "Model", value: config.model },
          { label: "Mode", value: config.mode },
          { label: "Temperature", value: config.temperature },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-slate-700">{value}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Extraction Fields ({config.fields.length})</p>
        <div className="flex flex-wrap gap-2">
          {config.fields.map((f) => (
            <span key={f} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassificationDetail({ config }) {
  if (!config.enabled) return <DisabledState label="Classification" />;
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-lg p-3 inline-block">
        <p className="text-xs text-slate-400 mb-0.5">Model</p>
        <p className="text-sm font-semibold text-slate-700">{config.model}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Categories ({config.categories.length})</p>
        <div className="flex flex-wrap gap-2">
          {config.categories.map((c) => (
            <span key={c} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-full font-medium">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RedactionDetail({ config }) {
  if (!config.enabled) return <DisabledState label="Redaction" />;
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-lg p-3 inline-block">
        <p className="text-xs text-slate-400 mb-0.5">Method</p>
        <p className="text-sm font-semibold text-slate-700">{config.method}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Redaction Patterns ({config.patterns.length})</p>
        <div className="flex flex-wrap gap-2">
          {config.patterns.map((p) => (
            <span key={p} className="text-xs bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-full font-medium">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DisabledState({ label }) {
  return (
    <div className="text-center py-10 text-slate-400">
      <p className="text-sm">{label} is not configured for this document.</p>
    </div>
  );
}

function DocumentDetail({ doc, onBack }) {
  const [activeTab, setActiveTab] = useState("extraction");
  const activeConfigs = CONFIG_TABS.filter((t) => doc.configs[t.key]?.enabled);

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to documents
      </button>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{doc.name}</h1>
          <p className="text-sm text-slate-400 font-mono mt-0.5">{doc.fileName}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">{doc.typeLabel}</Badge>
            {activeConfigs.map((t) => {
              const Icon = t.icon;
              return (
                <span key={t.key} className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", t.color, t.bg, "border-current/20")}>
                  <Icon className="w-3 h-3" />{t.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Config Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-lg w-fit">
        {CONFIG_TABS.map((tab) => {
          const Icon = tab.icon;
          const enabled = doc.configs[tab.key]?.enabled;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === tab.key ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", activeTab === tab.key && enabled ? tab.color : "")} />
              {tab.label}
              {enabled && <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-0.5" />}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "extraction" && <ExtractionDetail config={doc.configs.extraction} />}
            {activeTab === "classification" && <ClassificationDetail config={doc.configs.classification} />}
            {activeTab === "redaction" && <RedactionDetail config={doc.configs.redaction} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function DocumentConfig() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = DOCUMENTS.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.fileName.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedDoc) {
    return <DocumentDetail doc={selectedDoc} onBack={() => setSelectedDoc(null)} />;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Document Config</h1>
          <p className="text-sm text-slate-500 mt-0.5">{DOCUMENTS.length} documents configured</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input className="pl-9 h-9 text-sm" placeholder="Search documents…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3 max-w-4xl">
        {filtered.map((doc) => {
          const activeConfigs = CONFIG_TABS.filter((t) => doc.configs[t.key]?.enabled);
          return (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{doc.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{doc.fileName}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{doc.typeLabel}</Badge>
                    {activeConfigs.map((t) => {
                      const Icon = t.icon;
                      return (
                        <span key={t.key} className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", t.color, t.bg)}>
                          <Icon className="w-3 h-3" />{t.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedDoc(doc)} className="flex-shrink-0 text-slate-600">
                View Detail
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">No documents match your search.</div>
        )}
      </div>
    </div>
  );
}