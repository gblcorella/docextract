import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Plus, Trash2, ChevronDown, ChevronUp, Zap, Tag, Mail, Code2, Radio, HardDrive } from "lucide-react";

const USE_CASE_TYPES = [
  { value: "extraction", label: "Data Extraction", icon: Zap, color: "indigo" },
  { value: "classification", label: "Classification", icon: Tag, color: "purple" },
];

const INGESTION_METHODS = [
  { value: "email", label: "Email", icon: Mail, desc: "Receive documents via email attachment" },
  { value: "api", label: "API", icon: Code2, desc: "Push documents via REST API call" },
  { value: "kafka", label: "Kafka Event", icon: Radio, desc: "Stream documents from Kafka topic" },
  { value: "s3", label: "S3 / Storage", icon: HardDrive, desc: "Poll from S3 bucket or cloud storage" },
];

function ExtractionConfig({ config, onChange }) {
  return (
    <div className="space-y-4 mt-3 pt-3 border-t border-slate-100">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Extraction Settings</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Engine</Label>
          <Select value={config.engine || "gen-ai"} onValueChange={(v) => onChange({ ...config, engine: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="gen-ai">Gen AI - LLM</SelectItem>
              <SelectItem value="template">Template Based</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Model</Label>
          <Select value={config.model || "gpt-4"} onValueChange={(v) => onChange({ ...config, model: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Document Type</Label>
          <Select value={config.documentType || "alts-schedule"} onValueChange={(v) => onChange({ ...config, documentType: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="alts-schedule">Alts Schedule</SelectItem>
              <SelectItem value="quarterly-report">Quarterly Report</SelectItem>
              <SelectItem value="annual-statement">Annual Statement</SelectItem>
              <SelectItem value="fund-summary">Fund Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Mode</Label>
          <Select value={config.mode || "text"} onValueChange={(v) => onChange({ ...config, mode: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="vision">Vision</SelectItem>
              <SelectItem value="multimodal">Multimodal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-slate-500">Temperature</Label>
          <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{config.temperature ?? 0}</span>
        </div>
        <Slider
          value={[config.temperature ?? 0]}
          onValueChange={([v]) => onChange({ ...config, temperature: v })}
          min={0} max={1} step={0.1}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Document Ingestion Method</p>
        <div className="grid grid-cols-2 gap-2">
          {INGESTION_METHODS.map((method) => {
            const Icon = method.icon;
            const isSelected = config.ingestion === method.value;
            return (
              <button
                key={method.value}
                onClick={() => onChange({ ...config, ingestion: method.value })}
                className={cn(
                  "text-left p-3 rounded-lg border-2 transition-all",
                  isSelected ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-indigo-200"
                )}
              >
                <Icon className={cn("w-4 h-4 mb-1", isSelected ? "text-indigo-600" : "text-slate-400")} />
                <p className={cn("text-xs font-semibold", isSelected ? "text-indigo-700" : "text-slate-700")}>{method.label}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-tight">{method.desc}</p>
              </button>
            );
          })}
        </div>

        {config.ingestion === "email" && (
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs text-slate-500">Inbound Email Address</Label>
            <Input className="h-8 text-xs" placeholder="docs-intake@yourapp.com" value={config.inboundEmail || ""} onChange={(e) => onChange({ ...config, inboundEmail: e.target.value })} />
          </div>
        )}
        {config.ingestion === "api" && (
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs text-slate-500">API Endpoint</Label>
            <Input className="h-8 text-xs" placeholder="https://api.yourapp.com/ingest" value={config.apiEndpoint || ""} onChange={(e) => onChange({ ...config, apiEndpoint: e.target.value })} />
          </div>
        )}
        {config.ingestion === "kafka" && (
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs text-slate-500">Kafka Topic</Label>
            <Input className="h-8 text-xs" placeholder="docs.inbound.topic" value={config.kafkaTopic || ""} onChange={(e) => onChange({ ...config, kafkaTopic: e.target.value })} />
          </div>
        )}
        {config.ingestion === "s3" && (
          <div className="space-y-1.5 mt-2">
            <Label className="text-xs text-slate-500">S3 Bucket Path</Label>
            <Input className="h-8 text-xs" placeholder="s3://your-bucket/inbound/" value={config.s3Path || ""} onChange={(e) => onChange({ ...config, s3Path: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  );
}

function UseCaseCard({ useCase, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const typeInfo = USE_CASE_TYPES.find((t) => t.value === useCase.type);
  const Icon = typeInfo?.icon || Zap;

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50">
        <Icon className="w-4 h-4 text-indigo-500" />
        <div className="flex-1">
          <Input
            className="h-7 text-sm font-medium border-0 bg-transparent p-0 focus-visible:ring-0 w-48"
            placeholder="Use case name..."
            value={useCase.name || ""}
            onChange={(e) => onUpdate({ ...useCase, name: e.target.value })}
          />
        </div>
        <Select value={useCase.type} onValueChange={(v) => onUpdate({ ...useCase, type: v, extractionConfig: {} })}>
          <SelectTrigger className="h-7 w-[140px] text-xs border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {USE_CASE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button onClick={onDelete} className="text-slate-400 hover:text-rose-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && useCase.type === "extraction" && (
        <div className="px-4 pb-4">
          <ExtractionConfig
            config={useCase.extractionConfig || {}}
            onChange={(cfg) => onUpdate({ ...useCase, extractionConfig: cfg })}
          />
        </div>
      )}

      {expanded && useCase.type === "classification" && (
        <div className="px-4 py-3 text-xs text-slate-400 italic">
          Classification configuration will be available in a future step.
        </div>
      )}
    </div>
  );
}

export default function StepUseCases({ data, onChange }) {
  const useCases = data.useCases || [];

  const addUseCase = () => {
    onChange({
      ...data,
      useCases: [
        ...useCases,
        { id: Date.now().toString(), name: "", type: "extraction", extractionConfig: {} }
      ]
    });
  };

  const updateUseCase = (id, updated) => {
    onChange({ ...data, useCases: useCases.map((uc) => (uc.id === id ? updated : uc)) });
  };

  const deleteUseCase = (id) => {
    onChange({ ...data, useCases: useCases.filter((uc) => uc.id !== id) });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Use Case Setup</h2>
        <p className="text-sm text-slate-500 mt-1">Define one or more use cases for your application.</p>
      </div>

      <div className="space-y-3">
        {useCases.map((uc) => (
          <UseCaseCard
            key={uc.id}
            useCase={uc}
            onUpdate={(updated) => updateUseCase(uc.id, updated)}
            onDelete={() => deleteUseCase(uc.id)}
          />
        ))}

        {useCases.length === 0 && (
          <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No use cases added yet</p>
          </div>
        )}
      </div>

      <Button variant="outline" onClick={addUseCase} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-2" />
        Add Use Case
      </Button>
    </div>
  );
}