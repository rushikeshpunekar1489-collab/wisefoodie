'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Trash2, ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { LOCALES } from '@/lib/i18n';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  matchedProducts?: Array<{ name: string; brand: string; slug: string; fbs: number }>;
}

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { locale, t } = useI18n();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const currentLocaleMeta = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  const suggestedPrompts = [
    { label: 'Maggi vs Yippee', prompt: 'Compare Maggi 2-Minute Noodles vs Sunfeast Yippee Noodles' },
    { label: 'Highest Protein Snack', prompt: 'Which snacks have the highest protein in the catalog?' },
    { label: 'Why Palm Oil is Bad', prompt: 'Why is palm oil penalized in the FBS score?' },
    { label: 'Sugar Limit for Diabetics', prompt: 'What are the FSSAI added sugar limits and healthy choices?' },
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || "I couldn't find an exact answer. Please try searching another product.",
          source: data.source,
          matchedProducts: data.matchedProducts,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I had trouble processing that request. Please try asking again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside
      aria-label="Ask WiseFoodies Chatbot"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 font-sans"
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Ask WiseFoodies AI Assistant"
          title="Ask WiseFoodies AI"
          className="btn-chunky bg-[var(--leaf)] hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-[4px_4px_0px_var(--ink)] hover:shadow-[5px_5px_0px_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center group"
        >
          <Bot className="w-6 h-6 stroke-[2.2] group-hover:scale-110 transition-transform" />
          <span className="sr-only">Ask WiseFoodies</span>
        </button>
      ) : (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="WiseFoodies AI Chat Assistant"
          className="bg-[var(--surface)] text-[var(--ink)] w-[92vw] sm:w-[420px] h-[520px] max-h-[80vh] rounded-2xl border-3 border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] flex flex-col overflow-hidden animate-scale-up"
        >
          {/* Header */}
          <div className="bg-[var(--leaf)] text-white p-3.5 px-4 flex items-center justify-between border-b-2 border-[var(--ink)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-wide flex items-center gap-1.5 leading-tight">
                  <span>Ask WiseFoodies</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[var(--leaf)] font-bold">
                    {currentLocaleMeta.code.toUpperCase()}
                  </span>
                </h3>
                <p className="text-[11px] text-white/80">Catalog-Grounded Food Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  aria-label="Clear chat"
                  title="Clear chat"
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-all text-white/80 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-all text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[var(--surface-alt)]">
            {messages.length === 0 && (
              <div className="py-4 px-2 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[var(--mint)] border-2 border-[var(--ink)] text-[var(--leaf)] mx-auto flex items-center justify-center shadow-[2px_2px_0px_var(--ink)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-[var(--ink)]">
                    Ask anything about packaged food!
                  </h4>
                  <p className="text-xs text-[var(--ink)] opacity-70 mt-1 max-w-[280px] mx-auto">
                    Compare items, decode nutrition labels, or discover healthier alternatives.
                  </p>
                </div>

                {/* Suggested Prompts */}
                <div className="space-y-1.5 text-left pt-2">
                  <p className="text-[11px] font-bold text-[var(--ink)] opacity-60 uppercase tracking-wider px-1">
                    Try asking:
                  </p>
                  {suggestedPrompts.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(s.prompt)}
                      className="w-full text-left p-2 px-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--cream)] border border-[var(--ink)]/30 hover:border-[var(--ink)] text-xs font-semibold text-[var(--ink)] transition-all flex items-center justify-between group shadow-xs"
                    >
                      <span className="truncate">{s.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] ${
                    m.role === 'user'
                      ? 'bg-[var(--leaf)] text-white rounded-br-xs font-medium'
                      : 'bg-[var(--surface)] text-[var(--ink)] rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans break-words">{m.content}</div>

                  {/* Render Product Cards if available */}
                  {m.matchedProducts && m.matchedProducts.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--ink)]/20 space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-wider opacity-60">Products Mentioned:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.matchedProducts.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/product/${p.slug}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface-alt)] border border-[var(--ink)] text-[11px] font-bold text-[var(--ink)] hover:bg-[var(--mint)] transition-colors"
                          >
                            <span>{p.name}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--ink)] text-white font-mono">
                              FBS {p.fbs}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[var(--surface)] p-2.5 px-3.5 rounded-2xl border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] rounded-bl-xs flex items-center gap-2 text-xs font-bold text-[var(--leaf)]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking & verifying label data...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[var(--surface)] border-t-2 border-[var(--ink)] space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any product or ingredient..."
                aria-label="Ask WiseFoodies AI query"
                disabled={isLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] text-xs sm:text-sm font-semibold text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--leaf)] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="p-2 sm:p-2.5 rounded-xl bg-[var(--leaf)] text-white border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] hover:shadow-[3px_3px_0px_var(--ink)] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
            <p className="text-[9px] text-center text-[var(--ink)] opacity-60">
              FBS is an informational food literacy score, not medical advice.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
