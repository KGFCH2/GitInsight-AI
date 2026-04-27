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

  // ============ PAGE 1: FULL SUMMARY ============
  const bandH = 130;
  setFill(C.brand);
  doc.rect(0, 0, W, bandH, "F");
  
  // Pattern
  setFill(C.brandDark);
  for(let i=0; i<W; i+=40) { doc.circle(i, 20, 2, "F"); doc.circle(i + 20, 40, 2, "F"); }

  // Title (Algerian Simulation)
  doc.setFont("times", "bolditalic");
  doc.setFontSize(30);
  setText(C.white);
  doc.text("GITINSIGHT AI", margin, 55);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text("Professional Developer Profile Audit Report", margin, 72);

  const handle = `@${data.user.login}${data.user.name ? ` • ${data.user.name}` : ""}`;
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  const pillW = doc.getTextWidth(handle) + 26;
  roundedRect(margin, 88, pillW, 24, 12, [255, 255, 255]);
  setText(C.brand);
  doc.text(handle, margin + 13, 104);

  y = bandH + 30;

  // Score Summary
  const cardW = W - margin * 2;
  roundedRect(margin, y, cardW, 80, 10, C.soft);
  setDraw(C.border);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, cardW, 80, 10, 10, "S");

  const cx = margin + 50;
  const cy = y + 40;
  setFill(C.brand);
  doc.circle(cx, cy, 32, "F");
  setFill(C.white);
  doc.circle(cx, cy, 29, "F");
  
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  setText(C.ink);
  const scoreStr = String(data.score.total);
  doc.text(scoreStr, cx - doc.getTextWidth(scoreStr)/2, cy + 8);
  
  const gridX = cx + 60;
  const stats = [
    { l: "Stars", v: data.score.stats.totalStars, c: C.warning, i: "★" },
    { l: "Forks", v: data.score.stats.totalForks, c: C.brand, i: "Y" },
    { l: "Repos", v: data.score.stats.originalRepoCount, c: C.success, i: "#" },
    { l: "Langs", v: data.score.stats.languageCount, c: C.accent, i: "+" }
  ];
  const sw = (cardW - 120) / 4;
  stats.forEach((st, i) => {
    const sx = gridX + i * sw;
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    setText(st.c);
    doc.text(`${st.i} ${st.v}`, sx, y + 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setText(C.muted);
    doc.text(st.l, sx + 2, y + 57);
  });

  y += 105;

  // Technical Audit
  sectionHeader("📊 TECHNICAL DIMENSION AUDIT", C.brand);
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
    doc.setFontSize(9);
    setText(C.body);
    doc.text(m.n, margin, y + 9);
    roundedRect(margin + 100, y + 2, barWidthMax, 8, 4, C.border);
    const fillW = Math.max(4, (m.v / m.m) * barWidthMax);
    roundedRect(margin + 100, y + 2, fillW, 8, 4, m.c);
    doc.setFont("courier", "bold");
    setText(C.muted);
    const valStr = `${m.v}/${m.m}`;
    doc.text(valStr, W - margin - doc.getTextWidth(valStr), y + 9);
    y += 18;
  });

  y += 15;

  // Stack Specialization
  if (data.score.stats.langDetails?.length) {
    sectionHeader("🛠️ STACK SPECIALIZATION", C.accent);
    let lx = margin;
    data.score.stats.langDetails.slice(0, 10).forEach(l => {
      const label = `${l.name} ${l.percentage}%`;
      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);
      const lw = doc.getTextWidth(label) + 18;
      if (lx + lw > W - margin) { lx = margin; y += 22; }
      roundedRect(lx, y, lw, 16, 4, C.soft);
      setFill(C.accent);
      doc.rect(lx + 3, y + 3, 2, 10, "F");
      setText(C.body);
      doc.text(label, lx + 9, y + 11);
      lx += lw + 6;
    });
    y += 30;
  }

  // Executive Overview
  if (data.ai.summary) {
    sectionHeader("📖 EXECUTIVE OVERVIEW", C.brand);
    calloutBox(data.ai.summary, C.brand, "helvetica", 120);
  }

  // Achievements
  if (data.badges.length && y < H - 100) {
    sectionHeader("🏆 ACHIEVEMENTS", C.brandDark);
    let bx = margin;
    data.badges.slice(0, 12).forEach((b) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const tw = doc.getTextWidth(b) + 14;
      if (bx + tw > W - margin) { bx = margin; y += 22; }
      roundedRect(bx, y, tw, 16, 8, C.success);
      setText(C.white);
      doc.text(b, bx + 7, y + 10.5);
      bx += tw + 6;
    });
  }

  addFooter();

  // ============ PAGE 2: STRATEGIC INSIGHTS ============
  doc.addPage();
  y = margin + 20;
  setFill(C.brand);
  doc.rect(0, 0, W, 4, "F");

  bulletSection("✅ KEY STRENGTHS", data.ai.strengths, C.success, ">>");
  y += 20; // Increased gap
  bulletSection("⚠️ IMPROVEMENT VECTORS", data.ai.weaknesses, C.danger, "!!");
  y += 20; // Increased gap
  bulletSection("🚀 GROWTH STRATEGY", data.ai.actionSteps, C.warning, "->");
  y += 30; // Increased gap

  if (data.ai.recruiterInsights) {
    sectionHeader("💼 TECHNICAL RECRUITER'S PERSPECTIVE", C.accent);
    calloutBox(data.ai.recruiterInsights, C.accent, "times", 200);
  }

  addFooter();

  // ============ PAGE 3: REPOSITORY HIGHLIGHTS ============
  doc.addPage();
  y = margin + 20;
  setFill(C.brand);
  doc.rect(0, 0, W, 4, "F");

  sectionHeader("✨ KEY REPOSITORY HIGHLIGHTS", C.brand);
  const repos = data.repos.slice(0, 8);
  repos.forEach((r, i) => {
    const lines = r.description ? doc.splitTextToSize(r.description, cardW - 30) : [];
    const tipLines = r.improvementNote ? doc.splitTextToSize(`💡 Improvement Tip: ${r.improvementNote}`, cardW - 40) : [];
    const h = 55 + (lines.length * 13) + (tipLines.length * 12) + (r.improvementNote ? 16 : 0);
    
    if (y + h > H - margin - 40) { addFooter(); doc.addPage(); y = margin + 20; setFill(C.brand); doc.rect(0, 0, W, 4, "F"); }
    
    roundedRect(margin, y, cardW, h, 8, C.soft);
    setFill(classColor[r.classification] || C.muted);
    doc.rect(margin, y, 4, h, "F");
    
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    setText(C.ink);
    const nameLines = doc.splitTextToSize(r.name.toUpperCase(), cardW - 90);
    doc.text(nameLines, margin + 15, y + 18);
    
    const tag = r.classification.toUpperCase();
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    const tw = doc.getTextWidth(tag) + 12;
    roundedRect(W - margin - tw - 10, y + 8, tw, 16, 8, classColor[r.classification] || C.muted);
    setText(C.white);
    doc.text(tag, W - margin - tw - 4, y + 19);
    
    setText(C.muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    const metaY = y + 34 + (nameLines.length > 1 ? (nameLines.length - 1) * 12 : 0);
    const meta = `STARS: ${r.stars}  |  FORKS: ${r.forks}  |  LANGUAGE: ${r.language || "N/A"}`;
    doc.text(meta, margin + 15, metaY);
    
    if (lines.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      setText(C.body);
      doc.text(lines.slice(0, 3), margin + 15, metaY + 16);
    }

    if (r.improvementNote) {
      const tipY = metaY + 16 + (lines.length > 0 ? (lines.length * 13) : 0) + 4;
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(8.5);
      setText(C.warning);
      doc.text(tipLines, margin + 20, tipY);
    }

    y += h + 18;
    if (i < repos.length - 1 && y < H - 80) {
      setDraw(C.border);
      doc.setLineWidth(0.5);
      doc.line(margin + 20, y - 9, W - margin - 20, y - 9);
    }
  });

  addFooter();
  doc.save(`GitInsight_${data.user.login}.pdf`);

  // ============ HELPERS ============
  function sectionHeader(title: string, color: [number, number, number]) {
    setFill(color);
    doc.rect(margin, y, 3, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setText(C.ink);
    doc.text(title, margin + 12, y + 11);
    y += 25;
  }

  function calloutBox(text: string, color: [number, number, number], font: "helvetica" | "times" | "courier" = "helvetica", maxH?: number) {
    doc.setFont(font, font === "times" ? "italic" : "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, cardW - 30);
    let h = lines.length * 14 + 18;
    if (maxH && h > maxH) h = maxH;
    roundedRect(margin, y, cardW, h, 8, C.soft);
    setDraw(color);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, cardW, h, 8, 8, "S");
    setText(C.body);
    doc.text(lines, margin + 15, y + 16, { maxWidth: cardW - 30, lineHeightFactor: 1.45 });
    y += h + 22;
  }

  function bulletSection(title: string, items: string[], color: [number, number, number], sym: string) {
    if (!items?.length) return;
    sectionHeader(title, color);
    items.forEach(it => {
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(it, cardW - 35);
      const h = lines.length * 15 + 4;
      setText(color);
      doc.setFont("courier", "bold");
      doc.text(sym, margin + 5, y + 10);
      setText(C.body);
      doc.setFont("helvetica", "normal");
      doc.text(lines, margin + 28, y + 10, { lineHeightFactor: 1.4 });
      y += h;
    });
    y += 12;
  }
}
