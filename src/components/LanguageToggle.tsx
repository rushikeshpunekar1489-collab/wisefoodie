'use client';

import React, { useState } from 'react';
import { useI18n } from '@/context/I18nContext';
import { LOCALES } from '@/lib/i18n';
import { Globe, ChevronDown } from 'lucide-react';
import LanguageSelectorModal from './LanguageSelectorModal';

interface LanguageToggleProps {
  compact?: boolean;
}

export default function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { locale } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  const currentLocaleMeta = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={modalOpen}
        aria-label={`Current language: ${currentLocaleMeta.label} (${currentLocaleMeta.native}). Click to change language.`}
        title="Change Language / भाषा बदलें"
        className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-[var(--surface-alt)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] hover:shadow-[3px_3px_0px_var(--ink)] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black transition-all cursor-pointer group"
      >
        <span className="text-[var(--leaf)] group-hover:rotate-12 transition-transform" aria-hidden="true">
          <Globe className="w-3.5 h-3.5" />
        </span>
        <span className="text-[var(--ink)] tracking-wide">
          {currentLocaleMeta.native}
        </span>
        <ChevronDown className="w-3 h-3 text-[var(--ink)] opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      <LanguageSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
