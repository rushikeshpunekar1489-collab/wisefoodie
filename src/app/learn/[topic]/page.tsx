import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LEARN_TOPICS } from '@/lib/learn';
import { ArrowLeft, CheckCircle2, Lightbulb, ChevronRight, BookOpen } from 'lucide-react';

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const item = LEARN_TOPICS.find(t => t.slug === topic);
  if (!item) return { title: 'Topic Not Found | WiseFoodies' };

  return {
    title: `${item.title} | WiseFoodies Guide`,
    description: item.summary,
  };
}

export async function generateStaticParams() {
  return LEARN_TOPICS.map(t => ({ topic: t.slug }));
}

export default async function TopicDetailPage({ params }: Props) {
  const { topic } = await params;
  const item = LEARN_TOPICS.find(t => t.slug === topic);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-emerald-800">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link href="/learn" className="hover:text-emerald-800">Food Knowledge</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate">{item.title}</span>
      </nav>

      {/* Header */}
      <div className="wf-card p-6 sm:p-10 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-4xl">{item.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
            {item.category}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
          {item.title}
        </h1>

        <p className="text-base text-stone-600 leading-relaxed max-w-2xl">
          {item.summary}
        </p>

        {/* Highlight Card */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm font-semibold flex items-start gap-3 mt-4">
          <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Core Takeaway
            </span>
            <span>{item.keyTakeaway}</span>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Points */}
      <div className="wf-card p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
          What the Science Says
        </h2>

        <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
          {item.details.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-stone-800">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Supermarket Tips */}
      <div className="wf-card p-6 sm:p-8 bg-amber-50/40 border-amber-200/80 space-y-4">
        <div className="flex items-center gap-2 text-amber-900">
          <CheckCircle2 className="w-5 h-5 text-amber-700" />
          <h2 className="text-lg font-bold">Actionable Supermarket Rules</h2>
        </div>

        <ul className="space-y-2.5 text-sm text-stone-800">
          {item.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-amber-700 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Back button */}
      <div className="pt-4 flex justify-between items-center text-xs font-bold text-stone-600">
        <Link href="/learn" className="inline-flex items-center gap-1.5 hover:text-emerald-800">
          <ArrowLeft className="w-4 h-4" /> Back to All Food Topics
        </Link>
        <Link href="/explore" className="inline-flex items-center gap-1.5 hover:text-emerald-800">
          Test These Rules in the Food Catalog <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
