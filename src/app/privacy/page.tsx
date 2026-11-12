import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | WiseFoodies',
  description: 'How WiseFoodies respects and protects consumer privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-outline font-medium">Effective Date: October 2026 &middot; Botanical Consumer Intelligence Protocol</p>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 p-6 sm:p-8 space-y-6 bg-surface-container-lowest text-sm text-on-surface-variant leading-relaxed shadow-sm font-medium">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-primary text-base">1. Information We Do Not Collect</h2>
          <p>
            WiseFoodies does not require user registration or logins to browse food reports, compare foods, or calculate Nutrition Per Paisa. We do not sell your personal data or browsing behavior to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-primary text-base">2. Camera &amp; Barcode Scanner Usage</h2>
          <p>
            When you activate the grocery barcode scanner, video stream processing happens entirely locally inside your browser via client-side video frame recognition. No raw video feed or photos are uploaded to any server without your explicit submission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-primary text-base">3. User Reports &amp; Feedback</h2>
          <p>
            If you submit a product correction or missing nutrition report via our Report an Issue form, we store the submitted product details and any optional email you choose to provide solely to follow up on label verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-primary text-base">4. Analytics &amp; Cookies</h2>
          <p>
            We use minimal, anonymized telemetry strictly to monitor website uptime, performance, and identify missing barcodes in our food catalog.
          </p>
        </section>
      </div>
    </div>
  );
}
