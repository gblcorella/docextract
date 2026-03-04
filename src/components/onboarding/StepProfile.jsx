import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Building2, Briefcase } from "lucide-react";

export default function StepProfile({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Your Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Tell us a bit about yourself to personalize your experience.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> First Name
          </Label>
          <Input
            placeholder="John"
            value={data.firstName || ""}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600">Last Name</Label>
          <Input
            placeholder="Doe"
            value={data.lastName || ""}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" /> Company Name
        </Label>
        <Input
          placeholder="Acme Capital"
          value={data.company || ""}
          onChange={(e) => onChange({ ...data, company: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" /> Role
        </Label>
        <Select value={data.role || ""} onValueChange={(v) => onChange({ ...data, role: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analyst">Analyst</SelectItem>
            <SelectItem value="portfolio-manager">Portfolio Manager</SelectItem>
            <SelectItem value="compliance">Compliance Officer</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="executive">Executive</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600">Email Address</Label>
        <Input
          type="email"
          placeholder="john@acmecapital.com"
          value={data.email || ""}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
        />
      </div>
    </div>
  );
}