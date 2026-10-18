'use client';

import React, { useRef, useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Smartphone,
  Monitor,
  ExternalLink,
} from 'lucide-react';
import {
  SHARE_FORMATS,
  generateShareCaption,
  generateWhatsAppShareUrl,
  getScoreBandColor,
  getScoreBgColor,
} from '@/lib/shareCard';
import { computeNutritionPerPaisa } from '@/lib/value';

interface ShareModalProps {
  product?: Product;
  data?: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ product: propProduct, data, isOpen, onClose }: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<'portrait' | 'landscape'>('portrait');
  const [copied, setCopied] = useState(false);
  const [canNativeShareFile, setCanNativeShareFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const product: Product = propProduct || {
    id: data?.slug || 'diary',
    slug: data?.slug || 'diary',
    name: data?.title || 'Daily Summary',
    brand: data?.brand || 'WiseFoodies Diary',
    category: 'Food Diary',
    subcategory: 'Day Summary',
    image: null,
    servingSizeG: 100,
    packSizeG: 100,
    priceINR: data?.priceINR || 0,
    per100g: {
      energyKcal: data?.calories || 0,
      proteinG: data?.proteinG || 0,
      carbsG: 0,
      totalSugarG: data?.sugarG || 0,
      addedSugarG: data?.sugarG || 0,
      fatG: 0,
      satFatG: 0,
      transFatG: 0,
      fibreG: 0,
      sodiumMg: 0,
      micronutrients: [],
    },
    ingredients: [],
    ingredientTags: [],
    benefits: [],
    concerns: [],
    fbs: {
      score: data?.fbsScore || 7.0,
      band: data?.fbsBand || 'Moderate',
      breakdown: [],
    },
    nutritionPerPaisa: {
      proteinPerRupee: null,
      fibrePerRupee: null,
      tenRupeesGet: [],
    },
    barcode: null,
    aliases: [],
    packSizeText: null,
    lastUpdated: new Date().toISOString(),
    dataSource: 'diary',
    verification: 'complete',
  };

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/food/${product.slug}`
      : `https://wisefoodies.in/food/${product.slug}`;

  const caption = generateShareCaption({
    name: product.name,
    brand: product.brand,
    fbsScore: product.fbs.score,
    url: productUrl,
  });

  // Check Web Share API file capability
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'canShare' in navigator) {
      setCanNativeShareFile(true);
    }
  }, []);

  // Re-draw canvas whenever format or product changes
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = SHARE_FORMATS[format];
    canvas.width = width;
    canvas.height = height;

    drawShareCard(ctx, width, height, format, product, productUrl);
  }, [isOpen, format, product, productUrl]);

  const drawShareCard = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    fmt: 'portrait' | 'landscape',
    prod: Product,
    url: string
  ) => {
    const score = prod.fbs.score;
    const bandColor = getScoreBandColor(score);
    const bgColor = getScoreBgColor(score);

    // 1. Background fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Decorative background pattern (dots)
    ctx.fillStyle = '#0f172a';
    ctx.globalAlpha = 0.04;
    for (let x = 30; x < w; x += 40) {
      for (let y = 30; y < h; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // Outer card border
    const m = 36;
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#0f172a';
    ctx.fillStyle = '#ffffff';

    // Round rect card container
    roundRect(ctx, m, m, w - m * 2, h - m * 2, 32);
    ctx.fill();
    ctx.stroke();

    // 2. Header: Logo & Badge
    const headerY = m + 60;
    // Logo circle
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(m + 50, headerY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Logo text "W"
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('W', m + 50, headerY);

    // Brand name WiseFoodies
    ctx.textAlign = 'left';
    ctx.font = '900 38px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Wise', m + 96, headerY);
    const wiseWidth = ctx.measureText('Wise').width;
    ctx.fillStyle = '#15803d';
    ctx.fillText('Foodies', m + 96 + wiseWidth, headerY);

    // Tagline chip
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    const chipX = w - m - 230;
    const chipY = headerY - 22;
    roundRect(ctx, chipX, chipY, 190, 44, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = '800 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Label Decoded', chipX + 95, chipY + 22);

    if (fmt === 'portrait') {
      // ---------------- PORTRAIT LAYOUT (1080 x 1350) ----------------
      // Brand tag
      const contentTop = headerY + 70;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#15803d';
      ctx.font = '900 22px sans-serif';
      ctx.fillText(prod.brand.toUpperCase(), m + 40, contentTop);

      // Product Title (with smart word wrapping)
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 44px sans-serif';
      const maxTitleWidth = w - m * 2 - 80;
      const lines = wrapText(ctx, prod.name, maxTitleWidth);
      let titleY = contentTop + 45;
      lines.slice(0, 3).forEach((line) => {
        ctx.fillText(line, m + 40, titleY);
        titleY += 52;
      });

      // Category Pill
      if (prod.category) {
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        roundRect(ctx, m + 40, titleY, 200, 36, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.font = '700 16px sans-serif';
        ctx.fillText(`Aisle: ${prod.category}`, m + 52, titleY + 24);
      }

      // Large FBS Vitality Capsule (Centered)
      const capsuleY = titleY + 70;
      const capsuleW = 340;
      const capsuleH = 260;
      const capsuleX = (w - capsuleW) / 2;

      // Shadow
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, capsuleX + 8, capsuleY + 8, capsuleW, capsuleH, 32);
      ctx.fill();

      // Card
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 5;
      roundRect(ctx, capsuleX, capsuleY, capsuleW, capsuleH, 32);
      ctx.fill();
      ctx.stroke();

      // Capsule Top label
      ctx.fillStyle = '#64748b';
      ctx.font = '900 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FOOD BENEFIT SCORE', w / 2, capsuleY + 45);

      // Score Value
      ctx.fillStyle = bandColor;
      ctx.font = '900 90px sans-serif';
      ctx.fillText(score !== null ? score.toFixed(1) : '—', w / 2, capsuleY + 130);

      // Band pill
      ctx.fillStyle = bandColor;
      roundRect(ctx, w / 2 - 90, capsuleY + 180, 180, 42, 21);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 18px sans-serif';
      ctx.fillText(prod.fbs.band || 'Evaluation', w / 2, capsuleY + 206);

      // 3 Stats Cards
      const statsY = capsuleY + capsuleH + 40;
      const statW = (w - m * 2 - 100) / 3;
      const stats = [
        { label: 'PROTEIN', val: prod.per100g.proteinG !== null ? `${prod.per100g.proteinG}g` : '—', sub: 'per 100g', color: '#15803d' },
        { label: 'SUGAR', val: prod.per100g.totalSugarG !== null ? `${prod.per100g.totalSugarG}g` : '—', sub: 'per 100g', color: '#dc2626' },
        { label: 'CALORIES', val: prod.per100g.energyKcal !== null ? `${prod.per100g.energyKcal}` : '—', sub: 'kcal/100g', color: '#0f172a' },
      ];

      stats.forEach((st, idx) => {
        const sx = m + 40 + idx * (statW + 10);
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        roundRect(ctx, sx, statsY, statW, 120, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '800 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(st.label, sx + statW / 2, statsY + 30);

        ctx.fillStyle = st.color;
        ctx.font = '900 32px sans-serif';
        ctx.fillText(st.val, sx + statW / 2, statsY + 70);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 12px sans-serif';
        ctx.fillText(st.sub, sx + statW / 2, statsY + 98);
      });

      // Nutrition Per ₹10 highlight box
      const valueY = statsY + 150;
      const valueW = w - m * 2 - 80;
      const valData = computeNutritionPerPaisa({
        priceINR: prod.priceINR,
        packSizeG: prod.packSizeG,
        per100g: prod.per100g,
      });

      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      roundRect(ctx, m + 40, valueY, valueW, 76, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = '800 18px sans-serif';
      const proteinPer10 = valData.proteinPerRupee !== null ? (valData.proteinPerRupee * 10).toFixed(1) : null;
      ctx.fillText(
        `⚡ Value Intelligence: ₹10 gives ${proteinPer10 !== null ? `${proteinPer10}g protein` : 'balanced nutrition'} • MRP ₹${prod.priceINR || '—'}`,
        m + 60,
        valueY + 44
      );

      // Footer
      const footerY = h - m - 40;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m + 40, footerY - 20);
      ctx.lineTo(w - m - 40, footerY - 20);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('wisefoodies.in • Eat Smarter. Choose Better.', m + 40, footerY + 8);

      ctx.fillStyle = '#64748b';
      ctx.font = '700 13px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('For information only, not medical advice.', w - m - 40, footerY + 8);
    } else {
      // ---------------- LANDSCAPE LAYOUT (1200 x 630) ----------------
      const bodyY = headerY + 60;
      const leftW = 620;

      // Brand
      ctx.textAlign = 'left';
      ctx.fillStyle = '#15803d';
      ctx.font = '900 20px sans-serif';
      ctx.fillText(prod.brand.toUpperCase(), m + 40, bodyY);

      // Title
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 38px sans-serif';
      const lines = wrapText(ctx, prod.name, leftW);
      let ty = bodyY + 42;
      lines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, m + 40, ty);
        ty += 46;
      });

      // 3 Stats Pills horizontally
      const statsY = ty + 15;
      const statW = 180;
      const stats = [
        { label: 'PROTEIN', val: prod.per100g.proteinG !== null ? `${prod.per100g.proteinG}g` : '—', color: '#15803d' },
        { label: 'SUGAR', val: prod.per100g.totalSugarG !== null ? `${prod.per100g.totalSugarG}g` : '—', color: '#dc2626' },
        { label: 'CALORIES', val: prod.per100g.energyKcal !== null ? `${prod.per100g.energyKcal}` : '—', color: '#0f172a' },
      ];

      stats.forEach((st, idx) => {
        const sx = m + 40 + idx * (statW + 14);
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        roundRect(ctx, sx, statsY, statW, 85, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '800 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${st.label} / 100g`, sx + statW / 2, statsY + 28);

        ctx.fillStyle = st.color;
        ctx.font = '900 26px sans-serif';
        ctx.fillText(st.val, sx + statW / 2, statsY + 62);
      });

      // Right: Big Capsule
      const capX = w - m - 360;
      const capY = bodyY - 10;
      const capW = 320;
      const capH = 300;

      // Shadow
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, capX + 8, capY + 8, capW, capH, 28);
      ctx.fill();

      // Card
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      roundRect(ctx, capX, capY, capW, capH, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '900 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FOOD BENEFIT SCORE', capX + capW / 2, capY + 45);

      ctx.fillStyle = bandColor;
      ctx.font = '900 84px sans-serif';
      ctx.fillText(score !== null ? score.toFixed(1) : '—', capX + capW / 2, capY + 140);

      ctx.fillStyle = bandColor;
      roundRect(ctx, capX + capW / 2 - 80, capY + 200, 160, 40, 20);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 16px sans-serif';
      ctx.fillText(prod.fbs.band || 'Evaluation', capX + capW / 2, capY + 226);

      // Landscape Footer
      const footerY = h - m - 35;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m + 40, footerY - 15);
      ctx.lineTo(w - m - 40, footerY - 15);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('wisefoodies.in • Eat Smarter. Choose Better.', m + 40, footerY + 8);

      ctx.fillStyle = '#64748b';
      ctx.font = '700 12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('For information only, not medical advice.', w - m - 40, footerY + 8);
    }
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const getCanvasBlob = async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const handleNativeShare = async () => {
    try {
      setIsGenerating(true);
      const blob = await getCanvasBlob();
      if (!blob) throw new Error('Could not render image');

      const file = new File([blob], `wisefoodies-${product.slug}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${product.name} on WiseFoodies`,
          text: caption,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `${product.name} on WiseFoodies`,
          text: caption,
          url: productUrl,
        });
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        // Fallback to clipboard
        handleCopyLink();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPNG = async () => {
    const blob = await getCanvasBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wisefoodies-${product.slug}-${format}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleWhatsApp = () => {
    const waUrl = generateWhatsAppShareUrl(caption);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink)]/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border-3 border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] p-5 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--ink)]/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[var(--leaf)] stroke-[2.5]" />
            <h2 className="text-xl font-extrabold text-[var(--ink)]">Share Nutrition Card</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="p-1.5 rounded-full hover:bg-[var(--surface-alt)] border border-[var(--ink)]/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            type="button"
            onClick={() => setFormat('portrait')}
            className={`btn-chunky py-1.5 px-3 text-xs flex items-center gap-1.5 ${
              format === 'portrait' ? 'btn-primary' : 'bg-[var(--surface-alt)]'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Instagram / Story (4:5)
          </button>
          <button
            type="button"
            onClick={() => setFormat('landscape')}
            className={`btn-chunky py-1.5 px-3 text-xs flex items-center gap-1.5 ${
              format === 'landscape' ? 'btn-primary' : 'bg-[var(--surface-alt)]'
            }`}
          >
            <Monitor className="w-4 h-4" /> Twitter / Card (1.91:1)
          </button>
        </div>

        {/* Card Canvas Preview */}
        <div className="flex justify-center items-center p-3 bg-[var(--surface-alt)] rounded-2xl border-2 border-[var(--ink)]/15 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full max-h-[380px] object-contain rounded-xl shadow-md border border-[var(--ink)]/20"
          />
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
          {/* Native Share */}
          <button
            type="button"
            onClick={handleNativeShare}
            disabled={isGenerating}
            className="btn-chunky btn-primary py-2.5 px-2 text-xs flex flex-col items-center justify-center gap-1 text-center"
          >
            <Share2 className="w-4 h-4" />
            <span>{canNativeShareFile ? 'Share Card' : 'Share'}</span>
          </button>

          {/* Download PNG */}
          <button
            type="button"
            onClick={handleDownloadPNG}
            className="btn-chunky py-2.5 px-2 text-xs flex flex-col items-center justify-center gap-1 bg-white hover:bg-[var(--surface-alt)] text-center"
          >
            <Download className="w-4 h-4 text-[var(--leaf)]" />
            <span>Download PNG</span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="btn-chunky py-2.5 px-2 text-xs flex flex-col items-center justify-center gap-1 bg-[#25D366] text-white hover:brightness-105 text-center"
          >
            <ExternalLink className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="btn-chunky py-2.5 px-2 text-xs flex flex-col items-center justify-center gap-1 bg-white hover:bg-[var(--surface-alt)] text-center"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[var(--leaf)]" />
                <span className="text-[var(--leaf)]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[var(--ink)]" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Safety Note */}
        <p className="text-[11px] text-center font-semibold text-[var(--ink)]/60 mt-4">
          For information only, not medical advice. Never shares personal data.
        </p>
      </div>
    </div>
  );
}
