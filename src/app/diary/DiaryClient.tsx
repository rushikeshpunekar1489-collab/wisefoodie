'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/product';
import { useDiary } from '@/hooks/useDiary';
import { type MealSlot, type SimpleGoal, toSafeDateString } from '@/lib/diary';
import DayProgressBars from '@/components/DayProgressBars';
import MealTimeline from '@/components/MealTimeline';
import WeekTrendChart from '@/components/WeekTrendChart';
import AddFoodModal from '@/components/AddFoodModal';
import ShareModal from '@/components/ShareModal';
import Link from 'next/link';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  Copy,
  Download,
  Share2,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Heart,
} from 'lucide-react';

interface DiaryClientProps {
  allProducts: Product[];
}

export default function DiaryClient({ allProducts }: DiaryClientProps) {
  const {
    selectedDate,
    setSelectedDate,
    entries,
    allEntries,
    goal,
    setGoal,
    addFoodEntry,
    deleteFoodEntry,
    undoLastDelete,
    lastDeleted,
    copyPreviousDayMeals,
    exportCSV,
    daySummary,
    nudges,
    streak,
  } = useDiary();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<MealSlot>('breakfast');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleOpenAdd = (slot: MealSlot) => {
    setTargetSlot(slot);
    setIsAddModalOpen(true);
  };

  const changeDateBy = (days: number) => {
    const d = new Date(toSafeDateString(selectedDate));
    d.setDate(d.getDate() + days);
    setSelectedDate(toSafeDateString(d));
  };

  const handleCopyYesterday = () => {
    const count = copyPreviousDayMeals(selectedDate);
    if (count > 0) {
      setCopyFeedback(`Copied ${count} items from yesterday!`);
    } else {
      setCopyFeedback('No items found in yesterday’s log.');
    }
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const todayStr = toSafeDateString();
  const isToday = selectedDate === todayStr;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 md:pt-32 pb-16 space-y-8">
      {/* Top Header & Streak */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <span>🥗</span>
            <span>Aaj maine kya khaya &middot; Food Journal</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-primary tracking-tight">
            Food Diary & Nutrition Tracker
          </h1>
          <p className="text-sm text-on-surface-variant font-medium max-w-xl mt-1">
            Track daily contributions against ICMR-NIN Indian reference values. Stored 100% locally on your device.
          </p>
        </div>

        {/* Streak Counter Badge */}
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary">
              <Flame className="w-5 h-5 fill-current animate-pulse" />
              <div>
                <span className="text-xs font-bold block leading-tight text-on-surface">
                  {streak} Day Streak
                </span>
                <span className="text-[10px] text-outline">Consistent logging</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleOpenAdd('breakfast')}
            className="py-2.5 px-5 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center gap-1.5 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add Food
          </button>
        </div>
      </div>

      {/* Date Navigator Bar & Goals Switcher */}
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <button
            type="button"
            onClick={() => changeDateBy(-1)}
            aria-label="Previous day"
            className="btn-chunky p-2 rounded-xl! border-2!"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="py-1.5 px-3 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface)] text-xs font-black text-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]"
            />
            {!isToday && (
              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                className="py-1 px-2.5 rounded-lg text-[10px] font-bold bg-[var(--surface)] border border-[var(--ink)] hover:bg-[var(--leaf)] hover:text-white transition-colors"
              >
                Today
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => changeDateBy(1)}
            aria-label="Next day"
            className="btn-chunky p-2 rounded-xl! border-2!"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Goal Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-extrabold text-[var(--ink)] shrink-0">Goal:</span>
          {(
            [
              { id: 'balanced', label: 'Balanced' },
              { id: 'more_protein', label: 'More Protein' },
              { id: 'less_sugar', label: 'Less Sugar' },
              { id: 'less_sodium', label: 'Less Sodium' },
            ] as { id: SimpleGoal; label: string }[]
          ).map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGoal(g.id)}
              className={`py-1.5 px-3 rounded-full text-xs font-bold shrink-0 transition-all ${
                goal === g.id
                  ? 'bg-[var(--ink)] text-white shadow-[2px_2px_0px_var(--ink)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] opacity-80 hover:opacity-100 border border-[var(--ink)]/30'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Undo Banner if item deleted */}
      {lastDeleted && (
        <div className="p-3 rounded-2xl bg-[var(--surface)] border-2 border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)] flex items-center justify-between text-xs font-bold animate-in fade-in">
          <span>Removed {lastDeleted.name} from diary.</span>
          <button
            type="button"
            onClick={undoLastDelete}
            className="inline-flex items-center gap-1 text-[var(--leaf)] hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>
        </div>
      )}

      {/* Copy Yesterday Feedback Banner */}
      {copyFeedback && (
        <div className="p-3 rounded-2xl bg-[var(--leaf)]/20 border-2 border-[var(--leaf)] text-xs font-bold text-[var(--leaf)] animate-in fade-in">
          {copyFeedback}
        </div>
      )}

      {/* Main Content: Progress Bars & Meal Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Progress & Trends) */}
        <div className="lg:col-span-1 space-y-6">
          <DayProgressBars daySummary={daySummary} goalLabel={goal} />

          {/* Insight Nudges */}
          <div className="card-chunky p-5 bg-[var(--surface)] space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--mango)]" />
              <h3 className="text-sm font-extrabold font-display">Daily Nutritional Insights</h3>
            </div>
            <div className="space-y-3">
              {nudges.map((nudge) => (
                <div
                  key={nudge.id}
                  className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/20 text-xs space-y-1.5"
                >
                  <p className="font-extrabold text-[var(--ink)]">{nudge.title}</p>
                  <p className="opacity-80 text-[11px] leading-relaxed">{nudge.message}</p>
                  {nudge.recommendationLink && (
                    <Link
                      href={nudge.recommendationLink}
                      className="inline-flex items-center gap-1 font-bold text-[var(--leaf)] hover:underline text-[11px] pt-1"
                    >
                      <span>{nudge.ctaText || 'Learn More'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <WeekTrendChart
            entries={allEntries}
            currentDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(d)}
            goal={goal}
          />
        </div>

        {/* Right Column (Meal Timeline & Actions) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-alt)] p-3 rounded-2xl border-2 border-[var(--ink)]">
            <button
              type="button"
              onClick={handleCopyYesterday}
              className="btn-chunky py-1.5 px-3 text-xs flex items-center gap-1.5 bg-[var(--surface)]"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Yesterday
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportCSV}
                className="btn-chunky py-1.5 px-3 text-xs flex items-center gap-1.5 bg-[var(--surface)]"
                title="Export diary as CSV file"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>

              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="btn-chunky py-1.5 px-3 text-xs flex items-center gap-1.5 bg-[var(--leaf)] text-white"
                title="Share day summary card"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Day Card
              </button>
            </div>
          </div>

          <MealTimeline
            entries={entries}
            onOpenAddModal={handleOpenAdd}
            onDeleteEntry={deleteFoodEntry}
          />
        </div>
      </div>

      {/* Safety & Medical Disclaimer Banner */}
      <div className="p-4 rounded-3xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] flex items-start gap-3 text-xs text-[var(--ink)] opacity-80">
        <ShieldCheck className="w-5 h-5 text-[var(--leaf)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-[var(--ink)]">
            Nutrition Intelligence, Never Medical Advice
          </p>
          <p className="leading-relaxed">
            WiseFoodies does not calculate calorie deficits, prescribe restrictive diets, or track weight targets.
            All reference values are derived from published ICMR-NIN 2020 Recommended Dietary Allowances for Indian adults.
            Daily totals reflect voluntary food contribution against general reference values.
          </p>
        </div>
      </div>

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        products={allProducts}
        defaultMealSlot={targetSlot}
        onAdd={addFoodEntry}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={{
          type: 'cart',
          title: `WiseFoodies Day Summary (${selectedDate})`,
          brand: 'My Meals',
          fbsScore: 7.2,
          fbsBand: 'Moderate',
          priceINR: 150,
          proteinG: daySummary.totals.proteinG,
          sugarG: daySummary.totals.addedSugarG,
          calories: daySummary.totals.energyKcal,
          slug: 'diary',
        }}
      />
    </div>
  );
}
