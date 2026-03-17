import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw, Download, ArrowLeftRight, CheckCircle2, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PARSE_BLOCKS_DOCLING = [
  { id: 1, type: "Heading", content: "Step-by-Step Instructions for Rollover Contributions", confidence: 98 },
  { id: 2, type: "Paragraph", content: "The JPMorgan Chase 401(k) Savings Plan offers you the opportunity to roll over the distribution you receive from your previous employer or IRA. The following instructions are designed to help you through this process.", confidence: 96 },
  { id: 3, type: "Paragraph", content: "Direct Rollover: Your previous plan or annuity makes the distribution check payable directly to JPMorgan Chase 401(k) Savings Plan.\n\nRegular 60-Day Rollover: Your previous plan or annuity makes the distribution check payable to you.", confidence: 94 },
  { id: 4, type: "Table", content: "| Type | Description |\n|------|-------------|\n| Direct | Check to JPM |\n| 60-Day | Check to you |", confidence: 91 },
];

const MOCK_PARSE_BLOCKS_FAST = [
  { id: 1, type: "Text", content: "Step-by-Step Instructions for Rollover Contributions", confidence: 88 },
  { id: 2, type: "Text", content: "The JPMorgan Chase 401(k) Savings Plan offers you the opportunity to roll over the distribution you receive from your previous employer or IRA.", confidence: 85 },
  { id: 3, type: "Text", content: "Direct Rollover: Check payable to JPMorgan Chase. Regular 60-Day Rollover: Check payable to you.", confidence: 82 },
];

const MOCK_EXTRACT_A = {
  fund_name: "JPMorgan Growth Fund",
  quarter: "Q1 2025",
  nav: "$1,204,500",
  distributions: "$45,200",
  capital_called: "$200,000",
  irr: "14.2%",
};

const MOCK_EXTRACT_B = {
  fund_name: "JPMorgan Growth Fund",
  quarter: "Q1 2025",
  nav: "$1,204,500",
  distributions: null,
  capital_called: "$200,000",
  irr: null,
  expense_ratio: "0.85%",
};

const MOCK_SPLIT_A = [
  { title: "1099 Consolidated Tax Statement", pages: "2-3", tags: ["2025"] },
  { title: "1099 Consolidated Tax Statement", pages: "5-12", tags: ["2025"] },
  { title: "1099 Consolidated Tax Statement", pages: "14-24", tags: ["2025"] },
  { title: "uncategorized", pages: "1,4,13", tags: [] },
];

const MOCK_SPLIT_B = [
  { title: "Tax Statement 2025", pages: "2-12", tags: ["2025"] },
  { title: "Tax Supplement", pages: "14-24", tags: [] },
  { title: "uncategorized", pages: "1,4,13", tags: [] },
];

// ── Config definitions per tool ───────────────────────────────────────────────

const TOOL_CONFIG = {
  parse: {
    label: "Parse",
    color: "emerald",
    options: [
      { value: "docling", label: "Docling" },
      { value: "fast-parse", label: "Fast Parse" },
    ],
    defaultLeft: "docling",
    defaultRight: "fast-parse",
  },
  extract: {
    label: "Extract",
    color: "violet",
    options: [
      { value: "invoice", label: "Invoice Processing" },
      { value: "tax", label: "Tax Statement" },
      { value: "kyc", label: "KYC Document" },
      { value: "bank", label: "Bank Statement" },
    ],
    defaultLeft: "invoice",
    defaultRight: "tax",
  },
  split: {
    label: "Split",
    color: "rose",
    options: [
      { value: "k1", label: "K-1 Schedule Parser" },
      { value: "fund", label: "Fund Report Splitter" },
      { value: "quarterly", label: "Quarterly Extractor" },
    ],
    defaultLeft: "k1",
    defaultRight: "fund",
  },
};

// ── Sub-renderers ─────────────────────────────────────────────────────────────

function ParseResult({ engine }) {
  const blocks = engine === "docling" ? MOCK_PARSE_BLOCKS_DOCLING : MOCK_PARSE_BLOCKS_FAST;
  const avgConf = Math.round(blocks.reduce((s, b) => s + b.confidence, 0) / blocks.length);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{blocks.length} blocks</span>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 rounded-md px-2 py-0.5">avg {avgConf}% conf</span>
      </div>
      {blocks.map((b) => (
        <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 font-mono text-[10px]">{b.type}</span>
            <span className="text-emerald-600 font-semibold text-[10px]">{b.confidence}%</span>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{b.content}</p>
        </div>
      ))}
    </div>
  );
}

function ExtractResult({ config }) {
  const data = config === "invoice" || config === "bank" ? MOCK_EXTRACT_A : MOCK_EXTRACT_B;
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className={cn("flex items-start justify-between bg-white border rounded-xl px-3 py-2.5 text-xs gap-3", v === null ? "border-amber-200 bg-amber-50" : "border-slate-200")}>
          <span className="font-medium text-slate-500 capitalize">{k.replace(/_/g, " ")}</span>
          {v !== null
            ? <span className="text-slate-800 font-semibold text-right">{v}</span>
            : <span className="text-amber-500 italic text-[11px]">not found</span>
          }
        </div>
      ))}
    </div>
  );
}

function SplitResult({ config }) {
  const results = config === "k1" ? MOCK_SPLIT_A : MOCK_SPLIT_B;
  return (
    <div className="space-y-2">
      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{results.length} segments</p>
      {results.map((r, i) => (
        <div key={i} className={cn("bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs", r.title === "uncategorized" && "opacity-50")}>
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", r.title === "uncategorized" ? "bg-slate-300" : "bg-rose-400")} />
            <span className={cn("font-medium", r.title === "uncategorized" ? "text-slate-400 italic" : "text-slate-700")}>{r.title}</span>
            {r.tags.map(t => <span key={t} className="bg-rose-50 text-rose-600 rounded px-1.5 py-0.5 text-[10px] font-semibold">{t}</span>)}
          </div>
          <span className="font-mono text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">p. {r.pages}</span>
        </div>
      ))}
    </div>
  );
}

// ── DiffBadge ────────────────────────────────────────────────────────────────

function DiffSummary({ tool, leftConfig, rightConfig }) {
  const diffs = {
    parse: {
      docling: { blocks: 4, avgConf: 95 },
      "fast-parse": { blocks: 3, avgConf: 85 },
    },
    extract: {
      invoice: { found: 6, missing: 0 },
      tax: { found: 4, missing: 2 },
      kyc: { found: 4, missing: 2 },
      bank: { found: 6, missing: 0 },
    },
    split: {
      k1: { segments: 4 },
      fund: { segments: 3 },
      quarterly: { segments: 3 },
    },
  };

  if (tool === "parse") {
    const l = diffs.parse[leftConfig];
    const r = diffs.parse[rightConfig];
    return (
      <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200">
        <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span><b>{l?.blocks}</b> blocks vs <b>{r?.blocks}</b> blocks</span>
        <span className="text-slate-300">·</span>
        <span>Avg confidence: <b className="text-emerald-600">{l?.avgConf}%</b> vs <b className="text-amber-600">{r?.avgConf}%</b></span>
      </div>
    );
  }
  if (tool === "extract") {
    const l = diffs.extract[leftConfig];
    const r = diffs.extract[rightConfig];
    return (
      <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200">
        <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span><b>{l?.found}</b> fields found vs <b>{r?.found}</b> fields</span>
        <span className="text-slate-300">·</span>
        <span>Missing: <b className="text-amber-500">{l?.missing}</b> vs <b className="text-amber-500">{r?.missing}</b></span>
      </div>
    );
  }
  if (tool === "split") {
    const l = diffs.split[leftConfig];
    const r = diffs.split[rightConfig];
    return (
      <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200">
        <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span><b>{l?.segments}</b> segments vs <b>{r?.segments}</b> segments</span>
      </div>
    );
  }
  return null;
}

// ── Main ComparePanel ─────────────────────────────────────────────────────────

export default function ComparePanel({ defaultTool = "parse" }) {
  const [tool, setTool] = useState(defaultTool);
  const cfg = TOOL_CONFIG[tool];
  const [leftConfig, setLeftConfig] = useState(cfg.defaultLeft);
  const [rightConfig, setRightConfig] = useState(cfg.defaultRight);
  const [running, setRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const handleToolChange = (t) => {
    setTool(t);
    const c = TOOL_CONFIG[t];
    setLeftConfig(c.defaultLeft);
    setRightConfig(c.defaultRight);
    setHasResults(true);
  };

  const handleRun = () => {
    setRunning(true);
    setHasResults(false);
    setTimeout(() => { setRunning(false); setHasResults(true); }, 1600);
  };

  const colorMap = { emerald: "text-emerald-700 bg-emerald-50 border-emerald-200", violet: "text-violet-700 bg-violet-50 border-violet-200", rose: "text-rose-700 bg-rose-50 border-rose-200" };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-white/80 backdrop-blur-sm flex-shrink-0 gap-3 flex-wrap">
        {/* Tool selector */}
        <div className="flex gap-0.5 bg-slate-100 rounded-xl p-0.5">
          {Object.entries(TOOL_CONFIG).map(([key, c]) => (
            <button
              key={key}
              onClick={() => handleToolChange(key)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize",
                tool === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center flex-wrap">
          {/* Left picker */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">A</span>
            <select
              value={leftConfig}
              onChange={(e) => setLeftConfig(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-600 outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {cfg.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          {/* Right picker */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">B</span>
            <select
              value={rightConfig}
              onChange={(e) => setRightConfig(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-600 outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {cfg.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-slate-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={running}
            className="h-7 rounded-xl text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 border-0"
          >
            {running
              ? <><RefreshCw className="w-3 h-3 animate-spin" />Running…</>
              : <><Zap className="w-3 h-3" />Compare</>
            }
          </Button>
        </div>
      </div>

      {/* Diff summary bar */}
      {hasResults && (
        <div className="px-4 py-2 border-b border-slate-100 bg-white/60 flex-shrink-0">
          <DiffSummary tool={tool} leftConfig={leftConfig} rightConfig={rightConfig} />
        </div>
      )}

      {/* Split panes */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left */}
        <div className="flex-1 flex flex-col min-h-0 border-r border-slate-200">
          <div className={cn("flex items-center gap-2 px-4 py-2 border-b border-slate-100 flex-shrink-0", colorMap[cfg.color])}>
            <span className="w-4 h-4 rounded-full border-2 border-current text-[9px] font-bold flex items-center justify-center flex-shrink-0">A</span>
            <span className="text-xs font-semibold capitalize">
              {cfg.options.find(o => o.value === leftConfig)?.label}
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {!hasResults ? (
              <div className="text-center text-slate-400 text-xs py-10">Click Compare to run…</div>
            ) : (
              <>
                {tool === "parse" && <ParseResult engine={leftConfig} />}
                {tool === "extract" && <ExtractResult config={leftConfig} />}
                {tool === "split" && <SplitResult config={leftConfig} />}
              </>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className={cn("flex items-center gap-2 px-4 py-2 border-b border-slate-100 flex-shrink-0", colorMap[cfg.color])}>
            <span className="w-4 h-4 rounded-full border-2 border-current text-[9px] font-bold flex items-center justify-center flex-shrink-0">B</span>
            <span className="text-xs font-semibold capitalize">
              {cfg.options.find(o => o.value === rightConfig)?.label}
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {!hasResults ? (
              <div className="text-center text-slate-400 text-xs py-10">Click Compare to run…</div>
            ) : (
              <>
                {tool === "parse" && <ParseResult engine={rightConfig} />}
                {tool === "extract" && <ExtractResult config={rightConfig} />}
                {tool === "split" && <SplitResult config={rightConfig} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}