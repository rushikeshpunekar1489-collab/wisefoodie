import { NextResponse } from 'next/server';
import { type Locale, isValidLocale } from '@/lib/i18n';
import { checkScope } from '@/lib/ai/scope';
import { getSystemPrompt } from '@/lib/ai/prompts';
import { getModel, hasGeminiKey } from '@/lib/ai/gemini';
import { generateOfflineResponse } from '@/lib/ai/offlineFallback';
import { tools } from '@/lib/ai/tools';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body?.message;
    const history = body?.history || [];
    const rawLocale = body?.locale;

    const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : 'en';

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Strict Scope Check
    const scopeResult = checkScope(message, locale);
    if (!scopeResult.inScope) {
      return NextResponse.json({
        answer: scopeResult.refusalText,
        source: 'scope_refusal',
        inScope: false,
      });
    }

    // 2. Try Gemini API if configured
    if (hasGeminiKey()) {
      try {
        const model = getModel();
        if (model) {
          // Pre-fetch relevant catalog documents to ground the prompt
          const searchResult = await tools.search_products.execute({ query: message, limit: 3 });
          const kbResult = await tools.query_knowledge_base.execute({ query: message });

          let groundingContext = '\n\nOFFICIAL WISEFOODIES CATALOG DATA:\n';
          if (searchResult.results && searchResult.results.length > 0) {
            groundingContext += searchResult.results.map((p: any) =>
              `- ${p.name} (${p.brand}): Category: ${p.category}, FBS: ${p.fbsScore}/100 (${p.fbsBand}), Protein: ${p.proteinG}g, Added Sugar: ${p.addedSugarG}g, Sodium: ${p.sodiumMg}mg, Price: ₹${p.priceINR || 'N/A'}`
            ).join('\n');
          } else {
            groundingContext += 'No exact product name match found in initial keyword search.\n';
          }

          if (kbResult.articles && kbResult.articles.length > 0) {
            groundingContext += '\n\nOFFICIAL FOOD LITERACY KB:\n';
            groundingContext += kbResult.articles.map((a: any) => `### ${a.title} - ${a.section}\n${a.content.slice(0, 400)}`).join('\n\n');
          }

          const systemPrompt = getSystemPrompt(locale);
          const fullPrompt = `${systemPrompt}${groundingContext}\n\nUser Question: ${message}`;

          // Format chat history
          const validHistory: { role: string; parts: { text: string }[] }[] = [];
          if (Array.isArray(history)) {
            const recent = history.slice(-6);
            for (const item of recent) {
              if (!item?.content) continue;
              const mappedRole = item.role === 'assistant' ? 'model' : 'user';
              if (validHistory.length === 0 && mappedRole !== 'user') continue;
              if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === mappedRole) continue;
              validHistory.push({
                role: mappedRole,
                parts: [{ text: item.content }],
              });
            }
            if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
              validHistory.pop();
            }
          }

          const chat = model.startChat({
            history: validHistory,
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.2, // Low temperature for factual precision
            },
          });

          const result = await chat.sendMessage(fullPrompt);
          const response = await result.response;
          const text = response.text();

          if (text && text.trim()) {
            return NextResponse.json({
              answer: text.trim(),
              source: 'gemini',
              inScope: true,
            });
          }
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed (falling back to deterministic catalog AI):', geminiError?.message || geminiError);
        // Seamlessly proceed to deterministic offline fallback below
      }
    }

    // 3. Deterministic Catalog Knowledge Base Fallback
    const offlineRes = await generateOfflineResponse(message, locale);
    return NextResponse.json({
      answer: offlineRes.answer,
      source: offlineRes.source,
      inScope: true,
      matchedProducts: offlineRes.matchedProducts,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    // Never crash or return raw 500
    const safeRefusal = checkScope('', 'en').refusalText;
    return NextResponse.json(
      {
        answer: "I couldn't process that query right now. Please try searching for a product or category directly.",
        source: 'error_fallback',
        inScope: true,
      },
      { status: 200 }
    );
  }
}
