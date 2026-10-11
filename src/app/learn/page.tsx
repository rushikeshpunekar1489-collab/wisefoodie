import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LEARN_TOPICS } from '@/lib/learn';
import { BookOpen, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Food Knowledge & Label Literacy Hub | WiseFoodies',
  description:
    'Comprehensive consumer guides on decoding Indian nutrition labels, added sugars, INS additives, palm oil, and whole grains.',
};

export default function LearnIndexPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="chip bg-[var(--leaf)] text-white">
          <BookOpen className="w-3.5 h-3.5" /> Food Literacy Hub
        </div>
        <h1 className="t-display-lg text-[var(--ink)]">
          Learn Food Label Decoding
        </h1>
        <p className="t-body font-semibold opacity-75 leading-relaxed">
          Short, science-grounded guides designed to help you decode misleading front-of-pack claims and read nutrition tables with confidence.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEARN_TOPICS.map((topic) => (
          <Link
            key={topic.slug}
            href={`/learn/${topic.slug}`}
            className="bubble-card flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{topic.icon}</span>
                <span className="chip text-[10px] bg-[var(--surface-alt)]">
                  {topic.category}
                </span>
              </div>

              <div>
                <h3 className="t-h3 group-hover:text-[var(--leaf)] transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs font-semibold opacity-75 mt-1 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)]/15 text-xs font-bold">
                <span className="text-[var(--leaf)] font-black">Rule:</span> {topic.keyTakeaway}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t-2 border-[var(--ink)]/10 flex items-center justify-between text-xs font-black uppercase text-[var(--leaf)]">
              <span>Read Guide</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
