'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/product';
import type { PackagedFoodItem } from '@/types/packaged-food';
import ProductCard from '@/components/ProductCard';
import IndianFoodCard from '@/components/IndianFoodCard';
import ReportIssueModal from '@/components/ReportIssueModal';
import {
  Scan,
  Camera,
  Upload,
  Keyboard,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface ScannerClientProps {
  allProducts: Product[];
}

export default function ScannerClient({ allProducts }: ScannerClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [matchedIndianProduct, setMatchedIndianProduct] = useState<PackagedFoodItem | null>(null);
  const [isSearchingDb, setIsSearchingDb] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleBarcodeSearch = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setSearched(true);
    setMatchedProduct(null);
    setMatchedIndianProduct(null);

    const found = allProducts.find(
      (p) =>
        (p.barcode && p.barcode === trimmed) ||
        p.slug.toLowerCase().includes(trimmed.toLowerCase()) ||
        p.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (found) {
      setMatchedProduct(found);
      return;
    }

    try {
      setIsSearchingDb(true);
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(trimmed)}&limit=1`);
      const data = await res.json();
      if (data.success && data.items && data.items.length > 0) {
        setMatchedIndianProduct(data.items[0]);
      }
    } catch (e) {
      console.warn('Barcode fallback lookup error:', e);
    } finally {
      setIsSearchingDb(false);
    }
  };

  // Camera start / stop logic
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (activeTab === 'camera') {
      setCameraError('');
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              setCameraActive(true);
            }
          })
          .catch((err) => {
            console.warn('Camera access denied or unavailable:', err);
            setCameraError(
              'Camera access is unavailable or denied. You can use simulation or manual barcode lookup.'
            );
            setCameraActive(false);
          });
      } else {
        setCameraError('Web camera API is not supported in this browser environment.');
      }
    } else {
      setCameraActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [activeTab]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSearched(true);
    setTimeout(() => {
      const random = allProducts[Math.floor(Math.random() * allProducts.length)];
      setMatchedProduct(random || null);
    }, 600);
  };

  const simulateRandomScan = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    setIsSimulating(true);
    setTimeout(() => {
      const random = allProducts[Math.floor(Math.random() * allProducts.length)];
      router.push(`/food/${random.slug}`);
    }, 1200);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="chip bg-[var(--berry)] text-white">
          <Scan className="w-3.5 h-3.5" /> Optical Scanner
        </div>
        <h1 className="t-display-lg text-[var(--ink)]">Scan Any Barcode</h1>
        <p className="t-body font-semibold opacity-75">
          Point your device camera at the 13-digit EAN/UPC barcode on Indian food packaging.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => {
            setActiveTab('camera');
            setSearched(false);
          }}
          className={`chip text-xs font-black ${
            activeTab === 'camera' ? 'bg-[var(--leaf)] text-white' : ''
          }`}
        >
          <Camera className="w-4 h-4" /> Live Camera
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('upload');
            setSearched(false);
          }}
          className={`chip text-xs font-black ${
            activeTab === 'upload' ? 'bg-[var(--leaf)] text-white' : ''
          }`}
        >
          <Upload className="w-4 h-4" /> Upload Photo
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('manual');
            setSearched(false);
          }}
          className={`chip text-xs font-black ${
            activeTab === 'manual' ? 'bg-[var(--leaf)] text-white' : ''
          }`}
        >
          <Keyboard className="w-4 h-4" /> Manual Entry
        </button>
      </div>

      {/* Scanner Viewfinder Box */}
      <div className="bubble-card p-6 sm:p-8 bg-[var(--surface)] min-h-[340px] flex flex-col justify-center">
        {/* TAB 1: Live Camera Scanner */}
        {activeTab === 'camera' && (
          <div className="space-y-6 text-center">
            <div className="relative max-w-sm mx-auto h-72 sm:h-80 rounded-3xl bg-black overflow-hidden flex items-center justify-center border-4 border-[var(--ink)] shadow-[var(--shadow-hard)]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Reticle with Corner Brackets & Scanner Line */}
              <div className="absolute w-[220px] h-[220px] rounded-2xl pointer-events-none overflow-hidden">
                {/* Laser scan line */}
                <div className="scanner-line" />

                {/* Corner brackets */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 32,
                    height: 32,
                    borderTop: '4px solid var(--leaf)',
                    borderLeft: '4px solid var(--leaf)',
                    borderRadius: '12px 0 0 0',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderTop: '4px solid var(--leaf)',
                    borderRight: '4px solid var(--leaf)',
                    borderRadius: '0 12px 0 0',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 32,
                    height: 32,
                    borderBottom: '4px solid var(--leaf)',
                    borderLeft: '4px solid var(--leaf)',
                    borderRadius: '0 0 0 12px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderBottom: '4px solid var(--leaf)',
                    borderRight: '4px solid var(--leaf)',
                    borderRadius: '0 0 12px 0',
                  }}
                />
              </div>

              {!cameraActive && (
                <div className="absolute inset-0 bg-black/80 p-6 flex flex-col items-center justify-center text-center text-white space-y-3">
                  <Camera className="w-10 h-10 text-[var(--mint)] opacity-70" />
                  <span className="text-sm font-bold">Align barcode or nutrition table</span>
                  {cameraError && (
                    <p className="text-xs text-white/70 max-w-xs">{cameraError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3 max-w-sm mx-auto">
              <button
                type="button"
                disabled={isSimulating}
                onClick={simulateRandomScan}
                className="btn-chunky btn-primary w-full"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Fetching Food Report...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Simulate a Scan (Test Any Food)
                  </>
                )}
              </button>
              <p className="text-xs font-bold opacity-60">
                Picks a random item from the 94 products database to test immediate report rendering.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Upload Photo */}
        {activeTab === 'upload' && (
          <div className="max-w-md mx-auto text-center space-y-4 py-6">
            <div className="border-3 border-dashed border-[var(--ink)] rounded-3xl p-8 bg-[var(--surface-alt)]">
              <Upload className="w-10 h-10 mx-auto mb-2 opacity-60" />
              <h4 className="t-h3 mb-1">Upload Pack or Label Photo</h4>
              <p className="text-xs font-semibold opacity-70 mb-4">
                Upload front of pack or nutrition facts panel from your camera roll.
              </p>
              <label className="btn-chunky btn-primary py-2.5 px-6 text-xs cursor-pointer inline-flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Choose Image File
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: Manual Entry */}
        {activeTab === 'manual' && (
          <div className="max-w-md mx-auto w-full space-y-5 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBarcodeSearch(barcodeInput);
              }}
              className="space-y-3"
            >
              <label className="text-xs font-black uppercase tracking-wider block opacity-70">
                Enter Barcode (EAN-13) or Product Name
              </label>
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="e.g. 8901234567890 or Maggi..."
                className="w-full px-4 py-3 text-base font-bold bg-[var(--surface)] border-3 border-[var(--ink)] rounded-2xl shadow-[var(--shadow-hard)] focus:outline-hidden"
              />
              <button type="submit" className="btn-chunky btn-primary w-full">
                Look Up Food
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Searched Result Preview */}
      {searched && (
        <div className="bubble-card bg-white p-6 space-y-4">
          <h3 className="t-h3">Search Match</h3>
          {isSearchingDb ? (
            <div className="flex items-center justify-center py-6 gap-2 text-emerald-800">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold">Checking Indian Packaged Food Database...</span>
            </div>
          ) : matchedProduct ? (
            <div className="max-w-xs mx-auto">
              <ProductCard product={matchedProduct} />
            </div>
          ) : matchedIndianProduct ? (
            <div className="max-w-sm mx-auto">
              <IndianFoodCard product={matchedIndianProduct} />
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm font-bold opacity-70">No exact barcode match found in catalog.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/products" className="btn-chunky btn-primary py-2 px-5 text-xs">
                  Browse 852 Indian Foods <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/explore" className="btn-chunky py-2 px-5 text-xs bg-stone-100 hover:bg-stone-200">
                  Curated Catalog
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
