import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles, Scale, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About WiseFoodies | Independent Food Intelligence',
  description:
    'Our mission to empower Indian grocery consumers with transparent nutritional facts, Food Benefit Scores, and honest food intelligence.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
          About Us
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
          Eat Smarter. Choose Better.
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          WiseFoodies is India&apos;s independent packaged-food intelligence platform. We decode confusing nutrition declarations and reveal what you are truly putting in your grocery basket.
        </p>
      </div>

      <div className="wf-card p-6 sm:p-8 space-y-4 bg-white">
        <h2 className="text-2xl font-extrabold text-stone-900">Why WiseFoodies Exists</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          For decades, Indian grocery shoppers have faced an asymmetrical battle against glossy packaging and aggressive marketing claims. Products labeled &ldquo;Multi-grain&rdquo; often contain 90% refined maida. Snacks claiming &ldquo;High Protein&rdquo; deliver 30 grams of sugar alongside negligible amino acids.
        </p>
        <p className="text-sm text-stone-700 leading-relaxed">
          WiseFoodies was created to give consumers an uncompromised, objective tool. We believe that nutritional literacy is a basic consumer right.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="wf-card p-6 space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-700 mb-2" />
          <h3 className="font-bold text-stone-900 text-base">Data Honesty</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We never fabricate numbers. If label data is missing, we openly state it is pending verification.
          </p>
        </div>

        <div className="wf-card p-6 space-y-2">
          <Scale className="w-8 h-8 text-emerald-700 mb-2" />
          <h3 className="font-bold text-stone-900 text-base">Zero Commercial Influence</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We do not accept payments from food corporations to improve scores or promote products.
          </p>
        </div>

        <div className="wf-card p-6 space-y-2">
          <Sparkles className="w-8 h-8 text-emerald-700 mb-2" />
          <h3 className="font-bold text-stone-900 text-base">Indian Guidelines</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All RDA benchmarks are calibrated against ICMR-NIN (National Institute of Nutrition, Hyderabad) adult metrics.
          </p>
        </div>
      </div>

      <div className="wf-card p-6 sm:p-8 bg-stone-900 text-white space-y-3">
        <h3 className="text-lg font-bold text-white">Join Our Mission</h3>
        <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
          WiseFoodies is continuously expanding its database of Indian supermarket foods. Scan barcodes, submit labels, and help build a healthier food landscape for every family in India.
        </p>
        <div className="pt-2">
          <Link
            href="/explore"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5"
          >
            Explore Food Database <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
