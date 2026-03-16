import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Clock, RefreshCw, Save, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const SERVICES = [
  { id: "api-gateway", name: "API Gateway", group: "Core", description: "Handles all inbound API requests and routing." },
  { id: "extraction-engine", name: "Extraction Engine", group: "Core", description: "AI-powered field extraction from documents." },
  { id: "kafka-ingestion", name: "Kafka Ingestion", group: "Ingestion", description: "Event-driven document ingestion via Kafka topics." },
  { id: "email-ingestion", name: "Email Ingestion", group: "Ingestion", description: "Document ingestion via monitored email inboxes." },
  { id: "s3-connector", name: "S3 Connector", group: "Ingestion", description: "File ingestion from AWS S3 storage buckets." },
  { id: "split-service", name: "Document Split Service", group: "Processing", description: "Splits multi-document PDFs into individual files." },
  { id: "parse-service", name: "Parse Service", group: "Processing", description: "Converts documents to structured text or Markdown." },
  { id: "redaction-service", name: "Redaction Service", group: "Processing", description: "PII and sensitive data redaction from documents." },
  { id: "webhook-delivery", name: "Webhook Delivery", group: "Delivery", description: "Delivers extraction results to registered webhook endpoints." },
  { id: "notifications", name: "Notification Service", group: "Delivery", description: "Email and Slack notifications for job completion." },
  { id: "auth", name: "Authentication Service", group: "Platform", description: "Token validation and user authentication." },
  { id: "dashboard-ui", name: "Dashboard UI", group: "Platform", description: "Web interface for configuration and monitoring." },
];

const STATUS_CONFIG = {
  operational: { label: "Operational", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-400" },
  degraded: { label: "Degraded", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
  down: { label: "Down", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" },
  maintenance: { label: "Maintenance", icon: Clock, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
};

const initialStatuses = Object.fromEntries(SERVICES.map((s) => [s.id, "operational"]));

const GROUPS = ["Core", "Ingestion", "Processing", "Delivery", "Platform"];

export default function ServiceStatus() {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [lastRefresh] = useState(new Date());
  const [downtimeMessage, setDowntimeMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(false);
  const [draft, setDraft] = useState("");

  const setStatus = (id, status) => setStatuses((prev) => ({ ...prev, [id]: status }));

  const overallStatus = (() => {
    const vals = Object.values(statuses);
    if (vals.some((s) => s === "down")) return "down";
    if (vals.some((s) => s === "degraded")) return "degraded";
    if (vals.some((s) => s === "maintenance")) return "maintenance";
    return "operational";
  })();

  const overall = STATUS_CONFIG[overallStatus];
  const OverallIcon = overall.icon;

  const handleSaveMessage = () => {
    setSavedMessage(draft);
    setDowntimeMessage(draft);
    setEditingMessage(false);
  };

  const handleClearMessage = () => {
    setSavedMessage("");
    setDowntimeMessage("");
    setDraft("");
  };

  const operationalCount = Object.values(statuses).filter((s) => s === "operational").length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/Support" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />Back to Support
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <RefreshCw className="w-3.5 h-3.5" />
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>

        {/* Overall Status Banner */}
        <div className={cn("rounded-2xl border p-5 mb-6 flex items-center gap-4", overall.bg, overall.border)}>
          <OverallIcon className={cn("w-8 h-8 flex-shrink-0", overall.color)} />
          <div className="flex-1">
            <p className={cn("text-lg font-bold", overall.color)}>
              {overallStatus === "operational" ? "All Systems Operational" :
               overallStatus === "degraded" ? "Some Systems Degraded" :
               overallStatus === "down" ? "Service Disruption Detected" :
               "Scheduled Maintenance"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{operationalCount} of {SERVICES.length} services fully operational</p>
          </div>
          <Badge className={cn("text-xs font-semibold capitalize", overall.color, overall.bg, overall.border, "border")}>
            {overall.label}
          </Badge>
        </div>

        {/* Downtime Message Banner (preview) */}
        {savedMessage && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Homepage Downtime Banner (Active)</p>
              <p className="text-sm text-amber-800">{savedMessage}</p>
            </div>
            <button onClick={handleClearMessage} className="text-amber-400 hover:text-amber-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Downtime Message Editor */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Homepage Downtime Message</h2>
              <p className="text-xs text-slate-500 mt-0.5">Set a banner message displayed on the homepage when services are down.</p>
            </div>
            {!editingMessage && (
              <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => { setDraft(savedMessage); setEditingMessage(true); }}>
                {savedMessage ? "Edit Message" : "Set Message"}
              </Button>
            )}
          </div>
          {editingMessage ? (
            <div className="space-y-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. We are currently experiencing issues with the Extraction Engine. Our team is working on a fix. ETA: 2 hours."
                rows={3}
                className="w-full resize-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50 text-slate-700 placeholder-slate-400"
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => setEditingMessage(false)}>
                  <X className="w-3.5 h-3.5 mr-1" />Cancel
                </Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs h-8" onClick={handleSaveMessage} disabled={!draft.trim()}>
                  <Save className="w-3.5 h-3.5 mr-1" />Save Message
                </Button>
              </div>
            </div>
          ) : (
            <div className={cn("rounded-lg px-3 py-2.5 text-sm", savedMessage ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-slate-50 text-slate-400 italic border border-dashed border-slate-200")}>
              {savedMessage || "No downtime message set. Homepage will display normally."}
            </div>
          )}
        </div>

        {/* Services by Group */}
        {GROUPS.map((group) => {
          const groupServices = SERVICES.filter((s) => s.group === group);
          return (
            <div key={group} className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{group}</p>
                <span className="text-xs text-slate-400">{groupServices.length} services</span>
              </div>
              <div className="divide-y divide-slate-50">
                {groupServices.map((service) => {
                  const s = STATUS_CONFIG[statuses[service.id]];
                  const Icon = s.icon;
                  return (
                    <div key={service.id} className="px-5 py-3.5 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{service.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{service.description}</p>
                      </div>
                      <select
                        value={statuses[service.id]}
                        onChange={(e) => setStatus(service.id, e.target.value)}
                        className={cn(
                          "h-8 rounded-lg border px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer",
                          s.bg, s.border, s.color
                        )}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <option key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1.5 w-28">
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", s.dot)} />
                        <span className={cn("text-xs font-medium", s.color)}>{s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}