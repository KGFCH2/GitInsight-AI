import jsPDF from "jspdf";
import type { AnalysisResult } from "./types";

// Premium Color palette (RGB)
const C = {
  brand: [99, 102, 241] as [number, number, number],      // Indigo
  brandDark: [67, 56, 202] as [number, number, number],  // Dark Indigo
  success: [16, 185, 129] as [number, number, number],    // Emerald
  warning: [245, 158, 11] as [number, number, number],    // Amber
  danger: [239, 68, 68] as [number, number, number],      // Red
  accent: [236, 72, 153] as [number, number, number],     // Pink
  ink: [15, 23, 42] as [number, number, number],          // Slate 900
  body: [51, 65, 85] as [number, number, number],         // Slate 700
  muted: [100, 116, 139] as [number, number, number],     // Slate 500
  border: [226, 232, 240] as [number, number, number],    // Slate 200
  soft: [248, 250, 252] as [number, number, number],      // Slate 50
  white: [255, 255, 255] as [number, number, number],
};

const classColor: Record<string, [number, number, number]> = {
  good: C.success,
  improve: C.warning,
  archive: C.muted,
};

export function exportPdf(data: AnalysisResult) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 50;
  let y = margin;

  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const addFooter = () => {
    const fy = H - 30;
    setDraw(C.border);
    doc.setLineWidth(0.5);
    doc.line(margin, fy - 10, W - margin, fy - 10);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    setText(C.muted);
    doc.text(`Generated Analysis for @${data.user.login} | Automated by GitInsight AI`, margin, fy);
    const pageNo = `Page ${doc.getCurrentPageInfo().pageNumber}`;
    doc.text(pageNo, W - margin - doc.getTextWidth(pageNo), fy);
  };

  const roundedRect = (x: number, yy: number, w: number, h: number, r: number, fill: [number, number, number], style: "F" | "S" | "FD" = "F") => {
    if (style.includes("F")) setFill(fill);
    if (style.includes("S")) setDraw(fill);
    doc.roundedRect(x, yy, w, h, r, r, style);
  };

  // ============ PAGE 1: COVER & CORE STATS ============
  const bandH = 140;
  setFill(C.brand);
  doc.rect(0, 0, W, bandH, "F");
  
  // Pattern
  setFill(C.brandDark);
  for(let i=0; i<W; i+=40) { doc.circle(i, 20, 2, "F"); doc.circle(i + 20, 40, 2, "F"); }

  // Title (Algerian Simulation)
  doc.setFont("times", "bolditalic");
  doc.setFontSize(30);
  setText(C.white);
  doc.text("GITINSIGHT AI", margin, 65);
  
  doc.setFont("helvetica", "normal"); // Comic Sans Alternative
  doc.setFontSize(11);
  doc.text("Professional Developer Profile Audit Report", margin, 82);

  const handle = `@${data.user.login}${data.user.name ? ` • ${data.user.name}` : ""}`;
  doc.setFont("courier", "bold"); // Cambria Alternative
  doc.setFontSize(12);
  const pillW = doc.getTextWidth(handle) + 30;
  roundedRect(margin, 100, pillW, 26, 13, [255, 255, 255]);
  setText(C.brand);
  doc.text(handle, margin + 15, 117);

  y = bandH + 30;

  // Score Summary Card
  const cardW = W - margin * 2;
  roundedRect(margin, y, cardW, 100, 12, C.soft);
  setDraw(C.border);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, cardW, 100, 12, 12, "S");

  const cx = margin + 55;
  const cy = y + 50;
  setFill(C.brand);
  doc.circle(cx, cy, 38, "F");
  setFill(C.white);
  doc.circle(cx, cy, 34, "F");
  
  doc.setFont("times", "bold"); // Times New Roman
  doc.setFontSize(26);
  setText(C.ink);
  const scoreStr = String(data.score.total);
  doc.text(scoreStr, cx - doc.getTextWidth(scoreStr)/2, cy + 8);
  
  const gridX = cx + 65;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setText(C.ink);
  doc.text("Profile Performance Metrics", gridX, y + 25);
  
  const stats = [
    { l: "Stars", v: data.score.stats.totalStars, c: C.warning },
    { l: "Forks", v: data.score.stats.totalForks, c: C.brand },
    { l: "Repos", v: data.score.stats.originalRepoCount, c: C.success },
    { l: "Langs", v: data.score.stats.languageCount, c: C.accent }
  ];
  
  const sw = (cardW - 130) / 4;
  stats.forEach((st, i) => {
    const sx = gridX + i * sw;
    doc.setFont("courier", "bold");
    doc.setFontSize(13);
    setText(st.c);
    doc.text(String(st.v), sx, y + 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(C.muted);
    doc.text(st.l, sx, y + 75);
  });

  y += 130;

  // TECHNICAL DIMENSION AUDIT (Bars)
  sectionHeader("TECHNICAL DIMENSION AUDIT", C.brand);
  const metrics = [
    { n: "Popularity", v: data.score.breakdown.popularity, m: 25, c: C.brand },
    { n: "Activity", v: data.score.breakdown.activity, m: 20, c: C.success },
    { n: "Breadth", v: data.score.breakdown.breadth, m: 15, c: C.accent },
    { n: "Quality", v: data.score.breakdown.quality, m: 20, c: C.warning },
    { n: "Community", v: data.score.breakdown.community, m: 10, c: C.brandDark },
    { n: "Tenure", v: data.score.breakdown.tenure, m: 10, c: C.muted }
  ];

  const barWidthMax = cardW - 140;
  metrics.forEach(m => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setText(C.body);
    doc.text(m.n, margin, y + 10);
    
    roundedRect(margin + 100, y + 2, barWidthMax, 10, 5, C.border);
    const fillW = Math.max(4, (m.v / m.m) * barWidthMax);
    roundedRect(margin + 100, y + 2, fillW, 10, 5, m.c);
    
    doc.setFont("courier", "bold");
    setText(C.muted);
    const valStr = `${m.v}/${m.m}`;
    doc.text(valStr, W - margin - doc.getTextWidth(valStr), y + 10);
    y += 20;
  });

  y += 15;

  // BADGES on Page 1
  if (data.badges.length) {
    sectionHeader("ACHIEVEMENTS & BADGES", C.brandDark);
    let bx = margin;
    data.badges.forEach((b) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const tw = doc.getTextWidth(b) + 16;
      if (bx + tw > W - margin) { bx = margin; y += 22; }
      roundedRect(bx, y, tw, 18, 9, C.success);
      setText(C.white);
      doc.text(b, bx + 8, y + 12);
      bx += tw + 6;
    });
    y += 30;
  }

  addFooter();

  // ============ PAGE 2: ANALYSIS & INSIGHTS ============
  doc.addPage();
  y = margin + 20;
  setFill(C.brand);
  doc.rect(0, 0, W, 4, "F");

  // STACK SPECIALIZATION
  if (data.score.stats.langDetails?.length) {
    sectionHeader("STACK SPECIALIZATION", C.accent);
    let lx = margin;
    data.score.stats.langDetails.slice(0, 8).forEach(l => {
      const label = `${l.name} ${l.percentage}%`;
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      const lw = doc.getTextWidth(label) + 20;
      if (lx + lw > W - margin) { lx = margin; y += 22; }
      roundedRect(lx, y, lw, 18, 4, C.soft);
      setFill(C.accent);
      doc.rect(lx + 4, y + 4, 3, 10, "F");
      setText(C.body);
      doc.text(label, lx + 12, y + 12);
      lx += lw + 6;
    });
    y += 35;
  }

  // EXECUTIVE OVERVIEW
  if (data.ai.summary) {
    sectionHeader("EXECUTIVE OVERVIEW", C.brand);
    calloutBox(data.ai.summary, C.brand, "helvetica");
  }

  bulletSection("KEY STRENGTHS", data.ai.strengths, C.success, ">>");
  bulletSection("IMPROVEMENT VECTORS", data.ai.weaknesses, C.danger, "!!");
  bulletSection("GROWTH STRATEGY", data.ai.actionSteps, C.warning, "->");

  if (data.ai.recruiterInsights) {
    sectionHeader("TECHNICAL RECRUITER PERSPECTIVE", C.accent);
    calloutBox(data.ai.recruiterInsights, C.accent, "times");
  }

  addFooter();

  // ============ PAGE 3: REPOSITORIES ============
  doc.addPage();
  y = margin + 20;
  setFill(C.brand);
  doc.rect(0, 0, W, 4, "F");

  sectionHeader("KEY REPOSITORY HIGHLIGHTS", C.brand);
  const repos = data.repos.slice(0, 8);
  repos.forEach(r => {
    const lines = r.description ? doc.splitTextToSize(r.description, cardW - 30) : [];
    const tipLines = r.improvementNote ? doc.splitTextToSize(`💡 Tip: ${r.improvementNote}`, cardW - 40) : [];
    const h = 45 + (lines.length * 12) + (tipLines.length * 11) + (r.improvementNote ? 12 : 0);
    
    if (y + h > H - margin - 40) { addFooter(); doc.addPage(); y = margin + 20; setFill(C.brand); doc.rect(0, 0, W, 4, "F"); }
    
    roundedRect(margin, y, cardW, h, 8, C.soft);
    setFill(classColor[r.classification] || C.muted);
    doc.rect(margin, y, 4, h, "F");
    
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    setText(C.ink);
    doc.text(r.name.toUpperCase(), margin + 15, y + 18);
    
    const tag = r.classification.toUpperCase();
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    const tw = doc.getTextWidth(tag) + 12;
    roundedRect(W - margin - tw - 10, y + 8, tw, 16, 8, classColor[r.classification] || C.muted);
    setText(C.white);
    doc.text(tag, W - margin - tw - 4, y + 19);
    
    setText(C.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`[★ ${r.stars} | ⚡ ${r.forks} | ${r.language || "N/A"}]`, margin + 15, y + 32);
    
    if (lines.length) {
      setText(C.body);
      doc.text(lines.slice(0, 3), margin + 15, y + 46);
    }

    if (r.improvementNote) {
      const tipY = y + 46 + (lines.length > 0 ? (lines.length * 12) : 0);
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(8.5);
      setText(C.warning);
      doc.text(tipLines, margin + 20, tipY);
    }
    y += h + 12;
  });

  addFooter();
  doc.save(`GitInsight_${data.user.login}.pdf`);

  // ============ HELPERS ============
  function sectionHeader(title: string, color: [number, number, number]) {
    setFill(color);
    doc.rect(margin, y, 3, 16, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    setText(C.ink);
    doc.text(title, margin + 12, y + 13);
    y += 26;
  }

  function calloutBox(text: string, color: [number, number, number], font: "helvetica" | "times" | "courier" = "helvetica") {
    doc.setFont(font, font === "times" ? "italic" : "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, cardW - 30);
    const h = lines.length * 14 + 18;
    roundedRect(margin, y, cardW, h, 8, C.soft);
    setDraw(color);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, cardW, h, 8, 8, "S");
    setText(C.body);
    doc.text(lines, margin + 15, y + 16);
    y += h + 18;
  }

  function bulletSection(title: string, items: string[], color: [number, number, number], sym: string) {
    if (!items?.length) return;
    sectionHeader(title, color);
    items.forEach(it => {
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(it, cardW - 35);
      const h = lines.length * 14 + 5;
      setText(color);
      doc.setFont("courier", "bold");
      doc.text(sym, margin + 5, y + 10);
      setText(C.body);
      doc.setFont("helvetica", "normal");
      doc.text(lines, margin + 25, y + 10);
      y += h;
    });
    y += 12;
  }
}
