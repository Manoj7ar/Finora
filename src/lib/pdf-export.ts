import jsPDF from "jspdf";

interface InsightData {
  severity: string;
  headline: string;
  dollarImpact?: string;
  summary: string;
}

interface MetricData {
  name: string;
  value: number | null;
  unit?: string;
  description?: string;
}

interface ActionItemData {
  priority: string;
  action: string;
  rationale: string;
  dollarImpact: string;
}

interface ActionPlanData {
  title: string;
  summary: string;
  actions: ActionItemData[];
  outlook: string;
}

const MARGIN = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(22, 101, 52); // primary green
  doc.rect(0, 0, PAGE_WIDTH, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Finora", MARGIN, 16);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(title, MARGIN, 26);
  doc.setFontSize(8);
  doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), PAGE_WIDTH - MARGIN, 26, { align: "right" });
  doc.setTextColor(0, 0, 0);
  return 46;
}

function checkPage(doc: jsPDF, y: number, needed: number = 30): number {
  if (y + needed > 280) {
    doc.addPage();
    return 20;
  }
  return y;
}

function wrapText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function exportDashboardPDF(metrics: MetricData[], insights: InsightData[]) {
  const doc = new jsPDF();
  let y = addHeader(doc, "Economic Dashboard Report");

  // Metrics section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("Economic Indicators", MARGIN, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);

  metrics.forEach((m) => {
    y = checkPage(doc, y, 14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    const valueStr = m.value != null ? (m.unit === "%" ? `${m.value.toFixed(2)}%` : m.value.toFixed(1)) : "N/A";
    doc.text(`${m.name}: ${valueStr}`, MARGIN, y);
    y += 5;
    if (m.description) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      y = wrapText(doc, m.description, MARGIN, y, CONTENT_WIDTH, 4);
      y += 2;
    }
  });

  // Insights section
  if (insights.length > 0) {
    y += 6;
    y = checkPage(doc, y, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text("AI Insights", MARGIN, y);
    y += 8;

    insights.forEach((ins, i) => {
      y = checkPage(doc, y, 24);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      const label = `[${ins.severity.toUpperCase()}] ${ins.headline}`;
      y = wrapText(doc, label, MARGIN, y, CONTENT_WIDTH, 5);
      if (ins.dollarImpact) {
        doc.setTextColor(22, 101, 52);
        doc.text(ins.dollarImpact, MARGIN, y + 1);
        y += 6;
      }
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      y = wrapText(doc, ins.summary, MARGIN, y, CONTENT_WIDTH, 4);
      y += 6;
    });
  }

  doc.save("finora-dashboard-report.pdf");
}

export function exportActionPlanPDF(plan: ActionPlanData) {
  const doc = new jsPDF();
  let y = addHeader(doc, "AI Action Plan");

  // Title & summary
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  y = wrapText(doc, plan.title, MARGIN, y, CONTENT_WIDTH, 7);
  y += 4;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  y = wrapText(doc, plan.summary, MARGIN, y, CONTENT_WIDTH, 5);
  y += 10;

  // Actions
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("Action Items", MARGIN, y);
  y += 8;

  plan.actions.forEach((item, i) => {
    y = checkPage(doc, y, 28);

    // Priority badge
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const badgeColor = item.priority === "high" ? [220, 38, 38] : item.priority === "medium" ? [217, 119, 6] : [22, 101, 52];
    doc.setTextColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.text(`[${item.priority.toUpperCase()}]`, MARGIN, y);

    if (item.dollarImpact) {
      doc.setTextColor(22, 101, 52);
      doc.text(item.dollarImpact, MARGIN + 30, y);
    }
    y += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    y = wrapText(doc, item.action, MARGIN, y, CONTENT_WIDTH, 5);
    y += 2;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    y = wrapText(doc, item.rationale, MARGIN, y, CONTENT_WIDTH, 4);
    y += 8;
  });

  // Outlook
  if (plan.outlook) {
    y = checkPage(doc, y, 24);
    y += 4;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text("Next Month Outlook", MARGIN, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    wrapText(doc, plan.outlook, MARGIN, y, CONTENT_WIDTH, 5);
  }

  doc.save("finora-action-plan.pdf");
}
