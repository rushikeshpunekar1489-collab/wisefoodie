import React from 'react';
import type { Metadata } from 'next';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Medical & Regulatory Disclaimer | WiseFoodies',
  description:
    'Full transparency and medical disclaimer regarding the Food Benefit Score and packaged food intelligence.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/15 px-3 py-1 rounded-full">
          Regulatory Notice &middot; FSSAI &amp; ICMR-NIN Compliance
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary tracking-tight">
          Medical &amp; Food Disclaimer
        </h1>
        <p className="text-sm text-outline font-medium">
          Last updated: October 2026 &middot; Botanical Consumer Intelligence Protocol
        </p>
      </div>

      <div className="rounded-2xl border border-secondary/30 p-6 sm:p-8 bg-secondary/5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-secondary">
          <ShieldAlert className="w-5 h-5 text-secondary" />
          <h2 className="font-serif font-bold text-lg text-primary">Important Notice For All Consumers</h2>
        </div>
        <p className="text-sm text-on-surface leading-relaxed font-semibold">
          The Food Benefit Score (FBS) is an informational evaluation derived deterministically from declared manufacturer label data and standard nutritional guidelines. It is not medical advice, clinical dietary prescription, or a guarantee of health outcomes.
        </p>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 p-6 sm:p-8 space-y-6 bg-surface-container-lowest text-sm text-on-surface-variant leading-relaxed shadow-sm font-medium">
        <section className="space-y-2">
          <h3 className="font-serif font-bold text-primary text-base">1. Not Medical or Clinical Advice</h3>
          <p>
            The content, scores, and comparisons on WiseFoodies are provided strictly for general consumer educational purposes. WiseFoodies does not make disease prevention, treatment, cure, or detoxification claims. If you have medical conditions such as diabetes, cardiovascular disease, kidney conditions, hypertension, or food allergies, consult a qualified medical professional or registered clinical dietitian.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-primary text-base">2. Label Data Dependence &amp; Disclaimers</h3>
          <p>
            All evaluations rely upon information printed on packaging or declared by manufacturers according to Food Safety and Standards Authority of India (FSSAI) guidelines. Formulations, ingredients, and nutritional declarations may change without prior notice. While we endeavor to keep our database accurate, WiseFoodies cannot guarantee that manufacturer label statements are free of printing errors or formulation alterations.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-primary text-base">3. Allergen Notice</h3>
          <p>
            Always examine the physical package label for allergen warnings (e.g., presence of gluten, nuts, soy, dairy, or sulfites) prior to consumption. Do not rely solely on digital platforms for severe allergen safety.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-primary text-base">4. Independent Platform</h3>
          <p>
            WiseFoodies operates independently of all consumer goods companies, advertisers, and supermarket retail chains. Mention of brand names, products, or packaging is done for consumer education, comparative evaluation, and public health awareness under applicable fair dealing laws.
          </p>
        </section>
      </div>
    </div>
  );
}
