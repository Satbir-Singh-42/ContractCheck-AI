import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Content, StyleDictionary, TDocumentDefinitions, TVirtualFileSystem } from 'pdfmake/interfaces';

export type PdfRiskLevel = 'Safe' | 'Risky' | 'Non-compliant';

export interface PdfClause {
  id: string;
  title: string;
  originalText: string;
  riskLevel: PdfRiskLevel;
  issues: string[];
  suggestions: string[];
  relevantLaw: string;
}

export interface PdfReportData {
  id: string;
  name: string;
  type: string;
  parties: string;
  overallRisk: 'High' | 'Medium' | 'Low';
  date: string;
  status: string;
  clauses: PdfClause[];
}

interface VfsBundle {
  vfs?: TVirtualFileSystem;
  pdfMake?: {
    vfs?: TVirtualFileSystem;
  };
}

const margin4 = (
  left: number,
  top: number,
  right: number,
  bottom: number,
): [number, number, number, number] => [left, top, right, bottom];

let pdfMakeReady = false;

function extractVfs(source: TVirtualFileSystem | VfsBundle): TVirtualFileSystem | undefined {
  const maybeBundle = source as VfsBundle;

  if (maybeBundle.pdfMake && typeof maybeBundle.pdfMake === 'object' && maybeBundle.pdfMake.vfs) {
    return maybeBundle.pdfMake.vfs;
  }

  if (maybeBundle.vfs && typeof maybeBundle.vfs === 'object') {
    return maybeBundle.vfs;
  }

  return source as TVirtualFileSystem;
}

export function ensurePdfMakeReady() {
  if (pdfMakeReady) return;

  const vfs = extractVfs(pdfFonts as TVirtualFileSystem | VfsBundle);
  if (!vfs || Object.keys(vfs).length === 0) {
    throw new Error('Unable to initialize PDF font virtual file system.');
  }

  pdfMake.addVirtualFileSystem(vfs);
  pdfMakeReady = true;
}

function getRiskTheme(risk: PdfRiskLevel): { accent: string; light: string; label: string } {
  if (risk === 'Safe') return { accent: '#10B981', light: '#ECFDF5', label: 'SAFE' };
  if (risk === 'Risky') return { accent: '#F59E0B', light: '#FFFBEB', label: 'RISKY' };
  return { accent: '#EF4444', light: '#FEF2F2', label: 'NON-COMPLIANT' };
}

function getOverallTheme(overallRisk: PdfReportData['overallRisk']): { color: string; label: string } {
  if (overallRisk === 'High') return { color: '#EF4444', label: 'High Risk' };
  if (overallRisk === 'Medium') return { color: '#F59E0B', label: 'Medium Risk' };
  return { color: '#10B981', label: 'Low Risk' };
}

function buildStatCard(label: string, value: string, color: string): Content {
  return {
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          { text: label.toUpperCase(), style: 'statLabel' },
          { text: value, style: 'statValue', color },
        ],
        fillColor: '#F8FAFC',
        border: [true, true, true, true],
        borderColor: ['#E2E8F0', '#E2E8F0', '#E2E8F0', '#E2E8F0'],
        margin: margin4(10, 8, 10, 8),
      }]],
    },
    layout: 'noBorders',
  };
}

function buildClauseCard(clause: PdfClause, index: number): Content {
  const theme = getRiskTheme(clause.riskLevel);

  const issueSection: Content[] = clause.issues.length > 0
    ? [
        { text: `ISSUES (${clause.issues.length})`, style: 'issueLabel', margin: margin4(12, 2, 12, 2) },
        ...clause.issues.map((issue): Content => ({
          columns: [
            { text: '•', width: 10, color: '#EF4444' },
            { text: issue, width: '*', style: 'bodyText' },
          ],
          margin: margin4(12, 0, 12, 2),
        })),
      ]
    : [];

  const suggestionSection: Content[] = clause.suggestions.length > 0
    ? [
        { text: 'AI FIX SUGGESTIONS', style: 'suggestionLabel', margin: margin4(12, 6, 12, 3) },
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: clause.suggestions.map((suggestion): Content => ({
                columns: [
                  { text: '•', width: 10, color: '#2563EB' },
                  { text: suggestion, width: '*', style: 'bodyText' },
                ],
                margin: margin4(0, 1, 0, 3),
              })),
              fillColor: '#EFF6FF',
              border: [false, false, false, false],
              margin: margin4(8, 6, 8, 4),
            }]],
          },
          layout: 'noBorders',
          margin: margin4(12, 0, 12, 2),
        },
      ]
    : [];

  return {
    table: {
      widths: ['*'],
      body: [[{
        border: [true, true, true, true],
        borderColor: ['#D9E1EC', '#D9E1EC', '#D9E1EC', '#D9E1EC'],
        fillColor: '#FFFFFF',
        margin: margin4(0, 0, 0, 0),
        stack: [
          {
            table: {
              widths: [6, '*', 'auto'],
              body: [[
                { text: '', fillColor: theme.accent, border: [false, false, false, false] },
                {
                  text: `${index + 1}. ${clause.title}`,
                  style: 'clauseTitle',
                  fillColor: theme.light,
                  border: [false, false, false, false],
                  margin: margin4(10, 10, 10, 10),
                },
                {
                  text: theme.label,
                  style: 'clauseBadge',
                  color: '#FFFFFF',
                  fillColor: theme.accent,
                  border: [false, false, false, false],
                  alignment: 'center',
                  margin: margin4(12, 6, 12, 6),
                },
              ]],
            },
            layout: 'noBorders',
          },
          { text: 'ORIGINAL CLAUSE', style: 'microLabel', margin: margin4(12, 10, 12, 4) },
          { text: `"${clause.originalText}"`, style: 'quoteText', margin: margin4(12, 0, 12, 8) },
          ...issueSection,
          ...suggestionSection,
          {
            text: [
              { text: 'REFERENCE LAW: ', bold: true },
              { text: clause.relevantLaw },
            ],
            style: 'referenceLine',
            margin: margin4(12, 6, 12, 10),
          },
        ],
      }]],
    },
    layout: 'noBorders',
    margin: margin4(0, 0, 0, 10),
  };
}

export function downloadCompliancePdf(report: PdfReportData): void {
  ensurePdfMakeReady();

  const safe = report.clauses.filter((clause) => clause.riskLevel === 'Safe').length;
  const risky = report.clauses.filter((clause) => clause.riskLevel === 'Risky').length;
  const bad = report.clauses.filter((clause) => clause.riskLevel === 'Non-compliant').length;
  const score = Math.max(0, Math.round(100 - (bad * 25) - (risky * 10)));

  const generatedOn = new Date();
  const generatedOnText = generatedOn.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const analyzedOn = report.date
    ? new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  const overall = getOverallTheme(report.overallRisk);
  const uniqueLaws = [...new Set(report.clauses.map((clause) => clause.relevantLaw))];

  const styles: StyleDictionary = {
    headerBrand: { fontSize: 13, bold: true, color: '#0F172A' },
    headerSub: { fontSize: 8, bold: true, color: '#64748B' },
    headerMeta: { fontSize: 8, color: '#64748B' },
    footerText: { fontSize: 8, color: '#64748B' },

    reportTitle: { fontSize: 18, bold: true, color: '#0F172A' },
    reportSubTitle: { fontSize: 10, color: '#334155' },
    reportMeta: { fontSize: 9, color: '#64748B' },

    statLabel: { fontSize: 7.5, bold: true, color: '#64748B' },
    statValue: { fontSize: 16, bold: true },

    sectionTitle: { fontSize: 13, bold: true, color: '#0F172A' },
    clauseTitle: { fontSize: 11.5, bold: true, color: '#0F172A' },
    clauseBadge: { fontSize: 8, bold: true },
    microLabel: { fontSize: 8.5, bold: true, color: '#64748B' },
    quoteText: { fontSize: 11, italics: true, color: '#334155' },
    issueLabel: { fontSize: 9, bold: true, color: '#DC2626' },
    suggestionLabel: { fontSize: 9, bold: true, color: '#2563EB' },
    bodyText: { fontSize: 10, color: '#334155' },
    referenceLine: { fontSize: 9, color: '#475569' },
    lawItem: { fontSize: 10, color: '#334155' },

    disclaimer: {
      fontSize: 9,
      italics: true,
      color: '#7F1D1D',
      background: '#FEF2F2',
    },
  };

  const content: Content[] = [
    { text: report.name, style: 'reportTitle' },
    { text: `${report.type} · ${report.parties}`, style: 'reportSubTitle', margin: margin4(0, 2, 0, 0) },
    { text: `Analyzed on ${analyzedOn} · Overall Risk: ${overall.label}`, style: 'reportMeta', margin: margin4(0, 2, 0, 12) },

    {
      columns: [
        buildStatCard('Compliance Score', `${score}/100`, overall.color),
        buildStatCard('Safe Clauses', String(safe), '#10B981'),
        buildStatCard('Risky Clauses', String(risky), '#F59E0B'),
        buildStatCard('Non-compliant', String(bad), '#EF4444'),
      ],
      columnGap: 8,
      margin: margin4(0, 0, 0, 14),
    },

    { text: 'Clause Analysis', style: 'sectionTitle', margin: margin4(0, 0, 0, 8) },
    ...report.clauses.map((clause, index) => buildClauseCard(clause, index)),

    { text: 'Regulations Reference Index', style: 'sectionTitle', margin: margin4(0, 8, 0, 6) },
    { ul: uniqueLaws.map((law) => ({ text: law, style: 'lawItem' })), margin: margin4(0, 0, 0, 8) },

    {
      text: 'Disclaimer: This report is AI-generated and intended for preliminary informational use only. Consult a qualified legal professional before making legal decisions.',
      style: 'disclaimer',
      margin: margin4(0, 8, 0, 0),
    },
  ];

  const docDefinition: TDocumentDefinitions = {
    info: {
      title: `${report.name} - Compliance Report`,
      author: 'ContractCheck AI',
      subject: 'Contract compliance analysis',
      creator: 'ContractCheck AI',
      producer: 'pdfmake',
    },
    pageSize: 'A4',
    pageMargins: margin4(32, 72, 32, 48),
    header: (currentPage: number, pageCount: number): Content => ({
      margin: margin4(32, 18, 32, 0),
      columns: [
        {
          text: [
            { text: 'ContractCheck AI\n', style: 'headerBrand' },
            { text: 'COMPLIANCE INTELLIGENCE REPORT', style: 'headerSub' },
          ],
        },
        {
          text: [
            { text: `Generated: ${generatedOnText}\n`, style: 'headerMeta' },
            { text: `Page ${currentPage}/${pageCount}`, style: 'headerMeta' },
          ],
          alignment: 'right',
        },
      ],
    }),
    footer: (currentPage: number, pageCount: number): Content => ({
      margin: margin4(32, 0, 32, 14),
      columns: [
        { text: `Report ID: ${report.id}`, style: 'footerText' },
        { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', style: 'footerText' },
      ],
    }),
    content,
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      color: '#334155',
    },
    styles,
  };

  const fileStem = report.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_') || 'Report';

  pdfMake.createPdf(docDefinition).download(`ContractCheck_${fileStem}_Report.pdf`);
}
