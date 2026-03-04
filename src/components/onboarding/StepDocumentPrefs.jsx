import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FileText, BarChart2, PieChart, ClipboardList } from "lucide-react";

const documentTypes = [
  { value: "alts-schedule", label: "Alts Schedule on Investment", icon: BarChart2, desc: "Quarterly alternative investment schedules" },
  { value: "quarterly-report", label: "Quarterly Report", icon: ClipboardList, desc: "Fund performance quarterly reports" },
  { value: "annual-statement", label: "Annual Statement", icon: FileText, desc: "Year-end financial statements" },
  { value: "fund-summary", label: "Fund Summary", icon: PieChart, desc: "High-level fund overview documents" },
];

export default function StepDocumentPrefs({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Document Type & Preferences</h2>
        <p className="text-sm text-slate-500 mt-1">Select the type of documents you'll be extracting data from.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {documentTypes.map((dt) => {
          const Icon = dt.icon;
          const isSelected = data.documentType === dt.value;
          return (
            <button
              key={dt.value}
              onClick={() => onChange({ ...data, documentType: dt.value })}
              className={cn(
                "text-left p-4 rounded-lg border-2 transition-all",
                isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-2", isSelected ? "text-indigo-600" : "text-slate-400")} />
              <p className={cn("text-sm font-medium", isSelected ? "text-indigo-700" : "text-slate-700")}>
                {dt.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{dt.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600">Raw Text Model</Label>
        <Select value={data.rawTextModel || "textract"} onValueChange={(v) => onChange({ ...data, rawTextModel: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="textract">Amazon Textract</SelectItem>
            <SelectItem value="azure-ocr">Azure OCR</SelectItem>
            <SelectItem value="google-vision">Google Vision</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600">Special Instructions (optional)</Label>
        <Textarea
          placeholder="e.g. Always extract currency in USD, ignore footnotes..."
          value={data.instructions || ""}
          onChange={(e) => onChange({ ...data, instructions: e.target.value })}
          className="h-24 text-sm"
        />
      </div>
    </div>
  );
}