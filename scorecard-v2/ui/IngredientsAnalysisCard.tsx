'use client';

import React, { useState } from 'react';
import type { IngredientAnalysisResult, ParsedIngredient } from '../modules/ingredients-analysis/types';
import {
  Sparkles,
  Info,
  X,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  Layers,
  Search,
  Eye,
  FileText,
  BadgeAlert,
} from 'lucide-react';

interface IngredientsAnalysisCardProps {
  analysis: IngredientAnalysisResult;
}

export default function IngredientsAnalysisCard({ analysis }: IngredientsAnalysisCardProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<ParsedIngredient | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'sugars' | 'additives' | 'allergens' | 'takeaway'>('all');

  const {
    parsedIngredients,
    topThreeIngredients,
    hiddenSugars,
    additivesList,
    declaredAllergens,
    precautionaryAllergens,
    transparencyFlags,
    unknownIngredients,
    consumerTakeaway,
  } = analysis;

  if (!parsedIngredients || parsedIngredients.length === 0) {
    return (
      <div className="bubble-card border-dashed bg-[var(--surface-alt)] opacity-80 text-center py-6">
        <p className="t-small opacity-70">Ingredient declaration awaiting manufacturer disclosure.</p>
      </div>
    );
  }

  const COLLAPSED_LIMIT = 8;
  const hasMore = parsedIngredients.length > COLLAPSED_LIMIT;
  const displayedIngredients =
    isExpanded || !hasMore ? parsedIngredients : parsedIngredients.slice(0, COLLAPSED_LIMIT);

  return (
    <div className="bubble-card space-y-6 bg-[var(--surface)]">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[var(--ink)]/15">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-[var(--berry)]" />
            <h3 className="t-h3 text-[var(--ink)]">Ingredient Analysis</h3>
          </div>
          <p className="text-xs font-semibold opacity-75">
            Decoded formulation, weight order, hidden sugars, additives, and allergen alerts.
          </p>
        </div>
        <span className="chip text-xs py-0.5 px-2.5 bg-[var(--surface-alt)] self-start sm:self-center">
          {parsedIngredients.length} Declared Ingredients
        </span>
      </div>

      {/* 2. Top 3 Ingredients & Order Intelligence Banner */}
      <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-[var(--ink)]">
          <Eye className="w-4 h-4 text-[var(--leaf)]" />
          <span>Top 3 Ingredients by Bulk Weight</span>
        </div>
        <p className="text-xs opacity-75 font-semibold">
          FSSAI packaging rules mandate that ingredients must be declared in descending order of weight at the time of manufacture.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {topThreeIngredients.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[var(--surface)] border-2 border-[var(--ink)] flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black uppercase opacity-60 block">
                  #{idx + 1} by Weight
                </span>
                <span className="font-extrabold text-sm text-[var(--ink)] block mt-0.5">
                  {item.cleanName}
                  {item.declaredPercentage && (
                    <span className="ml-1 text-xs text-[var(--leaf)]">({item.declaredPercentage})</span>
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.indicatorTags.slice(0, 2).map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] chip py-0 px-1.5 bg-[var(--surface-alt)]">
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`btn-chunky text-xs py-1.5 px-3 min-h-[44px] ${
            activeTab === 'all' ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-alt)] text-[var(--ink)]'
          }`}
        >
          All Ingredients ({parsedIngredients.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sugars')}
          className={`btn-chunky text-xs py-1.5 px-3 min-h-[44px] ${
            activeTab === 'sugars' ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-alt)] text-[var(--ink)]'
          }`}
        >
          Sugar & Starch ({hiddenSugars.totalSugarCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('additives')}
          className={`btn-chunky text-xs py-1.5 px-3 min-h-[44px] ${
            activeTab === 'additives' ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-alt)] text-[var(--ink)]'
          }`}
        >
          Additives & INS ({additivesList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('allergens')}
          className={`btn-chunky text-xs py-1.5 px-3 min-h-[44px] ${
            activeTab === 'allergens' ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-alt)] text-[var(--ink)]'
          }`}
        >
          Allergens ({declaredAllergens.length + precautionaryAllergens.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('takeaway')}
          className={`btn-chunky text-xs py-1.5 px-3 min-h-[44px] ${
            activeTab === 'takeaway' ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-alt)] text-[var(--ink)]'
          }`}
        >
          Consumer Takeaway
        </button>
      </div>

      {/* 4. Tab Content */}
      {/* TAB A: ALL INGREDIENTS PILLS & EXPANDER */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold opacity-75">
            <span>Tap any ingredient pill for detailed explanation and technological function:</span>
            {hasMore && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-black text-[var(--leaf)] hover:underline ml-2"
              >
                {isExpanded ? 'Show fewer' : `Show all (${parsedIngredients.length})`}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {displayedIngredients.map((item, idx) => {
              const isBeneficial = item.indicatorTags.some((t) => t.id === 'nutritionally-beneficial');
              const isSugar = item.indicatorTags.some((t) => t.id === 'added-sugar');
              const isFat = item.indicatorTags.some((t) => t.id === 'fat-source');
              const isAllergen = item.indicatorTags.some((t) => t.id === 'potential-allergen');

              const pillBg = isBeneficial
                ? 'bg-[var(--mint)]'
                : isSugar
                ? 'bg-[var(--tomato)]/15 border-[var(--tomato)]'
                : isFat
                ? 'bg-[var(--mango)]/20 border-[var(--mango)]'
                : 'bg-[var(--surface-alt)]';

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIngredient(item)}
                  className={`btn-chunky text-xs py-1.5 px-3 min-h-[44px] border-2 border-[var(--ink)] transition-transform hover:scale-[1.02] flex items-center gap-1.5 ${pillBg}`}
                >
                  <span>{item.cleanName}</span>
                  {item.declaredPercentage && (
                    <span className="text-[10px] font-bold opacity-75">({item.declaredPercentage})</span>
                  )}
                  {item.insCode && (
                    <span className="text-[10px] chip py-0 px-1 bg-[var(--surface)]">INS {item.insCode}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Transparency Flags if any */}
          {transparencyFlags.length > 0 && (
            <div className="p-3 rounded-xl bg-[var(--mango)]/10 border-2 border-[var(--mango)] space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-black text-[var(--ink)]">
                <AlertTriangle className="w-4 h-4 text-[var(--mango)]" />
                <span>Ingredient Transparency Notes</span>
              </div>
              <ul className="space-y-1 list-disc ml-5 font-semibold opacity-85">
                {transparencyFlags.map((tf, idx) => (
                  <li key={idx}>
                    <strong>{tf.issue}:</strong> {tf.explanation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB B: HIDDEN SUGAR & MALTODEXTRIN */}
      {activeTab === 'sugars' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] space-y-2">
            <span className="font-black text-sm text-[var(--ink)] block">
              Added Sugar Sources Detected: {hiddenSugars.totalSugarCount}
            </span>
            {hiddenSugars.hasMultipleSugars ? (
              <p className="font-semibold text-[var(--tomato)] leading-relaxed">
                Multiple added sugar sources detected ({hiddenSugars.distinctSugarSources.join(', ')}). Using multiple distinct forms of sugar allows manufacturers to disperse simple sugars across the ingredients list.
              </p>
            ) : hiddenSugars.totalSugarCount === 1 ? (
              <p className="font-semibold opacity-80">
                Single added sugar source identified: <strong>{hiddenSugars.distinctSugarSources[0]}</strong>.
              </p>
            ) : (
              <p className="font-semibold opacity-80 text-[var(--leaf)]">
                No conventional added sugar aliases detected in the ingredients list.
              </p>
            )}
          </div>

          {/* Separate Maltodextrin Block (Mandatory Section 7.2 C) */}
          <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-[var(--ink)]">
              <FileText className="w-4 h-4 text-[var(--sky)]" />
              <span>Maltodextrin Identification</span>
            </div>
            {hiddenSugars.maltodextrinDetected ? (
              <div className="p-3 rounded-xl bg-[var(--mango)]/15 border border-[var(--mango)] space-y-1">
                <span className="font-black text-[var(--ink)]">Maltodextrin is Present</span>
                <p className="font-semibold opacity-85 leading-relaxed">
                  {hiddenSugars.maltodextrinNote}
                </p>
              </div>
            ) : (
              <p className="font-semibold opacity-75">
                No maltodextrin detected in this product.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB C: ADDITIVE AWARENESS */}
      {activeTab === 'additives' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/20">
            <p className="font-semibold opacity-80 leading-relaxed">
              <strong>Objective Additive Policy:</strong> Food additives serve vital technological functions (such as preventing rancidity, microbial spoilage, and emulsion separation). They are evaluated by international safety panels (JECFA/WHO) and regulated by FSSAI under strict maximum limits. Presence of an additive does not equal acute harm.
            </p>
          </div>

          {additivesList.length > 0 ? (
            <div className="space-y-2.5">
              {additivesList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] space-y-1.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-black text-sm text-[var(--ink)]">
                      {item.cleanName}
                    </span>
                    {item.insCode && (
                      <span className="chip text-[10px] bg-[var(--surface)] border border-[var(--ink)]/20 py-0.5 px-2 font-black">
                        INS {item.insCode}
                      </span>
                    )}
                  </div>
                  {item.libraryMatch ? (
                    <>
                      <p className="font-semibold opacity-85">{item.libraryMatch.plainExplanation}</p>
                      <div className="text-[11px] opacity-75 pt-1 space-y-0.5">
                        <div><strong>Why used:</strong> {item.libraryMatch.whyUsed}</div>
                        <div><strong>Function:</strong> {item.libraryMatch.function}</div>
                        {item.libraryMatch.fssaiNote && (
                          <div className="text-[var(--leaf)] font-bold">
                            <strong>FSSAI Reference:</strong> {item.libraryMatch.fssaiNote}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="font-semibold opacity-60 italic">
                      Food additive awaiting detailed WiseFoodies library index.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="p-4 text-center opacity-60 italic">
              No declared synthetic additives or INS numbers registered in this product.
            </p>
          )}
        </div>
      )}

      {/* TAB D: ALLERGEN ALERTS (Declared vs Precautionary Strictly Separated) */}
      {activeTab === 'allergens' && (
        <div className="space-y-4 text-xs">
          {/* Declared Allergens: Strong Alert */}
          <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-[var(--tomato)]">
              <BadgeAlert className="w-5 h-5 shrink-0" />
              <span>Declared Recipe Allergens (Direct Ingredient)</span>
            </div>
            {declaredAllergens.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {declaredAllergens.map((alg, idx) => (
                  <span
                    key={idx}
                    className="chip text-xs py-1 px-3 bg-[var(--tomato)] text-white font-black"
                  >
                    ⚠️ Contains {alg}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-semibold opacity-75 text-[var(--leaf)]">
                No major standard food allergens directly declared in recipe formulation.
              </p>
            )}
          </div>

          {/* Precautionary Cross-Contact: Weaker Notice */}
          <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] space-y-2">
            <div className="flex items-center gap-2 font-black text-xs text-[var(--mango)]">
              <Info className="w-4 h-4 shrink-0" />
              <span>Precautionary Advisory (&ldquo;May Contain&rdquo; / Facility Cross-Contact)</span>
            </div>
            {precautionaryAllergens.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {precautionaryAllergens.map((alg, idx) => (
                  <span
                    key={idx}
                    className="chip text-xs py-0.5 px-2.5 bg-[var(--surface)] border border-[var(--ink)]/30 text-[var(--ink)] font-bold"
                  >
                    May Contain: {alg}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-semibold opacity-60 italic">
                No separate precautionary cross-contact statements declared on packaging.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB E: CONSUMER TAKEAWAY */}
      {activeTab === 'takeaway' && (
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] space-y-3">
            <div className="flex items-center gap-2 font-black text-sm text-[var(--ink)]">
              <Sparkles className="w-4 h-4 text-[var(--leaf)]" />
              <span>What Should You Know Before Buying?</span>
            </div>

            <div className="space-y-2">
              {consumerTakeaway.keyObservations.map((obs, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--ink)]/15">
                  <span className="font-black text-[var(--leaf)] shrink-0">#{idx + 1}</span>
                  <span className="font-semibold leading-relaxed">{obs}</span>
                </div>
              ))}
            </div>

            {consumerTakeaway.worthAttention.length > 0 && (
              <div className="pt-2 border-t border-[var(--ink)]/15 space-y-1.5">
                <span className="font-black uppercase text-[10px] opacity-70 block">
                  Items Worth Attention:
                </span>
                <ul className="space-y-1 list-disc ml-5 font-semibold opacity-85">
                  {consumerTakeaway.worthAttention.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 rounded-xl bg-[var(--mint)] border-2 border-[var(--ink)] text-[var(--ink)] font-extrabold text-xs">
              Takeaway: {consumerTakeaway.friendlyInterpretation}
            </div>
          </div>
        </div>
      )}

      {/* 5. Ingredient Detail Modal */}
      {selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bubble-card max-w-lg w-full bg-[var(--surface)] border-3 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--ink)]/15">
              <div className="space-y-0.5">
                <h4 className="t-h3 text-base text-[var(--ink)]">
                  {selectedIngredient.cleanName}
                </h4>
                {selectedIngredient.insCode && (
                  <span className="chip text-[10px] bg-[var(--surface-alt)] py-0 px-2 font-bold">
                    INS {selectedIngredient.insCode}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedIngredient(null)}
                className="btn-chunky p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-[var(--surface-alt)]"
              >
                <X className="w-5 h-5 text-[var(--ink)]" />
              </button>
            </div>

            {selectedIngredient.libraryMatch ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-black text-[var(--ink)] block mb-0.5">What is it?</span>
                  <p className="font-semibold opacity-85 leading-relaxed">
                    {selectedIngredient.libraryMatch.plainExplanation}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[var(--surface-alt)]">
                  <div>
                    <span className="font-black opacity-70 block text-[10px] uppercase">Why Used</span>
                    <span className="font-bold text-[var(--ink)]">{selectedIngredient.libraryMatch.whyUsed}</span>
                  </div>
                  <div>
                    <span className="font-black opacity-70 block text-[10px] uppercase">Function</span>
                    <span className="font-bold text-[var(--ink)]">{selectedIngredient.libraryMatch.function}</span>
                  </div>
                </div>

                <div>
                  <span className="font-black text-[var(--ink)] block mb-0.5">Consumer Note:</span>
                  <p className="font-semibold opacity-85 leading-relaxed">
                    {selectedIngredient.libraryMatch.consumerNote}
                  </p>
                </div>

                {selectedIngredient.libraryMatch.fssaiNote && (
                  <div className="p-2.5 rounded-xl bg-[var(--mint)] border border-[var(--ink)]/20 text-[11px] font-bold text-[var(--leaf)]">
                    FSSAI Regulation: {selectedIngredient.libraryMatch.fssaiNote}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs space-y-2 opacity-80">
                <p>
                  <strong>{selectedIngredient.cleanName}</strong> is a recipe ingredient currently pending detailed indexing in the WiseFoodies library.
                </p>
                <p className="italic text-[11px]">
                  No negative assumption is made for unindexed ingredients.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedIngredient(null)}
              className="w-full btn-chunky bg-[var(--ink)] text-white text-xs py-2 min-h-[44px]"
            >
              Close Ingredient Details
            </button>
          </div>
        </div>
      )}

      {/* Module Footer Tagline */}
      <div className="pt-2 text-center border-t border-[var(--ink)]/10 text-xs font-semibold opacity-60">
        &ldquo;Eat what you enjoy. Understand what you consume. Know what you pay for. Make smarter food choices.&rdquo;
      </div>
    </div>
  );
}
