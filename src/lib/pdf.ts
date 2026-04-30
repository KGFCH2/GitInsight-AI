import jsPDF from "jspdf";
import type { AnalysisResult } from "./types";

// Premium Color palette (RGB)
const C = {
  brand: [249, 115, 22] as [number, number, number],      // Orange
  brandDark: [234, 88, 12] as [number, number, number],   // Dark Orange
  success: [16, 185, 129] as [number, number, number],    // Emerald
  warning: [245, 158, 11] as [number, number, number],    // Amber
  danger: [239, 68, 68] as [number, number, number],      // Red/Crimson
  accent: [244, 63, 94] as [number, number, number],      // Rose
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

export function exportPdf(
  data: AnalysisResult, 
  faviconB64?: string, 
  achievementIcons?: Record<string, string>,
  badgeIcons?: Record<string, string>
) {
  // Using 'times' as the closest built-in serif font for 'Cambria Math'
  const FONT = "times";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 45;
  let y = margin;

  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const addFooter = () => {
    const fy = H - 25;
    setDraw(C.border);
    doc.setLineWidth(0.5);
    doc.line(margin, fy - 8, W - margin, fy - 8);
    doc.setFontSize(7.5);
    doc.setFont(FONT, "normal");
    setText(C.muted);
    doc.text(`GITINSIGHT AI • Profile Audit Report • Generated for @${data.user.login}`, margin, fy);
    const pageNo = `Page ${doc.getCurrentPageInfo().pageNumber}`;
    doc.text(pageNo, W - margin - doc.getTextWidth(pageNo), fy);
  };

  const drawIcon = (x: number, yy: number, type: "star" | "fork" | "code" | "box") => {
    doc.setLineWidth(0.8);
    if (type === "star") {
      setFill(C.warning);
      // 5-pointed star
      const points = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 5 : 2;
        const angle = (Math.PI * i) / 5 - Math.PI / 2;
        points.push({ x: x + 5 + r * Math.cos(angle), y: yy + 5 + r * Math.sin(angle) });
      }
      doc.lines(points.map((p, i) => {
        const next = points[(i + 1) % 10];
        return [next.x - p.x, next.y - p.y];
      }), x + 5, yy + 5 - 5, [1, 1], "F");
    } else if (type === "fork") {
      setDraw(C.brand);
      doc.line(x + 5, yy + 5, x + 5, yy + 9);
      doc.line(x + 5, yy + 5, x + 2, yy + 2);
      doc.line(x + 5, yy + 5, x + 8, yy + 2);
      doc.circle(x + 2, yy + 2, 0.8, "S");
      doc.circle(x + 8, yy + 2, 0.8, "S");
      doc.circle(x + 5, yy + 9, 0.8, "S");
    } else if (type === "code") {
      setDraw(C.accent);
      doc.line(x + 2, yy + 3, x + 0, yy + 5);
      doc.line(x + 0, yy + 5, x + 2, yy + 7);
      doc.line(x + 8, yy + 3, x + 10, yy + 5);
      doc.line(x + 10, yy + 5, x + 8, yy + 7);
      doc.line(x + 6, yy + 2, x + 4, yy + 8);
    } else {
      setDraw(C.success);
      doc.rect(x + 2, yy + 2, 6, 7, "S");
      doc.line(x + 2, yy + 4, x + 8, yy + 4);
      doc.line(x + 4, yy + 6, x + 6, yy + 6);
    }
  };

  const roundedRect = (x: number, yy: number, w: number, h: number, r: number, fill: [number, number, number], style: "F" | "S" | "FD" = "F") => {
    if (style.includes("F")) setFill(fill);
    if (style.includes("S")) setDraw(fill);
    doc.roundedRect(x, yy, w, h, r, r, style);
  };

  // GRADIENT HEADER (Pseudo-gradient with 4 strips)
  const bandH = 100;
  const gradientColors = [
    [67, 56, 202] as [number, number, number], // brandDark
    [79, 70, 229] as [number, number, number],
    [99, 102, 241] as [number, number, number], // brand
    [129, 140, 248] as [number, number, number]
  ];
  gradientColors.forEach((color, i) => {
    setFill(color);
    doc.rect(0, i * (bandH/4), W, bandH/4, "F");
  });
  
  // Title Group
  doc.setFont(FONT, "bolditalic");
  doc.setFontSize(30);
  setText(C.white);
  doc.text("GITINSIGHT AI", margin, 45);
  
  doc.setFont(FONT, "normal");
  doc.setFontSize(10);
  doc.text("Professional Developer Profile Audit Report", margin, 60);

  // Minimalist Audit Seal
  const sealX = W - margin - 40;
  const sealY = 35;
  setDraw(C.white);
  doc.setLineWidth(0.5);
  doc.circle(sealX, sealY, 15, "S");
  doc.setFontSize(5);
  setText(C.white);
  doc.text("AUDIT", sealX - 8, sealY - 1);
  doc.text("VERIFIED", sealX - 11, sealY + 5);

  const handle = `@${data.user.login}${data.user.name ? ` • ${data.user.name}` : ""}`;
  doc.setFont(FONT, "bold");
  doc.setFontSize(10);
  const pillW = doc.getTextWidth(handle) + 20;
  roundedRect(margin, 72, pillW, 18, 9, [255, 255, 255]);
  setText(C.brand);
  doc.text(handle, margin + 10, 84);

  // Direct GitHub Redirect Link
  doc.link(margin, 72, pillW, 18, { url: `https://github.com/${data.user.login}` });

  y = bandH + 25;

  // Score Summary Card
  const cardW = W - margin * 2;
  roundedRect(margin, y, cardW, 75, 8, C.soft);
  setDraw(C.border);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, cardW, 75, 8, 8, "S");

  const cx = margin + 45;
  const cy = y + 37;
  setFill(C.brand);
  doc.circle(cx, cy, 30, "F");
  setFill(C.white);
  doc.circle(cx, cy, 27, "F");

  // Proper Score Display
  doc.setFont(FONT, "bold");
  doc.setFontSize(18);
  setText(C.ink);
  const scoreVal = String(data.score.total);
  const scoreTotal = "/100";
  const valW = doc.getTextWidth(scoreVal);
  doc.setFontSize(9);
  const totalW = doc.getTextWidth(scoreTotal);
  const scoreX = cx - (valW + totalW) / 2;

  doc.setFontSize(18);
  doc.text(scoreVal, scoreX, cy + 6);
  doc.setFontSize(9);
  setText(C.muted);
  doc.text(scoreTotal, scoreX + valW, cy + 6);

  const gridX = cx + 55;
  const stats = [
    { l: "STARS", v: data.score.stats.totalStars, c: C.warning, i: "star" as const },
    { l: "FORKS", v: data.score.stats.totalForks, c: C.brand, i: "fork" as const },
    { l: "REPOS", v: data.score.stats.originalRepoCount, c: C.success, i: "box" as const },
    { l: "LANGS", v: data.score.stats.languageCount, c: C.accent, i: "code" as const }
  ];
  const sw = (cardW - 110) / 4;
  stats.forEach((st, i) => {
    const sx = gridX + i * sw;
    const blockCenter = sx + sw / 2 - 10;

    // Draw icon centered above text
    drawIcon(blockCenter, y + 14, st.i);

    doc.setFont(FONT, "bold");
    doc.setFontSize(13);
    setText(st.c);
    const valStr = String(st.v);
    doc.text(valStr, blockCenter + 5 - doc.getTextWidth(valStr) / 2, y + 37);

    doc.setFontSize(7);
    setText(C.muted);
    doc.text(st.l, blockCenter + 5 - doc.getTextWidth(st.l) / 2, y + 49);
  });

  y += 95;


  // Audit
  sectionHeader("TECHNICAL DIMENSION AUDIT", C.brand);
  const metrics = [
    { n: "Popularity", v: data.score.breakdown.popularity, m: 25, c: C.brand },
    { n: "Activity", v: data.score.breakdown.activity, m: 20, c: C.success },
    { n: "Breadth", v: data.score.breakdown.breadth, m: 15, c: C.accent },
    { n: "Quality", v: data.score.breakdown.quality, m: 20, c: C.warning },
    { n: "Community", v: data.score.breakdown.community, m: 10, c: C.brandDark },
    { n: "Tenure", v: data.score.breakdown.tenure, m: 10, c: C.muted }
  ];
  metrics.forEach(m => {
    doc.setFontSize(8.5);
    setText(C.body);
    doc.text(m.n, margin, y + 8);
    roundedRect(margin + 100, y + 2, cardW - 145, 6, 3, C.border);
    const fillW = Math.max(3, (m.v / m.m) * (cardW - 145));
    roundedRect(margin + 100, y + 2, fillW, 6, 3, m.c);
    doc.setFont(FONT, "bold");
    setText(C.muted);
    doc.text(`${m.v}/${m.m}`, W - margin - 25, y + 8);
    y += 16;
  });

  y += 15;

  // Stack
  if (data.score.stats.langDetails?.length) {
    sectionHeader("STACK SPECIALIZATION", C.accent);
    let lx = margin;
    data.score.stats.langDetails.slice(0, 10).forEach(l => {
      const label = `${l.name} ${l.percentage}%`;
      doc.setFont(FONT, "normal");
      doc.setFontSize(8);
      const lw = doc.getTextWidth(label) + 15;
      if (lx + lw > W - margin) { lx = margin; y += 18; }
      roundedRect(lx, y, lw, 14, 4, C.soft);
      setFill(C.accent);
      doc.rect(lx + 2, y + 2, 2, 10, "F");
      setText(C.body);
      doc.text(label, lx + 8, y + 10);
      lx += lw + 5;
    });
    y += 28;
  }

  // Badges (Moved to Page 1)
  if (data.badges.length) {
    sectionHeader("STRATEGIC BADGES", C.brandDark);
    const badgeCount = data.badges.length;
    const half = Math.ceil(badgeCount / 2);
    const startY = y;
    let maxY = y;

    // Draw vertical line
    setDraw(C.border);
    doc.setLineWidth(0.5);
    doc.line(W/2, y, W/2, y + (half * 35));

    data.badges.slice(0, 10).forEach((b, i) => {
      const isLeft = i < half;
      const colX = isLeft ? margin : (W / 2) + 15;
      const itemY = startY + (isLeft ? i : i - half) * 35;
      
      doc.setFont(FONT, "bold");
      doc.setFontSize(8.5);
      setText(C.brandDark);
      doc.text(b.name, colX, itemY + 8);
      
      doc.setFont(FONT, "normal");
      doc.setFontSize(6.5);
      setText(C.muted);
      const desc = b.description;
      const splitDesc = doc.splitTextToSize(desc, (W / 2) - margin - 20);
      doc.text(splitDesc, colX, itemY + 17);
      
      const itemMaxY = itemY + 17 + (splitDesc.length * 8);
      if (itemMaxY > maxY) maxY = itemMaxY;
    });
    
    y = maxY + 15;
  }

  // Executive Overview
  if (data.ai.summary) {
    if (y > H - margin - 100) { addFooter(); doc.addPage(); y = margin + 20; setFill(C.brand); doc.rect(0, 0, W, 4, "F"); }
    sectionHeader("EXECUTIVE OVERVIEW", C.brand);
    calloutBox(data.ai.summary, C.brand, 90);
  }


  addFooter();

  // ============ PAGE 2: STRATEGIC INSIGHTS ============
  doc.addPage();
  y = margin + 15;
  setFill(C.brand);
  doc.rect(0, 0, W, 4, "F");

  bulletSection("KEY STRENGTHS", data.ai.strengths, C.success, ">>");
  y += 10;
  bulletSection("IMPROVEMENT VECTORS", data.ai.weaknesses, C.danger, "!!");
  y += 10;
  bulletSection("GROWTH STRATEGY", data.ai.actionSteps, C.warning, "->");
  y += 20;

  if (data.ai.recruiterInsights) {
    sectionHeader("TECHNICAL RECRUITER'S PERSPECTIVE", C.accent);
    calloutBox(data.ai.recruiterInsights, C.accent, 160);
  }

  addFooter();

  // ============ PAGE 3: REPOSITORY HIGHLIGHTS ============
  doc.addPage();
  y = margin + 15;
  setFill(C.brand);
  doc.rect(0, 0, W, 4, "F");

  sectionHeader("KEY REPOSITORY HIGHLIGHTS", C.brand);
  const repos = data.repos.slice(0, 10);
  repos.forEach((r, i) => {
    const lines = r.description ? doc.splitTextToSize(r.description, cardW - 30) : [];
    const tipLines = r.improvementNote ? doc.splitTextToSize(`TIPS: ${r.improvementNote}`, cardW - 40) : [];
    const h = 55 + (lines.length * 13) + (tipLines.length * 12);

    if (y + h > H - margin - 30) { addFooter(); doc.addPage(); y = margin + 15; setFill(C.brand); doc.rect(0, 0, W, 4, "F"); }

    roundedRect(margin, y, cardW, h, 6, C.soft);
    setFill(classColor[r.classification] || C.muted);
    doc.rect(margin, y, 3, h, "F");

    doc.setFont(FONT, "bold");
    doc.setFontSize(12);
    setText(C.ink);
    doc.text(r.name, margin + 12, y + 18);

    const tag = r.classification.toUpperCase();
    doc.setFont(FONT, "bold");
    doc.setFontSize(7.5);
    const tw = doc.getTextWidth(tag) + 10;
    roundedRect(W - margin - tw - 8, y + 8, tw, 14, 7, classColor[r.classification] || C.muted);
    setText(C.white);
    doc.text(tag, W - margin - tw - 3, y + 17.5);

    setText(C.muted);
    doc.setFontSize(8);
    const metaY = y + 32;
    doc.text(`STARS: ${r.stars}  |  FORKS: ${r.forks}  |  LANG: ${r.language || "N/A"}`, margin + 12, metaY);

    if (lines.length) {
      doc.setFont(FONT, "normal");
      doc.setFontSize(9.5);
      setText(C.body);
      doc.text(lines.slice(0, 2), margin + 12, metaY + 14, { lineHeightFactor: 1.3 });
    }

    if (r.improvementNote) {
      const tipY = metaY + 14 + (lines.length > 0 ? (Math.min(2, lines.length) * 13) : 0) + 4;
      doc.setFont(FONT, "italic");
      doc.setFontSize(8.5);
      setText(C.warning);
      doc.text(tipLines, margin + 16, tipY, { lineHeightFactor: 1.3 });
    }

    y += h + 12;
  });

  addFooter();
  doc.save(`GitInsight_${data.user.login}.pdf`);

  // ============ HELPERS ============
  function sectionHeader(title: string, color: [number, number, number]) {
    setFill(color);
    doc.rect(margin, y, 3, 14, "F");
    doc.setFont(FONT, "bold");
    doc.setFontSize(11);
    setText(C.ink);
    doc.text(title, margin + 12, y + 11);
    y += 24;
  }

  function calloutBox(text: string, color: [number, number, number], maxH: number) {
    doc.setFont(FONT, "italic");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, cardW - 35);
    let h = lines.length * 14 + 18;
    if (h > maxH) h = maxH;

    if (y + h > H - margin - 30) {
      addFooter();
      doc.addPage();
      y = margin + 15;
      setFill(C.brand);
      doc.rect(0, 0, W, 4, "F");
    }

    roundedRect(margin, y, cardW, h, 6, C.soft);
    setDraw(color);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, cardW, h, 6, 6, "S");
    setText(C.body);
    doc.text(lines, margin + 18, y + 16, { maxWidth: cardW - 35, lineHeightFactor: 1.4 });
    y += h + 18;
  }

  function bulletSection(title: string, items: string[], color: [number, number, number], sym: string) {
    if (!items?.length) return;
    if (y > H - margin - 80) { addFooter(); doc.addPage(); y = margin + 15; setFill(C.brand); doc.rect(0, 0, W, 4, "F"); }
    sectionHeader(title, color);
    items.forEach(it => {
      doc.setFont(FONT, "normal");
      const lines = doc.splitTextToSize(it, cardW - 40);
      const h = lines.length * 15 + 4;
      if (y + h > H - margin - 30) {
        addFooter();
        doc.addPage();
        y = margin + 15;
        setFill(C.brand);
        doc.rect(0, 0, W, 4, "F");
        sectionHeader(title + " (CONT.)", color);
      }
      
      // Draw actual vector icon based on symbol
      const iconSize = 8;
      const ix = margin + 8;
      const iy = y + 1;
      
      if (sym === ">>") {
        // Double Arrow
        setDraw(color);
        doc.setLineWidth(1);
        doc.line(ix, iy, ix + 4, iy + 4);
        doc.line(ix + 4, iy + 4, ix, iy + 8);
        doc.line(ix + 3, iy, ix + 7, iy + 4);
        doc.line(ix + 7, iy + 4, ix + 3, iy + 8);
      } else if (sym === "!!") {
        // Warning Sign
        setFill(color);
        doc.circle(ix + 4, iy + 4, 4.5, "F");
        setText(C.white);
        doc.setFontSize(6);
        doc.text("!", ix + 3, iy + 6.5);
      } else {
        // Growth Arrow
        setDraw(color);
        doc.setLineWidth(1.2);
        doc.line(ix, iy + 4, ix + 8, iy + 4);
        doc.line(ix + 5, iy + 1, ix + 8, iy + 4);
        doc.line(ix + 5, iy + 7, ix + 8, iy + 4);
      }

      setText(C.body);
      doc.setFont(FONT, "normal");
      doc.setFontSize(10);
      doc.text(lines, margin + 28, y + 8, { lineHeightFactor: 1.4 });
      y += h;
    });
    y += 8;
  }
}
