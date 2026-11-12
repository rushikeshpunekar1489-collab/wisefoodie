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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-outline font-medium">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3 text-outline" />
        <Link href="/learn" className="hover:text-primary">Food Knowledge</Link>
        <ChevronRight className="w-3 h-3 text-outline" />
        <span className="text-primary font-bold truncate">{item.title}</span>
      </nav>

      {/* Header */}
      <div className="rounded-2xl border border-outline-variant/40 p-6 sm:p-10 bg-surface-container-lowest shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-4xl">{item.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {item.category}
          </span>
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary tracking-tight leading-tight">
          {item.title}
        </h1>

        <p className="text-base text-on-surface-variant font-medium leading-relaxed max-w-2xl">
          {item.summary}
        </p>

        {/* Highlight Card */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-on-surface text-sm font-medium flex items-start gap-3 mt-4">
          <Lightbulb className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-0.5">
              Core Takeaway
            </span>
            <span>{item.keyTakeaway}</span>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Points */}
      <div className="rounded-2xl border border-outline-variant/40 p-6 sm:p-8 bg-surface-container-lowest shadow-sm space-y-6">
        <h2 className="font-serif font-bold text-xl text-primary tracking-tight">
          What the Science Says
        </h2>

        <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
          {item.details.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-on-surface font-medium">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Supermarket Tips */}
      <div className="rounded-2xl border border-secondary/30 p-6 sm:p-8 bg-secondary/5 space-y-4">
        <div className="flex items-center gap-2 text-secondary">
          <CheckCircle2 className="w-5 h-5 text-secondary" />
          <h2 className="font-serif font-bold text-lg text-primary">Actionable Supermarket Rules</h2>
        </div>

        <ul className="space-y-2.5 text-sm text-on-surface font-medium">
          {item.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-primary font-bold text-base">&bull;</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Back button */}
      <div className="pt-2">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Guides
        </Link>
      </div>
    </div>
  );
}
