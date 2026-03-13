import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppWindow, Mail, X, Plus, IdCard } from "lucide-react";

export default function StepProfile({ data, onChange }) {
  const [contactEmailInput, setContactEmailInput] = React.useState("");
  const [ccIntakeInput, setCcIntakeInput] = React.useState("");

  const addContactEmail = () => {
    const email = contactEmailInput.trim();
    if (!email) return;
    const current = data.contactEmails || [];
    if (!current.includes(email)) onChange({ ...data, contactEmails: [...current, email] });
    setContactEmailInput("");
  };

  const removeContactEmail = (email) => {
    onChange({ ...data, contactEmails: (data.contactEmails || []).filter((e) => e !== email) });
  };

  const addCcIntake = () => {
    const email = ccIntakeInput.trim();
    if (!email) return;
    const current = data.ccIntake || [];
    if (!current.includes(email)) onChange({ ...data, ccIntake: [...current, email] });
    setCcIntakeInput("");
  };

  const removeCcIntake = (email) => {
    onChange({ ...data, ccIntake: (data.ccIntake || []).filter((e) => e !== email) });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">App Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Set up your application identity and contacts.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <AppWindow className="w-3.5 h-3.5" /> App Name
        </Label>
        <Input
          placeholder="e.g. Alts Extraction App"
          value={data.appName || ""}
          onChange={(e) => onChange({ ...data, appName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <IdCard className="w-3.5 h-3.5" /> Type of ID
          </Label>
          <select
            value={data.sealIdType || ""}
            onChange={(e) => onChange({ ...data, sealIdType: e.target.value })}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Select type...</option>
            <option value="FID">FID</option>
            <option value="SID">SID</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <IdCard className="w-3.5 h-3.5" /> ID Value
          </Label>
          <Input
            placeholder={`Enter ${data.sealIdType || "FID/SID"} value`}
            value={data.idValue || ""}
            onChange={(e) => onChange({ ...data, idValue: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <IdCard className="w-3.5 h-3.5" /> Seal ID
        </Label>
        <Input
          placeholder="Enter Seal ID"
          value={data.sealId || ""}
          onChange={(e) => onChange({ ...data, sealId: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" /> Contact Emails
        </Label>
        <EmailTagInput
          values={data.contactEmails || []}
          onChange={(emails) => onChange({ ...data, contactEmails: emails })}
          placeholder="Type email and press Enter..."
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" /> CC Intake
        </Label>
        <EmailTagInput
          values={data.ccIntake || []}
          onChange={(emails) => onChange({ ...data, ccIntake: emails })}
          placeholder="Type email and press Enter..."
        />
      </div>


    </div>
  );
}