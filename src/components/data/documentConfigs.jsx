export const DOCUMENT_CONFIGS_DATA = [
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
      split: { enabled: false },
      parse: { enabled: false },
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
      extraction: { enabled: false },
      split: {
        enabled: true,
        model: "GPT-4o",
        categories: ["Equity Report", "Fixed Income", "Alternative Investment", "Mixed Asset"],
      },
      parse: { enabled: false },
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
      split: { enabled: false },
      parse: { enabled: false },
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
      extraction: { enabled: false },
      split: { enabled: false },
      parse: {
        enabled: true,
        engine: "Template Based",
        outputFormat: "Markdown",
      },
      redaction: { enabled: false },
    },
  },
];