// ─── Mock Data ────────────────────────────────────────────────────────────────
// All mock/seed data lives here in one place.
// When you connect a real backend, this file becomes irrelevant — just flip
// USE_MOCK to false in api.ts and this file is never touched.

export type RiskLevel = 'Safe' | 'Risky' | 'Non-compliant';

export interface Clause {
  id: string;
  title: string;
  originalText: string;
  riskLevel: RiskLevel;
  issues: string[];
  suggestions: string[];
  relevantLaw: string;
}

export interface Report {
  id: string;
  name: string;
  date: string;
  overallRisk: 'High' | 'Medium' | 'Low';
  parties: string;
  type: string;
  status: 'Completed' | 'Analyzing' | 'Failed';
  clauses: Clause[];
}

// ─── Seed Reports ─────────────────────────────────────────────────────────────

export const mockReports: Report[] = [
  {
    id: 'rep_12345',
    name: 'TechCorp_Vendor_Agreement.pdf',
    date: '2026-04-14',
    overallRisk: 'High',
    parties: 'TechCorp India & CloudServices LLC',
    type: 'Vendor Agreement',
    status: 'Completed',
    clauses: [
      {
        id: 'cl_1',
        title: 'Data Sharing & Privacy',
        originalText: 'The Vendor may collect, store, and process customer data as needed to perform the services. The Vendor may share this data with third-party affiliates without prior consent.',
        riskLevel: 'Non-compliant',
        issues: [
          'Explicit consent not mandated for third-party sharing.',
          'No mention of Data Fiduciary responsibilities.',
        ],
        suggestions: [
          'Add a clause requiring clear, affirmative consent before sharing data with any third party.',
          'Define roles clearly as Data Fiduciary and Data Processor according to the DPDP Act 2023.',
        ],
        relevantLaw: 'Digital Personal Data Protection (DPDP) Act 2023',
      },
      {
        id: 'cl_2',
        title: 'Payment Terms & Taxation',
        originalText: 'Invoices shall be paid within 30 days. The Vendor is responsible for all applicable taxes. No specific tax registration numbers are required on the invoice.',
        riskLevel: 'Risky',
        issues: [
          'GSTIN is mandatory on invoices for B2B transactions to claim Input Tax Credit (ITC).',
          'Vague language around "applicable taxes".',
        ],
        suggestions: [
          "Mandate the inclusion of the Vendor's and Purchaser's GSTIN on all invoices.",
          "Specify that payments are exclusive of GST, which shall be charged additionally at applicable rates.",
        ],
        relevantLaw: 'Central Goods and Services Tax (CGST) Act, 2017',
      },
      {
        id: 'cl_3',
        title: 'Termination for Convenience',
        originalText: 'Either party may terminate this agreement at any time by providing 60 days written notice to the other party.',
        riskLevel: 'Safe',
        issues: [],
        suggestions: [],
        relevantLaw: 'Indian Contract Act, 1872',
      },
      {
        id: 'cl_4',
        title: 'Dispute Resolution & Jurisdiction',
        originalText: 'Any disputes arising out of this agreement shall be subject to the exclusive jurisdiction of the courts in Delaware, USA.',
        riskLevel: 'Risky',
        issues: [
          'Foreign jurisdiction for an agreement executed and performed in India can lead to complex and costly enforcement.',
        ],
        suggestions: [
          'Change jurisdiction to a mutually agreed Indian city (e.g., New Delhi, Mumbai).',
          'Add an arbitration clause referring to the Arbitration and Conciliation Act, 1996.',
        ],
        relevantLaw: 'Code of Civil Procedure, 1908 / Arbitration Act, 1996',
      },
      {
        id: 'cl_5',
        title: 'Non-Compete',
        originalText: 'The Vendor agrees not to provide similar services to any competitor of TechCorp globally for a period of 5 years following termination.',
        riskLevel: 'Non-compliant',
        issues: [
          'Post-termination non-compete clauses are generally void under Indian law.',
          'The 5-year global restriction is unreasonable and unenforceable.',
        ],
        suggestions: [
          'Remove post-termination non-compete restrictions.',
          'Replace with strong non-solicitation (of employees/clients) and strict confidentiality clauses.',
        ],
        relevantLaw: 'Section 27 of the Indian Contract Act, 1872',
      }
    ],
  },
  {
    id: 'rep_12344',
    name: 'Q1_Employment_Contract_Template.docx',
    date: '2026-04-12',
    overallRisk: 'Low',
    parties: 'TechCorp India & New Hires',
    type: 'Employment Contract',
    status: 'Completed',
    clauses: [
      {
        id: 'cl_10',
        title: 'Working Hours',
        originalText: 'Standard working hours are 45 hours per week, Monday through Friday. Any additional hours will be compensated according to company policy.',
        riskLevel: 'Safe',
        issues: [],
        suggestions: [],
        relevantLaw: 'Factories Act, 1948 / State Shops and Establishments Act',
      }
    ],
  },
];

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(r => r.id === id);
}

// ─── Mock User ────────────────────────────────────────────────────────────────

export const MOCK_USER = {
  id: 'user_001',
  name: 'Arjun Sharma',
  email: 'arjun@techcorp.in',
  plan: 'free' as const,
  uploadsUsed: 2,
  uploadsLimit: 3,
};