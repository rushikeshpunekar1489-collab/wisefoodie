import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | WiseFoodies',
  description: 'Terms of use governing the WiseFoodies platform and intelligence tools.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary tracking-tight">
          Terms of Use
        </h1>
        <p className="text-xs text-outline font-medium">Effective Date: October 2026 &middot; Botanical Consumer Intelligence Protocol</p>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 p-6 sm:p-8 space-y-6 bg-surface-container-lowest text-sm text-on-surface-variant leading-relaxed shadow-sm font-medium">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-primary text-base">1. Acceptance of Terms</h2>
          <p>
            By accessing or using WiseFoodies, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Medical &amp; Food Disclaimer.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-primary text-base">2. Purpose of the Platform</h2>
          <p>
            WiseFoodies provides independent packaged-food data analysis. The Food Benefit Score and Nutrition Per Paisa algorithms are mathematical assessments based on publicly declared label data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-primary text-base">3. Intellectual Property &amp; Fair Use</h2>
          <p>
            The WiseFoodies name, algorithmic methodology, design system, and code are proprietary to WiseFoodies. Brand names, logos, and product catalog representations belong to their respective corporate trademark holders and are utilized under fair use for consumer identification and comparative reporting.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-primary text-base">4. Limitation of Liability</h2>
          <p>
            WiseFoodies is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind. WiseFoodies shall not be liable for any indirect, incidental, or consequential damages arising from the use of nutritional evaluations.
          </p>
        </section>
      </div>
    </div>
  );
}
