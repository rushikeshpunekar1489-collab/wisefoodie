import { NextResponse } from 'next/server';
import { getModel } from '../../../../lib/ai/gemini';
import { AGENT_SYSTEM_PROMPT } from '../../../../lib/ai/prompts';
import { getAllProducts } from '../../../../lib/products';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = getModel();

    // Search local database for relevant products to ground the AI response
    let productContext = '';
    try {
      const allProducts = await getAllProducts();
      const normalizedQuery = message.toLowerCase();
      
      // Extract keywords (longer than 2 characters, exclude common stopwords)
      const stopWords = new Set(['what', 'which', 'about', 'tell', 'show', 'food', 'score', 'healthy', 'product', 'snack', 'have', 'does', 'with', 'from', 'good', 'best', 'more']);
      const queryWords = normalizedQuery
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

      const matched = allProducts.filter(p => {
        const nameLower = p.name.toLowerCase();
        const brandLower = p.brand.toLowerCase();
        const catLower = (p.category || '').toLowerCase();

        // Exact match or contains query
        if (nameLower.includes(normalizedQuery) || brandLower.includes(normalizedQuery)) return true;

        // Keyword matches
        return queryWords.some(w => nameLower.includes(w) || brandLower.includes(w) || catLower.includes(w));
      }).slice(0, 4);

      if (matched.length > 0) {
        productContext = '\n\nRELEVANT PRODUCTS FOUND IN DATABASE:\n' + matched.map(p => `
- ${p.name} (${p.brand})
  Category: ${p.category} - ${p.subcategory}
  FBS Score: ${p.fbs.score}/10 (${p.fbs.band})
  Per 100g: ${p.per100g.energyKcal} kcal, ${p.per100g.proteinG}g protein, ${p.per100g.addedSugarG}g added sugar, ${p.per100g.sodiumMg}mg sodium
  Key Ingredients: ${p.ingredients.slice(0, 8).join(', ')}
  Score Factors: ${p.fbs.breakdown.slice(0, 4).map(b => `${b.factor} (${b.points > 0 ? '+' : ''}${b.points} pts: ${b.reason})`).join('; ')}
`).join('\n');
      }
    } catch (err) {
      console.warn('Product search error in chat route:', err);
    }

    // Format history if provided
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
      },
    });

    const fullPrompt = `${AGENT_SYSTEM_PROMPT}${productContext}\n\nUser: ${message}`;

    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

