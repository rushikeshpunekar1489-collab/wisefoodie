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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
          Regulatory Notice
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Medical & Food Disclaimer
        </h1>
        <p className="text-sm text-stone-500">
          Last updated: October 2026
        </p>
      </div>

      <div className="wf-card p-6 sm:p-8 bg-amber-50/50 border-amber-200/80 space-y-4">
        <div className="flex items-center gap-2 text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <h2 className="text-lg font-bold">Important Notice For All Users</h2>
        </div>
        <p className="text-sm text-stone-800 leading-relaxed font-semibold">
          The Food Benefit Score (FBS) is an informational evaluation derived deterministically from declared manufacturer label data and standard nutritional guidelines. It is not medical advice, clinical dietary prescription, or a guarantee of health outcomes.
        </p>
      </div>

      <div className="wf-card p-6 sm:p-8 space-y-6 bg-white text-sm text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-extrabold text-stone-900 text-base">1. Not Medical or Clinical Advice</h3>
          <p>
            The content, scores, and comparisons on WiseFoodies are provided strictly for general consumer educational purposes. WiseFoodies does not make disease prevention, treatment, cure, or detoxification claims. If you have medical conditions such as diabetes, cardiovascular disease, kidney conditions, hypertension, or food allergies, consult a qualified medical professional or registered clinical dietitian.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-extrabold text-stone-900 text-base">2. Label Data Dependence & Disclaimers</h3>
          <p>
            All evaluations rely upon information printed on packaging or declared by manufacturers according to Food Safety and Standards Authority of India (FSSAI) guidelines. Formulations, ingredients, and nutritional declarations may change without prior notice. While we endeavor to keep our database accurate, WiseFoodies cannot guarantee that manufacturer label statements are free of printing errors or formulation alterations.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-extrabold text-stone-900 text-base">3. Allergen Notice</h3>
          <p>
            Always examine the physical package label for allergen warnings (e.g., presence of gluten, nuts, soy, dairy, or sulfites) prior to consumption. Do not rely solely on digital platforms for severe allergen safety.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-extrabold text-stone-900 text-base">4. Independent Platform</h3>
          <p>
            WiseFoodies is an independent platform and is not affiliated with, sponsored by, or endorsed by any food or beverage manufacturer. Trademarks, brand names, and logos are the property of their respective owners and are referenced strictly for identification, consumer information, and fair use.
          </p>
        </section>
      </div>
    </div>
  );
}
