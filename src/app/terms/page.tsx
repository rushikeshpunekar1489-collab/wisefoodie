import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | WiseFoodies',
  description: 'Terms of use governing the WiseFoodies platform and intelligence tools.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Terms of Use
        </h1>
        <p className="text-xs text-stone-500">Effective Date: October 2026</p>
      </div>

      <div className="wf-card p-6 sm:p-8 space-y-6 bg-white text-sm text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">1. Acceptance of Terms</h2>
          <p>
            By accessing or using WiseFoodies, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Medical & Food Disclaimer.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">2. Purpose of the Platform</h2>
          <p>
            WiseFoodies provides independent packaged-food data analysis. The Food Benefit Score and Nutrition Per Paisa algorithms are mathematical assessments based on publicly declared label data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">3. Intellectual Property & Fair Use</h2>
          <p>
            The WiseFoodies name, algorithmic methodology, design system, and code are proprietary to WiseFoodies. Brand names, logos, and product catalog representations belong to their respective corporate trademark holders and are utilized under fair use for consumer identification and comparative reporting.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">4. Limitation of Liability</h2>
          <p>
            WiseFoodies is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind. WiseFoodies shall not be liable for any indirect, incidental, or consequential damages arising from the use of nutritional evaluations.
          </p>
        </section>
      </div>
    </div>
  );
}
