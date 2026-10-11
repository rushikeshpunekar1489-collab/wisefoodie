import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | WiseFoodies',
  description: 'How WiseFoodies respects and protects consumer privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500">Effective Date: October 2026</p>
      </div>

      <div className="wf-card p-6 sm:p-8 space-y-6 bg-white text-sm text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">1. Information We Do Not Collect</h2>
          <p>
            WiseFoodies does not require user registration or logins to browse food reports, compare foods, or calculate Nutrition Per Paisa. We do not sell your personal data or browsing behavior to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">2. Camera & Barcode Scanner Usage</h2>
          <p>
            When you activate the grocery barcode scanner, video stream processing happens entirely locally inside your browser via client-side video frame recognition. No raw video feed or photos are uploaded to any server without your explicit submission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">3. User Reports & Feedback</h2>
          <p>
            If you submit a product correction or missing nutrition report via our Report an Issue form, we store the submitted product details and any optional email you choose to provide solely to follow up on label verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">4. Analytics & Cookies</h2>
          <p>
            We use minimal, anonymized telemetry strictly to monitor website uptime, performance, and identify missing barcodes in our food catalog.
          </p>
        </section>
      </div>
    </div>
  );
}
