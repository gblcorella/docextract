import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StepProfile from "@/components/onboarding/StepProfile";
import StepUseCases from "@/components/onboarding/StepUseCases";
import StepDocumentPrefs from "@/components/onboarding/StepDocumentPrefs";
import StepReview from "@/components/onboarding/StepReview";

const steps = [
  { id: 0, label: "Profile" },
  { id: 1, label: "Use Cases" },
  { id: 2, label: "Document Prefs" },
  { id: 3, label: "Review" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({});
  const [useCasesData, setUseCasesData] = useState({ useCases: [] });
  const [docPrefs, setDocPrefs] = useState({ documentType: "alts-schedule", rawTextModel: "textract" });

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleFinish = () => {
    alert("Onboarding complete!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar - Steps */}
      <div className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-6 py-6 border-b border-slate-100">
          <h1 className="text-base font-bold text-slate-800">Welcome aboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Complete your setup</p>
        </div>
        <nav className="flex-1 py-4 px-3">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-start gap-3 mb-1">
              <div className="flex flex-col items-center mt-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all",
                  currentStep > idx ? "bg-indigo-600 text-white" :
                  currentStep === idx ? "border-2 border-indigo-600 text-indigo-600 bg-white" :
                  "border-2 border-slate-200 text-slate-400 bg-white"
                )}>
                  {currentStep > idx ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn("w-px h-8 mt-1", currentStep > idx ? "bg-indigo-300" : "bg-slate-200")} />
                )}
              </div>
              <div className="pt-0.5">
                <p className={cn("text-sm font-medium leading-none", currentStep === idx ? "text-indigo-600" : currentStep > idx ? "text-slate-600" : "text-slate-400")}>
                  {step.label}
                </p>
                {step.sub && <p className="text-xs text-slate-400 mt-0.5">{step.sub}</p>}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl"
            >
              {currentStep === 0 && <StepProfile data={profile} onChange={setProfile} />}
              {currentStep === 1 && <StepUseCases data={useCasesData} onChange={setUseCasesData} />}
              {currentStep === 2 && <StepDocumentPrefs data={docPrefs} onChange={setDocPrefs} />}
              {currentStep === 3 && <StepReview profile={profile} useCasesData={useCasesData} docPrefs={docPrefs} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white px-8 py-4 flex items-center justify-between">
          <Button variant="outline" onClick={goPrev} disabled={currentStep === 0} className="text-slate-600">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <span className="text-xs text-slate-400">Step {currentStep + 1} of {steps.length}</span>
          {currentStep < steps.length - 1 ? (
            <Button onClick={goNext} className="bg-indigo-600 hover:bg-indigo-700">
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-1" />
              Finish Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}