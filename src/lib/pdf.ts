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

  const ensureRoom = (h: number) => {
    if (y + h > H - margin - 40) {
      addFooter();
      doc.addPage();
      y = margin + 40;
      addPageHeader();
    }
  };

  const space = (n = 10) => { y += n; };

  const roundedRect = (x: number, yy: number, w: number, h: number, r: number, fill: [number, number, number], style: "F" | "S" | "FD" = "F") => {
    if (style.includes("F")) setFill(fill);
    if (style.includes("S")) setDraw(fill);
    doc.roundedRect(x, yy, w, h, r, r, style);
  };

  const addPageHeader = () => {
    setFill(C.brand);
    doc.rect(0, 0, W, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setText(C.muted);
    doc.text("GITINSIGHT AI - PROFESSIONAL REPORT", margin, 25);
  };

  const addFooter = () => {
    const fy = H - 30;
    setDraw(C.border);
    doc.setLineWidth(0.5);
    doc.line(margin, fy - 10, W - margin, fy - 10);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    setText(C.muted);
    doc.text(`Generated for @${data.user.login} | unsaidtalks.education`, margin, fy);
    const pageNo = `Page ${doc.getCurrentPageInfo().pageNumber}`;
    doc.text(pageNo, W - margin - doc.getTextWidth(pageNo), fy);
  };

  // ============ COVER SECTION ============
  const bandH = 160;
  setFill(C.brand);
  doc.rect(0, 0, W, bandH, "F");
  
  // Decorative pattern
  setFill(C.brandDark);
  for(let i=0; i<W; i+=40) {
    doc.circle(i, 20, 2, "F");
    doc.circle(i + 20, 40, 2, "F");
  }

  // Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  setText(C.white);
  doc.text("GitInsight AI", margin, 65);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Advanced GitHub Developer Analytics", margin, 85);

  // User Badge
  const handle = `@${data.user.login}${data.user.name ? ` • ${data.user.name}` : ""}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const pillW = doc.getTextWidth(handle) + 30;
  roundedRect(margin, 105, pillW, 30, 15, [255, 255, 255]);
  setText(C.brand);
  doc.text(handle, margin + 15, 125);

  y = bandH + 30;

  // ============ SCORE SUMMARY ============
  const cardW = W - margin * 2;
  roundedRect(margin, y, cardW, 110, 12, C.soft);
  setDraw(C.border);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, cardW, 110, 12, 12, "S");

  // Big Score
  const cx = margin + 60;
  const cy = y + 55;
  setFill(C.brand);
  doc.circle(cx, cy, 38, "F");
  setFill(C.white);
  doc.circle(cx, cy, 34, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  setText(C.ink);
  const scoreStr = String(data.score.total);
  doc.text(scoreStr, cx - doc.getTextWidth(scoreStr)/2, cy + 8);
  doc.setFontSize(9);
  setText(C.muted);
  doc.text("/ 100", cx - 12, cy + 20);

  // Stats Grid
  const gridX = cx + 60;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(C.ink);
  doc.text("Profile Performance Index", gridX, y + 30);
  
  const stats = [
    { l: "Stars", v: data.score.stats.totalStars, c: C.warning },
    { l: "Forks", v: data.score.stats.totalForks, c: C.brand },
    { l: "Repos", v: data.score.stats.originalRepoCount, c: C.success },
    { l: "Langs", v: data.score.stats.languageCount, c: C.accent }
  ];
  
  const sw = (cardW - 120) / 4;
  stats.forEach((st, i) => {
    const sx = gridX + i * sw;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setText(st.c);
    doc.text(String(st.v), sx, y + 75);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setText(C.muted);
    doc.text(st.l, sx, y + 90);
  });

  y += 140;

  // ============ BREAKDOWN BARS ============
  sectionHeader("Performance Metrics", C.brand);
  const metrics = [
    { n: "Popularity", v: data.score.breakdown.popularity, m: 25, c: C.brand },
    { n: "Activity", v: data.score.breakdown.activity, m: 20, c: C.success },
    { n: "Breadth", v: data.score.breakdown.breadth, m: 15, c: C.accent },
    { n: "Quality", v: data.score.breakdown.quality, m: 20, c: C.warning },
    { n: "Community", v: data.score.breakdown.community, m: 10, c: C.brandDark },
    { n: "Tenure", v: data.score.breakdown.tenure, m: 10, c: C.muted }
  ];

  const fullBarW = cardW - 140;
  metrics.forEach(m => {
    ensureRoom(22);
    doc.setFontSize(10);
    setText(C.body);
    doc.text(m.n, margin, y + 10);
    
    roundedRect(margin + 100, y + 2, fullBarW, 10, 5, C.border);
    const valW = Math.max(4, (m.v / m.m) * fullBarW);
    roundedRect(margin + 100, y + 2, valW, 10, 5, m.c);
    
    setText(C.muted);
    const valStr = `${m.v}/${m.m}`;
    doc.text(valStr, W - margin - doc.getTextWidth(valStr), y + 10);
    y += 20;
  });

  space(20);

  // ============ LANGUAGE BREAKDOWN ============
  if (data.score.stats.langDetails?.length) {
    sectionHeader("Language Distribution", C.accent);
    ensureRoom(60);
    const langItems = data.score.stats.langDetails.slice(0, 6);
    let lx = margin;
    langItems.forEach(l => {
      const label = `${l.name} (${l.percentage}%)`;
      doc.setFontSize(9);
      const lw = doc.getTextWidth(label) + 24;
      if (lx + lw > W - margin) { lx = margin; y += 25; ensureRoom(25); }
      
      roundedRect(lx, y, lw, 20, 4, C.soft);
      setFill(C.accent);
      doc.circle(lx + 10, y + 10, 3, "F");
      setText(C.body);
      doc.text(label, lx + 18, y + 14);
      lx += lw + 8;
    });
    y += 40;
  }

  // ============ AI INSIGHTS ============
  if (data.ai.summary) {
    sectionHeader("Executive Analysis", C.brand);
    calloutBox(data.ai.summary, C.brand);
  }

  bulletSection("Key Strengths", data.ai.strengths, C.success, "✓");
  bulletSection("Strategic Weaknesses", data.ai.weaknesses, C.danger, "!");
  bulletSection("Growth Roadmap", data.ai.actionSteps, C.warning, "→");

  if (data.ai.recruiterInsights) {
    sectionHeader("Technical Recruiter Perspective", C.accent);
    calloutBox(data.ai.recruiterInsights, C.accent);
  }

  // ============ TOP REPOSITORIES ============
  const top = data.repos.slice(0, 6);
  if (top.length) {
    sectionHeader("Repository Highlights", C.brand);
    top.forEach(r => {
      const lines = r.description ? doc.splitTextToSize(r.description, cardW - 30) : [];
      const h = 45 + (lines.length * 12);
      ensureRoom(h + 10);
      
      roundedRect(margin, y, cardW, h, 8, C.soft);
      setFill(classColor[r.classification] || C.muted);
      doc.rect(margin, y, 4, h, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setText(C.ink);
      doc.text(r.name, margin + 15, y + 18);
      
      const tag = r.classification.toUpperCase();
      doc.setFontSize(8);
      const tw = doc.getTextWidth(tag) + 12;
      roundedRect(W - margin - tw - 10, y + 8, tw, 16, 8, classColor[r.classification] || C.muted);
      setText(C.white);
      doc.text(tag, W - margin - tw - 4, y + 19);
      
      setText(C.muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Stars: ${r.stars} • Forks: ${r.forks} • ${r.language || "N/A"}`, margin + 15, y + 32);
      
      if (lines.length) {
        setText(C.body);
        doc.text(lines.slice(0, 3), margin + 15, y + 46);
      }
      y += h + 10;
    });
  }

  addFooter();
  doc.save(`GitInsight_${data.user.login}.pdf`);

  // ============ HELPERS ============
  function sectionHeader(title: string, color: [number, number, number]) {
    ensureRoom(40);
    setFill(color);
    doc.rect(margin, y, 3, 16, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    setText(C.ink);
    doc.text(title.toUpperCase(), margin + 12, y + 13);
    y += 25;
  }

  function calloutBox(text: string, color: [number, number, number]) {
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, cardW - 30);
    const h = lines.length * 14 + 20;
    ensureRoom(h + 10);
    roundedRect(margin, y, cardW, h, 8, C.soft);
    setDraw(color);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, cardW, h, 8, 8, "S");
    setText(C.body);
    doc.text(lines, margin + 15, y + 18);
    y += h + 15;
  }

  function bulletSection(title: string, items: string[], color: [number, number, number], sym: string) {
    if (!items?.length) return;
    sectionHeader(title, color);
    items.forEach(it => {
      const lines = doc.splitTextToSize(it, cardW - 35);
      const h = lines.length * 14 + 5;
      ensureRoom(h);
      setText(color);
      doc.setFont("helvetica", "bold");
      doc.text(sym, margin + 5, y + 10);
      setText(C.body);
      doc.setFont("helvetica", "normal");
      doc.text(lines, margin + 20, y + 10);
      y += h;
    });
    space(10);
  }
}
