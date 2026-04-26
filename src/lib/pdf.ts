import jsPDF from "jspdf";
import type { AnalysisResult } from "./types";

// Color palette (RGB)
const C = {
  brand: [16, 185, 129] as [number, number, number],
  brandDark: [5, 150, 105] as [number, number, number],
  accent: [99, 102, 241] as [number, number, number],
  pink: [236, 72, 153] as [number, number, number],
  amber: [245, 158, 11] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
  ink: [17, 24, 39] as [number, number, number],
  body: [55, 65, 81] as [number, number, number],
  muted: [120, 125, 140] as [number, number, number],
  soft: [243, 244, 246] as [number, number, number],
  card: [249, 250, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const classColor: Record<string, [number, number, number]> = {
  good: C.brand,
  improve: C.amber,
  archive: C.muted,
};

export function exportPdf(data: AnalysisResult) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 44;
  let y = margin;

  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const ensureRoom = (h: number) => {
    if (y + h > H - margin - 30) {
      addFooter();
      doc.addPage();
      y = margin;
      addPageHeader();
    }
  };

  const text = (
    str: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; x?: number; maxWidth?: number } = {},
  ) => {
    const size = opts.size ?? 10.5;
    doc.setFontSize(size);
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    setText(opts.color ?? C.body);
    const x = opts.x ?? margin;
    const maxW = opts.maxWidth ?? W - margin * 2;
    const wrapped = doc.splitTextToSize(str, maxW);
    const lh = size * 1.4;
    ensureRoom(wrapped.length * lh);
    doc.text(wrapped, x, y);
    y += wrapped.length * lh;
  };

  const space = (n = 8) => {
    y += n;
  };

  // Rounded filled rect helper
  const roundedRect = (x: number, yy: number, w: number, h: number, r: number, fill: [number, number, number]) => {
    setFill(fill);
    doc.roundedRect(x, yy, w, h, r, r, "F");
  };

  const addPageHeader = () => {
    setFill(C.brand);
    doc.rect(0, 0, W, 4, "F");
  };

  const addFooter = () => {
    const fy = H - 24;
    setDraw(C.soft);
    doc.setLineWidth(0.5);
    doc.line(margin, fy - 8, W - margin, fy - 8);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    setText(C.muted);
    doc.text("GitInsight AI - Profile Report", margin, fy);
    const pageNo = `Page ${doc.getCurrentPageInfo().pageNumber}`;
    doc.text(pageNo, W - margin - doc.getTextWidth(pageNo), fy);
  };

  // ---------- COVER / HERO ----------
  const bandH = 140;
  setFill(C.brand);
  doc.rect(0, 0, W, bandH, "F");
  setFill(C.brandDark);
  doc.rect(0, bandH - 30, W, 30, "F");
  setFill(C.accent);
  doc.rect(0, bandH, W, 4, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  setText(C.white);
  doc.text("GitInsight AI", margin, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Professional GitHub Profile Analysis", margin, 68);

  // User pill
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  const handle = `@${data.user.login}${data.user.name ? ` | ${data.user.name}` : ""}`;
  const pillW = doc.getTextWidth(handle) + 20;
  roundedRect(margin, 88, pillW, 24, 12, [255, 255, 255]);
  setText(C.brandDark);
  doc.text(handle, margin + 10, 104);

  y = bandH + 24;

  // ---------- SCORE CARD ----------
  const scoreCardH = 100;
  roundedRect(margin, y, W - margin * 2, scoreCardH, 10, C.card);
  setDraw(C.soft);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, W - margin * 2, scoreCardH, 10, 10, "S");

  // Score circle
  const cx = margin + 50;
  const cy = y + scoreCardH / 2;
  setFill(C.brand);
  doc.circle(cx, cy, 34, "F");
  setFill(C.white);
  doc.circle(cx, cy, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  setText(C.brandDark);
  const scoreStr = String(data.score.total);
  doc.text(scoreStr, cx - doc.getTextWidth(scoreStr) / 2, cy + 5);
  doc.setFontSize(8);
  setText(C.muted);
  doc.text("/ 100", cx - 10, cy + 16);

  // Stats text
  const statsX = cx + 50;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setText(C.ink);
  doc.text("Overall Profile Score", statsX, y + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(C.muted);
  doc.text("Calculated across 6 core technical dimensions", statsX, y + 34);

  const s = data.score.stats;
  const stats: [string, string, [number, number, number]][] = [
    ["Stars", String(s.totalStars), C.amber],
    ["Forks", String(s.totalForks), C.accent],
    ["Repos", String(s.originalRepoCount), C.brand],
    ["Langs", String(s.languageCount), C.pink],
  ];
  const sw = (W - margin - statsX - 10) / 4;
  stats.forEach(([label, val, color], i) => {
    const sx = statsX + i * sw;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    setText(color);
    doc.text(val, sx, y + 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(C.muted);
    doc.text(label, sx, y + 82);
  });

  y += scoreCardH + 20;

  // ---------- SCORE BREAKDOWN ----------
  ensureRoom(140);
  sectionHeader("Score Breakdown", C.brand);
  space(4);

  const breakdown: [string, number, number, [number, number, number]][] = [
    ["Popularity", data.score.breakdown.popularity, 25, C.brand],
    ["Activity", data.score.breakdown.activity, 20, C.accent],
    ["Breadth", data.score.breakdown.breadth, 15, C.pink],
    ["Quality", data.score.breakdown.quality, 20, C.amber],
    ["Community", data.score.breakdown.community, 10, C.brandDark],
    ["Tenure", data.score.breakdown.tenure, 10, C.muted],
  ];

  const barW = W - margin * 2 - 120;
  breakdown.forEach(([label, val, max, color]) => {
    ensureRoom(20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setText(C.ink);
    doc.text(label, margin, y + 9);
    // track
    roundedRect(margin + 80, y + 2, barW, 10, 5, C.soft);
    // fill
    const fillW = Math.max(2, (val / max) * barW);
    roundedRect(margin + 80, y + 2, fillW, 10, 5, color);
    // value
    const v = `${val}/${max}`;
    doc.text(v, W - margin - doc.getTextWidth(v), y + 10);
    y += 18;
  });

  space(12);

  // ---------- AI SECTIONS ----------
  if (data.ai.summary) {
    sectionHeader("Executive Summary", C.accent);
    calloutBox(data.ai.summary, C.accent);
  }

  bulletSection("Key Strengths", data.ai.strengths, C.brand, "o");
  bulletSection("Areas for Improvement", data.ai.weaknesses, C.red, "x");
  bulletSection("Recommended Actions", data.ai.actionSteps, C.amber, ">");

  if (data.ai.recruiterInsights) {
    sectionHeader("Technical Recruiter View", C.pink);
    calloutBox(data.ai.recruiterInsights, C.pink);
  }

  // ---------- BADGES ----------
  if (data.badges.length) {
    sectionHeader("Achievements & Badges", C.brandDark);
    let bx = margin;
    data.badges.forEach((b) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      const tw = doc.getTextWidth(b) + 16;
      if (bx + tw > W - margin) {
        bx = margin;
        y += 24;
        ensureRoom(24);
      }
      roundedRect(bx, y, tw, 18, 9, C.brand);
      setText(C.white);
      doc.text(b, bx + 8, y + 12);
      bx += tw + 5;
    });
    y += 26;
  }

  // ---------- TOP REPOS ----------
  const top = data.repos.slice(0, 8);
  if (top.length) {
    sectionHeader("Top Repositories", C.accent);
    top.forEach((r) => {
      const descLines = r.description ? doc.splitTextToSize(r.description, W - margin * 2 - 20) : [];
      const cardH = 34 + (descLines.length * 11);
      ensureRoom(cardH + 10);
      
      roundedRect(margin, y, W - margin * 2, cardH, 6, C.card);
      const stripe = classColor[r.classification] || C.muted;
      setFill(stripe);
      doc.rect(margin, y, 3, cardH, "F");

      // Repo Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      setText(C.ink);
      doc.text(r.name, margin + 12, y + 15);

      // Status Tag (Right side)
      const tagTxt = r.classification.toUpperCase();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const tw = doc.getTextWidth(tagTxt) + 10;
      roundedRect(W - margin - tw - 5, y + 6, tw, 14, 7, stripe);
      setText(C.white);
      doc.text(tagTxt, W - margin - tw, y + 15.5);

      // Meta (Stars/Forks/Language)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      setText(C.muted);
      const meta = `Stars: ${r.stars} | Forks: ${r.forks}${r.language ? ` | ${r.language}` : ""}`;
      doc.text(meta, margin + 12, y + 28);

      if (r.description) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        setText(C.body);
        doc.text(descLines.slice(0, 3), margin + 12, y + 40);
      }

      y += cardH + 8;
    });
  }

  addFooter();

  // ============ HELPERS ============
  function sectionHeader(title: string, color: [number, number, number]) {
    ensureRoom(30);
    setFill(color);
    doc.rect(margin, y, 2, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    setText(C.ink);
    doc.text(title, margin + 8, y + 11);
    y += 20;
  }

  function calloutBox(content: string, color: [number, number, number]) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const wrapped = doc.splitTextToSize(content, W - margin * 2 - 20);
    const h = wrapped.length * 13 + 14;
    ensureRoom(h + 6);
    setFill([color[0], color[1], color[2]]);
    // Use semi-transparent background if possible, or just very light color
    roundedRect(margin, y, W - margin * 2, h, 6, [250, 250, 250]);
    setDraw(color);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, W - margin * 2, h, 6, 6, "S");
    
    setText(C.ink);
    doc.text(wrapped, margin + 10, y + 14);
    y += h + 10;
  }

  function bulletSection(title: string, items: string[], color: [number, number, number], sym: string) {
    if (!items?.length) return;
    sectionHeader(title, color);
    items.forEach((it) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const wrapped = doc.splitTextToSize(it, W - margin * 2 - 24);
      const h = wrapped.length * 13 + 4;
      ensureRoom(h);
      setText(color);
      doc.setFont("helvetica", "bold");
      doc.text(sym, margin + 5, y + 9);
      doc.setFont("helvetica", "normal");
      setText(C.body);
      doc.text(wrapped, margin + 18, y + 9);
      y += h;
    });
    space(4);
  }

  doc.save(`GitInsight-${data.user.login}.pdf`);
}
