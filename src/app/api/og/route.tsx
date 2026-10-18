import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getProductBySlug } from '@/lib/products';
import { getScoreBandColor } from '@/lib/shareCard';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fef3c7',
              fontFamily: 'sans-serif',
              border: '12px solid #0f172a',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 900, color: '#0f172a' }}>WiseFoodies</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#15803d', marginTop: 12 }}>
              Eat Smarter. Choose Better.
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const product = getProductBySlug(slug);
    if (!product) {
      return new Response('Product not found', { status: 404 });
    }

    const score = product.fbs.score;
    const bandColor = getScoreBandColor(score);
    const protein = product.per100g.proteinG !== null ? `${product.per100g.proteinG}g` : '—';
    const sugar = product.per100g.totalSugarG !== null ? `${product.per100g.totalSugarG}g` : '—';
    const calories = product.per100g.energyKcal !== null ? `${product.per100g.energyKcal}` : '—';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            padding: 48,
            fontFamily: 'sans-serif',
            border: '16px solid #0f172a',
            boxSizing: 'border-box',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: 24,
                  border: '3px solid #0f172a',
                }}
              >
                W
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a' }}>
                Wise<span style={{ color: '#15803d' }}>Foodies</span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f1f5f9',
                padding: '8px 20px',
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 800,
                color: '#0f172a',
                border: '2px solid #0f172a',
              }}
            >
              Label Decoded
            </div>
          </div>

          {/* Body Content */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
            {/* Left: Product Info */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#15803d',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                {product.brand}
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  maxHeight: 110,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.name}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 16,
                    border: '2px solid #0f172a',
                  }}
                >
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 800 }}>PROTEIN / 100g</span>
                  <span style={{ fontSize: 24, color: '#0f172a', fontWeight: 900 }}>{protein}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 16,
                    border: '2px solid #0f172a',
                  }}
                >
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 800 }}>SUGAR / 100g</span>
                  <span style={{ fontSize: 24, color: '#dc2626', fontWeight: 900 }}>{sugar}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 16,
                    border: '2px solid #0f172a',
                  }}
                >
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 800 }}>CALORIES</span>
                  <span style={{ fontSize: 24, color: '#0f172a', fontWeight: 900 }}>{calories}</span>
                </div>
              </div>
            </div>

            {/* Right: Score Capsule */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                border: '4px solid #0f172a',
                borderRadius: 32,
                padding: '24px 36px',
                boxShadow: '8px 8px 0px #0f172a',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>
                Food Benefit Score
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: bandColor,
                  lineHeight: 1,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                {score !== null ? score.toFixed(1) : '—'}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  backgroundColor: bandColor,
                  color: '#ffffff',
                  padding: '6px 16px',
                  borderRadius: 999,
                }}
              >
                {product.fbs.band}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid #e2e8f0',
              paddingTop: 16,
              fontSize: 14,
              color: '#64748b',
              fontWeight: 700,
            }}
          >
            <div>wisefoodies.in • Eat Smarter. Choose Better.</div>
            <div style={{ fontSize: 12 }}>For information only, not medical advice.</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
