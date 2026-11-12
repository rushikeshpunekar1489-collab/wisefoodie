'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PackagingDeceptions() {
  const [activeTrap, setActiveTrap] = useState<number>(0);

  const traps = [
    {
      id: 0,
      title: 'The Hidden Sugar Alias Game',
      subtitle: 'Liquid glucose, maltodextrin & invert syrup',
      icon: 'nutrition',
      claim: '"Zero Added White Sugar*"',
      reality:
        'Brands replace ordinary cane sugar with industrial high-glycemic substitutes like maltodextrin (GI > 105), apple juice concentrate, and invert sugar syrup. To your liver and insulin receptors, it causes the exact same metabolic spike.',
      evidence:
        'Found in over 68% of Indian "healthy" breakfast cereals, kids milk powders, and digestive biscuits.',
      tip: 'Look for ingredients ending in "-ose", "-ol", or listed as hydrolyzed starch.',
    },
    {
      id: 1,
      title: 'The "Made with Whole Wheat" Illusion',
      subtitle: 'Atta on the front, 85% maida in the ingredients',
      icon: 'grain',
      claim: '"Goodness of 100% Atta & Fibre"',
      reality:
        'Under legal loophole guidelines, adding as little as 5% to 15% whole wheat flour allows packaging designers to plaster "Wheat" in 72pt font across the front billboard.',
      evidence:
        'Verified in instant noodles, sandwich breads, and bakery rusks across major supermarkets.',
      tip: 'The first ingredient on the back label is always the highest by weight. If Refined Wheat Flour (Maida) appears first, it is predominantly maida.',
    },
    {
      id: 2,
      title: 'The Artificial Serving Size Trick',
      subtitle: 'Making dangerous sodium and sugar numbers look tiny',
      icon: 'straighten',
      claim: '"Only 35 Calories per Serving!"',
      reality:
        'Companies declare an absurdly miniature serving size — such as 15g or 3 biscuits — for an 80g snack bag that any normal person consumes in one sitting.',
      evidence:
        'Single-serving instant noodles declaring "Per 30g prepared" when the cake itself weighs 70g.',
      tip: 'Always evaluate the "Per 100g" column to judge the true baseline concentration.',
    },
    {
      id: 3,
      title: 'The Palm Oil & Trans-Fat Euphemism',
      subtitle: '"Edible Vegetable Oil" masks cheap hydrogenated fat',
      icon: 'water_drop',
      claim: '"Zero Cholesterol & 100% Vegetable Fat"',
      reality:
        'All plant oils are naturally 100% cholesterol-free. Claiming "Zero Cholesterol" on palm olein is marketing deflection. Palm oil is 50% saturated fat and heavily refined.',
      evidence:
        'Over 80% of packaged Indian potato chips, biscuits, and extruded snacks rely on palmolein as their primary fat.',
      tip: 'Check for "Interesterified Vegetable Fat" or "Hydrogenated Vegetable Oils" on the back declaration.',
    },
  ];

  return (
    <section className="container max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl bg-surface-container-lowest p-6 sm:p-10 border border-outline-variant/40 shadow-xs space-y-8">
        {/* Section Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-caps uppercase tracking-wider bg-error-container text-on-error-container border border-error/20">
            <span className="material-symbols-outlined text-sm text-error">warning</span>
            <span>FORENSIC EXPOSÉ</span>
          </div>
          <h2 className="font-headline-md text-2xl sm:text-3xl text-primary font-serif">
            The 4 Packaging Traps
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant max-w-2xl">
            Our forensic team cross-references packaging claims against legal FSSAI Labelling Regulations (2020), identifying misleading asterisk exemptions, serving-size trickery, and hidden class titles.
          </p>
        </div>

        {/* 4 Tabs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {traps.map((trap) => {
            const isActive = activeTrap === trap.id;
            return (
              <button
                key={trap.id}
                type="button"
                onClick={() => setActiveTrap(trap.id)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-primary-fixed text-on-primary-fixed border-primary font-bold shadow-xs'
                    : 'bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-xl mb-1 block">
                  {trap.icon}
                </span>
                <span className="font-label-lg text-xs line-clamp-1 block">
                  {trap.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Trap Detailed Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-surface-container-low border border-outline-variant/30 items-center">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="font-label-caps text-xs text-error font-bold uppercase tracking-wider">
                DECEPTION PATTERN #{traps[activeTrap].id + 1}
              </span>
              <h3 className="font-headline-sm text-lg sm:text-xl text-primary">
                {traps[activeTrap].title}
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                {traps[activeTrap].subtitle}
              </p>
            </div>

            <div className="p-3 rounded-md bg-secondary-fixed/20 border border-secondary/30">
              <span className="font-label-caps text-[0.625rem] text-secondary uppercase font-bold block mb-1">
                Typical Front Packaging Slogan
              </span>
              <p className="font-serif italic font-bold text-sm text-primary">
                {traps[activeTrap].claim}
              </p>
            </div>

            <div className="p-3 rounded-md bg-surface-container-lowest border border-outline-variant/30 space-y-1.5">
              <span className="font-label-caps text-[0.625rem] text-error uppercase font-bold block">
                The Forensic Scientific Reality
              </span>
              <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                {traps[activeTrap].reality}
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/30">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-label-caps text-xs text-primary font-bold uppercase">
                <span className="material-symbols-outlined text-sm text-primary">description</span>
                <span>Forensic Evidence Database</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                {traps[activeTrap].evidence}
              </p>
            </div>

            <div className="p-3 rounded-md bg-primary-fixed/20 border border-primary/20 space-y-1">
              <div className="flex items-center gap-1.5 font-label-caps text-xs text-primary font-bold uppercase">
                <span className="material-symbols-outlined text-sm text-primary">tips_and_updates</span>
                <span>Forensic Shopping Rule</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                {traps[activeTrap].tip}
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-label-caps text-primary font-bold hover:underline pt-1"
            >
              <span>Scan products in catalog for this pattern &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
