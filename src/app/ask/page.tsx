'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Trash2, ArrowUpRight, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { LOCALES } from '@/lib/i18n';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  matchedProducts?: Array<{ name: string; brand: string; slug: string; fbs: number }>;
}

export default function AskPage() {
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
    inputRef.current?.focus();
  }, []);

  const currentLocaleMeta = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  const suggestedPrompts = [
    { label: 'Maggi vs Yippee', prompt: 'Compare Maggi 2-Minute Noodles vs Sunfeast Yippee Noodles' },
    { label: 'Highest Protein Snack', prompt: 'Which snacks have the highest protein in the catalog?' },
    { label: 'Why Palm Oil is Bad', prompt: 'Why is palm oil penalized in the FBS score?' },
    { label: 'Sugar Limit for Diabetics', prompt: 'What are the FSSAI added sugar limits and healthy choices?' },
    { label: 'Healthy Breakfast Options', prompt: 'Show me healthy breakfast cereals with FBS > 7.0' },
    { label: 'Nutrition Per Paisa', prompt: 'Which foods give the most protein per rupee?' },
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
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.reply || t('common.error'),
          source: data.source,
          matchedProducts: data.matchedProducts || [],
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: t('common.error'),
          source: 'error',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 md:pt-32 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t('ai.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('ai.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {currentLocaleMeta.native} ({currentLocaleMeta.label})
          </span>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-secondary/50 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[650px]">
        {/* Messages Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  Ask anything about Indian packaged foods
                </h2>
                <p className="text-sm text-muted-foreground">
                  Compare brands, find high-protein snacks, decode ingredient labels, or understand FBS scores.
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.prompt)}
                    className="p-3 text-xs bg-secondary/50 hover:bg-secondary border border-border rounded-xl transition-all duration-150 hover:shadow-xs group flex items-start justify-between gap-2"
                  >
                    <span className="font-medium text-foreground">{p.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  1,135 Verified Products
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Grounded in FSSAI Standards
                </span>
                <span className="inline-flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Food Literacy, Not Medical Advice
                </span>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground font-medium rounded-br-xs'
                      : 'bg-secondary/70 text-foreground border border-border rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Matched product chips */}
                  {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                      {msg.matchedProducts.map((p, pIdx) => (
                        <Link
                          key={pIdx}
                          href={`/food/${p.slug}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-background hover:bg-secondary border border-border transition-colors"
                        >
                          <span>{p.name}</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-bold">
                            FBS {p.fbs}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-secondary/70 border border-border rounded-2xl rounded-bl-xs p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground font-medium">
                  {t('common.loading')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ai.placeholder')}
              className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            {t('ai.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
