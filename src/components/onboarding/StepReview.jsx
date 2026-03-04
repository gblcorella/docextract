import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Briefcase, Mail, Cpu, Brain, FileText, CheckCircle2 } from "lucide-react";

function ReviewRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-indigo-500" />
      </div>
      <span className="text-xs text-slate-500 w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-slate-800 font-medium">{value}</span>
    </div>
  );
}

export default function StepReview({ profile, config, docPrefs }) {
  const docTypeLabels = {
    "alts-schedule": "Alts Schedule on Investment",
    "quarterly-report": "Quarterly Report",
    "annual-statement": "Annual Statement",
    "fund-summary": "Fund Summary",
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Review & Confirm</h2>
        <p className="text-sm text-slate-500 mt-1">Please review your settings before finishing onboarding.</p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Profile</p>
          <div className="bg-white rounded-lg border border-slate-200 px-4">
            <ReviewRow icon={User} label="Name" value={`${profile.firstName || ""} ${profile.lastName || ""}`.trim()} />
            <ReviewRow icon={Building2} label="Company" value={profile.company} />
            <ReviewRow icon={Briefcase} label="Role" value={profile.role} />
            <ReviewRow icon={Mail} label="Email" value={profile.email} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Engine Configuration</p>
          <div className="bg-white rounded-lg border border-slate-200 px-4">
            <ReviewRow icon={Cpu} label="Engine" value={config.engine} />
            <ReviewRow icon={Brain} label="Model" value={config.model} />
            <ReviewRow icon={Brain} label="Temperature" value={String(config.temperature ?? 0)} />
            <ReviewRow icon={Brain} label="Mode" value={config.mode} />
            <div className="flex items-center gap-3 py-2.5">
              <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <span className="text-xs text-slate-500 w-36">AI Evaluation</span>
              <Badge className={config.enableEvaluation ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}>
                {config.enableEvaluation ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Document Preferences</p>
          <div className="bg-white rounded-lg border border-slate-200 px-4">
            <ReviewRow icon={FileText} label="Document Type" value={docTypeLabels[docPrefs.documentType] || docPrefs.documentType} />
            <ReviewRow icon={FileText} label="Raw Text Model" value={docPrefs.rawTextModel} />
            {docPrefs.instructions && (
              <div className="py-2.5">
                <p className="text-xs text-slate-500 mb-1">Special Instructions</p>
                <p className="text-sm text-slate-700">{docPrefs.instructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}