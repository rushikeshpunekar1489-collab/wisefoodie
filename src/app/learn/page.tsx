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
    <div className="container max-w-6xl mx-auto px-4 pt-28 md:pt-32 pb-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span>Food Literacy & Forensic Guides</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight">
          Learn Food Label Decoding
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed">
          Short, science-grounded guides designed to help you decode misleading front-of-pack claims and read nutrition tables with confidence.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEARN_TOPICS.map((topic) => (
          <Link
            key={topic.slug}
            href={`/learn/${topic.slug}`}
            className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{topic.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant">
                  {topic.category}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface">
                <span className="text-primary font-bold">Rule:</span> {topic.keyTakeaway}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-primary">
              <span>Read Guide</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
