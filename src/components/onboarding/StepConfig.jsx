import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Cpu, Brain, Thermometer, Sparkles } from "lucide-react";

export default function StepConfig({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Extraction Engine</h2>
        <p className="text-sm text-slate-500 mt-1">Configure the AI model and settings used for document extraction.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" /> Engine Type
        </Label>
        <Select value={data.engine || "gen-ai"} onValueChange={(v) => onChange({ ...data, engine: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gen-ai">Gen AI Extraction - LLM</SelectItem>
            <SelectItem value="template">Template Based</SelectItem>
            <SelectItem value="hybrid">Hybrid Approach</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5" /> GPT Model
        </Label>
        <Select value={data.model || "gpt-4"} onValueChange={(v) => onChange({ ...data, model: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5" /> Temperature
          </Label>
          <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {data.temperature ?? 0}
          </span>
        </div>
        <Slider
          value={[data.temperature ?? 0]}
          onValueChange={([v]) => onChange({ ...data, temperature: v })}
          min={0} max={1} step={0.1}
        />
        <p className="text-xs text-slate-400">Lower values produce more focused, deterministic outputs.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600">Extraction Mode</Label>
        <Select value={data.mode || "text"} onValueChange={(v) => onChange({ ...data, mode: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="vision">Vision</SelectItem>
            <SelectItem value="multimodal">Multimodal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Evaluation
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Automatically evaluate extraction quality</p>
        </div>
        <Switch
          checked={data.enableEvaluation ?? true}
          onCheckedChange={(v) => onChange({ ...data, enableEvaluation: v })}
        />
      </div>
    </div>
  );
}