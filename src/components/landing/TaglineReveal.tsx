import React from 'react';

interface TaglineRevealProps {
  tagline: string;
  subtext?: string;
  badge?: string;
}

export default function TaglineReveal({
  tagline,
  subtext,
  badge = 'INDEPENDENT CONSUMER STANDARD',
}: TaglineRevealProps) {
  return (
    <section className="container max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl bg-primary-container text-white p-8 sm:p-12 border border-primary text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-caps uppercase tracking-wider bg-primary-fixed text-on-primary-fixed border border-primary/20">
          <span className="material-symbols-outlined text-sm">balance</span>
          <span>{badge}</span>
        </div>

        <h2 className="font-display-hero-mobile sm:font-display-hero text-2xl sm:text-4xl text-white font-serif max-w-3xl mx-auto leading-tight">
          &ldquo;{tagline}&rdquo;
        </h2>

        {subtext && (
          <p className="font-body-md text-sm sm:text-base text-primary-fixed-dim max-w-2xl mx-auto leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </section>
  );
}
