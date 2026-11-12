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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full">
          About WiseFoodies
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-primary tracking-tight">
          Eat Smarter. Choose Better.
        </h1>
        <p className="text-base text-on-surface-variant font-medium leading-relaxed">
          WiseFoodies is India&apos;s independent packaged-food intelligence platform. We decode confusing nutrition declarations and reveal what you are truly putting in your grocery basket.
        </p>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="font-serif font-bold text-2xl text-primary">Why WiseFoodies Exists</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
          For decades, Indian grocery shoppers have faced an asymmetrical battle against glossy packaging and aggressive marketing claims. Products labeled &ldquo;Multi-grain&rdquo; often contain 90% refined maida. Snacks claiming &ldquo;High Protein&rdquo; deliver 30 grams of sugar alongside negligible amino acids.
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
          WiseFoodies was created to give consumers an uncompromised, objective tool. We believe that nutritional literacy is a basic consumer right.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 space-y-2 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-primary mb-2" />
          <h3 className="font-serif font-bold text-primary text-base">Data Honesty</h3>
          <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
            We never fabricate numbers. If label data is missing, we openly state it is pending verification.
          </p>
        </div>

        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 space-y-2 shadow-sm">
          <Scale className="w-8 h-8 text-primary mb-2" />
          <h3 className="font-serif font-bold text-primary text-base">Zero Commercial Influence</h3>
          <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
            We do not accept payments from food corporations to improve scores or promote products.
          </p>
        </div>

        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 space-y-2 shadow-sm">
          <Sparkles className="w-8 h-8 text-primary mb-2" />
          <h3 className="font-serif font-bold text-primary text-base">Indian Guidelines</h3>
          <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
            All RDA benchmarks are calibrated against ICMR-NIN (National Institute of Nutrition, Hyderabad) adult metrics.
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 bg-surface-container-low border border-outline-variant/30 space-y-3">
        <h2 className="font-serif font-bold text-xl text-primary">Disclaimer &amp; Public Trust</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
          WiseFoodies is not an e-commerce platform, nor do we sell food products. We provide informational and educational intelligence based on declared manufacturer labels. Always consult a certified dietitian or medical professional for specific dietary therapy or clinical nutritional needs.
        </p>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/products"
          className="py-3 px-6 rounded-full bg-primary text-on-primary text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
        >
          Explore 852 Indian Foods <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
