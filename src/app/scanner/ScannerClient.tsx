'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import ScorecardV2Container from '@/scorecard-v2/ui/ScorecardV2Container';
import {
  Scan,
  Camera,
  Upload,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Edit3,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

interface ScannerClientProps {
  allProducts: Product[];
}

interface ImageUploadItem {
  id: string;
  dataUrl: string;
  name: string;
  type: string;
}

interface ExtractedDataState {
  productName: string;
  brand: string;
  category: string;
  priceINR: string;
  servingSizeG: string;
  servingUnit: 'g' | 'ml';
  nutritionBasis: 'per100g' | 'per100ml' | 'perServing';
  energyKcal: string;
  proteinG: string;
  carbsG: string;
  totalSugarG: string;
  addedSugarG: string;
  fatG: string;
  satFatG: string;
  transFatG: string;
  fibreG: string;
  sodiumMg: string;
  calciumMg: string;
  ironMg: string;
  ingredientsText: string;
  qualityNotes: string;
  missingFields: string[];
}

export default function ScannerClient({ allProducts }: ScannerClientProps) {
  // Navigation / Tabs
  const [activeMode, setActiveMode] = useState<'ai_scanner' | 'barcode_lookup'>('ai_scanner');

  // Scanner Steps: 1: capture, 2: verify, 3: result
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Images state
  const [images, setImages] = useState<ImageUploadItem[]>([]);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrError, setOcrError] = useState('');

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Extracted & Editable Data
  const [formData, setFormData] = useState<ExtractedDataState>({
    productName: '',
    brand: '',
    category: 'Packaged Food',
    priceINR: '',
    servingSizeG: '100',
    servingUnit: 'g',
    nutritionBasis: 'per100g',
    energyKcal: '',
    proteinG: '',
    carbsG: '',
    totalSugarG: '',
    addedSugarG: '',
    fatG: '',
    satFatG: '',
    transFatG: '0',
    fibreG: '',
    sodiumMg: '',
    calciumMg: '',
    ironMg: '',
    ingredientsText: '',
    qualityNotes: '',
    missingFields: [],
  });

  // Analysis result
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState('');

  // Barcode tab state
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [barcodeMatch, setBarcodeMatch] = useState<Product | null>(null);
  const [barcodeSearched, setBarcodeSearched] = useState(false);

  // Clean up camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } else {
        setCameraError('Web camera API is not supported in this browser.');
      }
    } catch (err: any) {
      console.warn('Camera access failed:', err);
      setCameraError('Camera access was denied or is unavailable. You can upload photos directly.');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle capture snapshot from video
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const newItem: ImageUploadItem = {
      id: `img-${Date.now()}-${Math.random()}`,
      dataUrl,
      name: `Camera Snapshot ${images.length + 1}.jpg`,
      type: 'image/jpeg',
    };
    setImages((prev) => [...prev, newItem]);
    stopCamera();
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        if (dataUrl) {
          setImages((prev) => [
            ...prev,
            {
              id: `img-${Date.now()}-${Math.random()}`,
              dataUrl,
              name: file.name,
              type: file.type || 'image/jpeg',
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Quick sample label loader for instant verification
  const loadSampleLabel = (type: 'oats' | 'biscuit' | 'juice') => {
    if (type === 'oats') {
      setFormData({
        productName: 'Rolled Whole Grain Oats',
        brand: 'Nature Pantry',
        category: 'Breakfast Cereals',
        priceINR: '160',
        servingSizeG: '40',
        servingUnit: 'g',
        nutritionBasis: 'per100g',
        energyKcal: '389',
        proteinG: '13.5',
        carbsG: '66.3',
        totalSugarG: '1.2',
        addedSugarG: '0',
        fatG: '6.9',
        satFatG: '1.2',
        transFatG: '0',
        fibreG: '10.5',
        sodiumMg: '4',
        calciumMg: '54',
        ironMg: '4.7',
        ingredientsText: '100% Whole Grain Rolled Oats',
        qualityNotes: 'Verified high-fibre sample nutrition label loaded.',
        missingFields: [],
      });
    } else if (type === 'biscuit') {
      setFormData({
        productName: 'Choco Cream Sandwich Biscuits',
        brand: 'SweetTreats',
        category: 'Biscuits & Cookies',
        priceINR: '35',
        servingSizeG: '25',
        servingUnit: 'g',
        nutritionBasis: 'per100g',
        energyKcal: '495',
        proteinG: '5.2',
        carbsG: '71.0',
        totalSugarG: '34.5',
        addedSugarG: '32.0',
        fatG: '21.5',
        satFatG: '10.8',
        transFatG: '0.05',
        fibreG: '1.8',
        sodiumMg: '280',
        calciumMg: '20',
        ironMg: '1.1',
        ingredientsText: 'Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Cocoa Solids (4.5%), Invert Syrup, Raising Agents INS 500(ii), INS 503(ii), Emulsifier INS 322 (Soy Lecithin), Iodized Salt, Artificial Flavouring Substances (Vanilla, Chocolate)',
        qualityNotes: 'Sample packaged biscuit label loaded for verification.',
        missingFields: [],
      });
    } else {
      setFormData({
        productName: 'Mixed Fruit Nectar Drink',
        brand: 'TropiFresh',
        category: 'Beverages',
        priceINR: '110',
        servingSizeG: '200',
        servingUnit: 'ml',
        nutritionBasis: 'per100ml',
        energyKcal: '54',
        proteinG: '0.4',
        carbsG: '13.2',
        totalSugarG: '12.8',
        addedSugarG: '9.5',
        fatG: '0',
        satFatG: '0',
        transFatG: '0',
        fibreG: '0.2',
        sodiumMg: '18',
        calciumMg: '8',
        ironMg: '0.2',
        ingredientsText: 'Water, Mixed Fruit Pulp (20%) (Mango, Guava, Banana, Apple), Sugar, Acidity Regulator INS 330, Antioxidant INS 300, Natural Identical Flavouring Substances',
        qualityNotes: 'Sample fruit beverage label loaded.',
        missingFields: [],
      });
    }
    setStep(2);
  };

  // Submit images to AI OCR API
  const handleProcessImages = async () => {
    if (images.length === 0) {
      setOcrError('Please capture or upload at least one label photograph first.');
      return;
    }
    setOcrError('');
    setIsProcessingOcr(true);

    try {
      const res = await fetch('/api/ai/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: images.map((img) => ({
            data: img.dataUrl,
            mimeType: img.type,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Label extraction encountered an issue.');
      }

      const d = json.data;
      setFormData({
        productName: d.productName || '',
        brand: d.brand || '',
        category: d.category || (d.isBeverage ? 'Beverages' : 'Packaged Food'),
        priceINR: '',
        servingSizeG: d.servingSizeValue ? String(d.servingSizeValue) : '100',
        servingUnit: d.servingUnit || 'g',
        nutritionBasis: d.nutritionBasis || 'per100g',
        energyKcal: d.nutrition?.energyKcal !== null && d.nutrition?.energyKcal !== undefined ? String(d.nutrition.energyKcal) : '',
        proteinG: d.nutrition?.proteinG !== null && d.nutrition?.proteinG !== undefined ? String(d.nutrition.proteinG) : '',
        carbsG: d.nutrition?.carbsG !== null && d.nutrition?.carbsG !== undefined ? String(d.nutrition.carbsG) : '',
        totalSugarG: d.nutrition?.totalSugarG !== null && d.nutrition?.totalSugarG !== undefined ? String(d.nutrition.totalSugarG) : '',
        addedSugarG: d.nutrition?.addedSugarG !== null && d.nutrition?.addedSugarG !== undefined ? String(d.nutrition.addedSugarG) : '',
        fatG: d.nutrition?.fatG !== null && d.nutrition?.fatG !== undefined ? String(d.nutrition.fatG) : '',
        satFatG: d.nutrition?.satFatG !== null && d.nutrition?.satFatG !== undefined ? String(d.nutrition.satFatG) : '',
        transFatG: d.nutrition?.transFatG !== null && d.nutrition?.transFatG !== undefined ? String(d.nutrition.transFatG) : '0',
        fibreG: d.nutrition?.fibreG !== null && d.nutrition?.fibreG !== undefined ? String(d.nutrition.fibreG) : '',
        sodiumMg: d.nutrition?.sodiumMg !== null && d.nutrition?.sodiumMg !== undefined ? String(d.nutrition.sodiumMg) : '',
        calciumMg: d.nutrition?.calciumMg !== null && d.nutrition?.calciumMg !== undefined ? String(d.nutrition.calciumMg) : '',
        ironMg: d.nutrition?.ironMg !== null && d.nutrition?.ironMg !== undefined ? String(d.nutrition.ironMg) : '',
        ingredientsText: d.ingredientsRaw || (Array.isArray(d.ingredientsList) ? d.ingredientsList.join(', ') : ''),
        qualityNotes: d.qualityAssessment?.notes || '',
        missingFields: d.qualityAssessment?.missingKeyNutrients || [],
      });

      setStep(2);
    } catch (err: any) {
      console.error('OCR Error:', err);
      setOcrError(err.message || 'Failed to read image. You can enter details manually.');
      setStep(2);
    } finally {
      setIsProcessingOcr(false);
    }
  };

  // Run independent food analysis
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      const payload = {
        name: formData.productName.trim() || 'Scanned Packaged Product',
        brand: formData.brand.trim() || 'Independent Brand',
        category: formData.category,
        priceINR: formData.priceINR ? parseFloat(formData.priceINR) : null,
        servingSizeG: formData.servingSizeG ? parseFloat(formData.servingSizeG) : 100,
        servingUnit: formData.servingUnit,
        nutrition: {
          energyKcal: formData.energyKcal ? parseFloat(formData.energyKcal) : null,
          proteinG: formData.proteinG ? parseFloat(formData.proteinG) : null,
          carbsG: formData.carbsG ? parseFloat(formData.carbsG) : null,
          totalSugarG: formData.totalSugarG ? parseFloat(formData.totalSugarG) : null,
          addedSugarG: formData.addedSugarG ? parseFloat(formData.addedSugarG) : null,
          fatG: formData.fatG ? parseFloat(formData.fatG) : null,
          satFatG: formData.satFatG ? parseFloat(formData.satFatG) : null,
          transFatG: formData.transFatG ? parseFloat(formData.transFatG) : 0,
          fibreG: formData.fibreG ? parseFloat(formData.fibreG) : null,
          sodiumMg: formData.sodiumMg ? parseFloat(formData.sodiumMg) : null,
          calciumMg: formData.calciumMg ? parseFloat(formData.calciumMg) : null,
          ironMg: formData.ironMg ? parseFloat(formData.ironMg) : null,
        },
        ingredients: formData.ingredientsText
          .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Analysis failed');
      }

      setAnalysisResult(json.analysis);
      setStep(3);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err.message || 'Analysis could not be completed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Barcode lookup handler
  const handleBarcodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = barcodeQuery.trim().toLowerCase();
    if (!q) return;

    setBarcodeSearched(true);
    const found = allProducts.find(
      (p) =>
        (p.barcode && p.barcode.toLowerCase() === q) ||
        p.id.toLowerCase() === q ||
        p.slug.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q)
    );
    setBarcodeMatch(found || null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Independent AI Food Scanner
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Analyse Any Packaged Food
          </h1>
          <p className="text-sm text-stone-600 max-w-xl mt-1">
            Upload photographs of ANY food label or nutrition table. Our optical engine decodes
            ingredients, extracts nutrients, and computes your Food Benefit Score instantly.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-stone-100 p-1 rounded-xl self-start sm:self-auto border border-stone-200">
          <button
            type="button"
            onClick={() => setActiveMode('ai_scanner')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'ai_scanner'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Optical AI Scanner
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('barcode_lookup')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'barcode_lookup'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Barcode Catalogue Lookup
          </button>
        </div>
      </div>

      {/* MODE 2: SECONDARY BARCODE LOOKUP */}
      {activeMode === 'barcode_lookup' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="max-w-lg mx-auto text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <Scan className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Catalogue Barcode Lookup</h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Lookup existing products in the 852 Indian packaged foods catalogue by 13-digit EAN/UPC code or product ID.
            </p>
          </div>

          <form onSubmit={handleBarcodeSearch} className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              value={barcodeQuery}
              onChange={(e) => setBarcodeQuery(e.target.value)}
              placeholder="e.g. IN-1, Hide & Seek, or 8901..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
            >
              Search
            </button>
          </form>

          {barcodeSearched && (
            <div className="pt-4 border-t border-stone-100 max-w-md mx-auto">
              {barcodeMatch ? (
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {barcodeMatch.brand}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">{barcodeMatch.name}</h4>
                    <p className="text-xs text-stone-500">
                      FBS: {barcodeMatch.fbs.score}/10 • ₹{barcodeMatch.priceINR || 'N/A'}
                    </p>
                  </div>
                  <Link
                    href={`/food/${barcodeMatch.slug}`}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1"
                  >
                    View Scorecard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6 text-stone-500 text-sm">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  Product not found in local catalogue. Use the{' '}
                  <button
                    onClick={() => setActiveMode('ai_scanner')}
                    className="text-emerald-700 font-bold underline"
                  >
                    Optical AI Scanner
                  </button>{' '}
                  to analyze its label independently!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 1: INDEPENDENT OPTICAL AI SCANNER */}
      {activeMode === 'ai_scanner' && (
        <div className="space-y-6">
          {/* Progress Stepper */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold border-b border-stone-200 pb-3">
            <div
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 ${
                step === 1 ? 'bg-emerald-800 text-white' : 'text-stone-500 bg-stone-100'
              }`}
            >
              <span>1. Capture Label</span>
            </div>
            <div
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 ${
                step === 2 ? 'bg-emerald-800 text-white' : 'text-stone-500 bg-stone-100'
              }`}
            >
              <span>2. Verify & Edit</span>
            </div>
            <div
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 ${
                step === 3 ? 'bg-emerald-800 text-white' : 'text-stone-500 bg-stone-100'
              }`}
            >
              <span>3. Full Scorecard</span>
            </div>
          </div>

          {/* STEP 1: CAPTURE & UPLOAD */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Live Camera Viewfinder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-700" /> Option A: Device Camera
                    </h3>
                    {cameraActive && (
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        Turn Off Camera
                      </button>
                    )}
                  </div>

                  <div className="relative rounded-2xl bg-stone-900 overflow-hidden h-64 sm:h-72 flex items-center justify-center border-2 border-stone-800">
                    {cameraActive ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        {/* Target Reticle */}
                        <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                          <span className="text-[11px] text-white/80 bg-black/50 px-2 py-1 rounded">
                            Align nutrition table or ingredients here
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-stone-800 text-emerald-400 flex items-center justify-center mx-auto">
                          <Camera className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-stone-400 max-w-xs">
                          {cameraError || 'Point camera at the back of any food package to capture.'}
                        </p>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" /> Start Camera
                        </button>
                      </div>
                    )}
                  </div>

                  {cameraActive && (
                    <button
                      type="button"
                      onClick={captureSnapshot}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Camera className="w-4 h-4" /> Take Snapshot & Add
                    </button>
                  )}
                </div>

                {/* File Upload & Multi-Photo Dropzone */}
                <div className="space-y-4">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-700" /> Option B: Upload Photo(s)
                  </h3>

                  <label className="flex flex-col items-center justify-center h-64 sm:h-72 rounded-2xl border-2 border-dashed border-stone-300 hover:border-emerald-500 bg-stone-50/60 hover:bg-emerald-50/20 cursor-pointer transition-all p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-stone-800">
                      Upload Nutrition or Ingredient Label
                    </span>
                    <span className="text-xs text-stone-500 mt-1">
                      PNG, JPG, or WEBP (Multiple photos supported)
                    </span>
                    <span className="mt-4 px-4 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-700 shadow-2xs">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Uploaded Photos Previews */}
              {images.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Staged Photographs ({images.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        className="relative rounded-xl overflow-hidden border border-stone-300 group h-28 bg-stone-100"
                      >
                        <img
                          src={img.dataUrl}
                          alt={`Uploaded label ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded truncate max-w-[90%]">
                          {img.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {ocrError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{ocrError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleProcessImages}
                      disabled={isProcessingOcr}
                      className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                    >
                      {isProcessingOcr ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Extracting Nutritional Data & Ingredients...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Extract Data & Proceed to Verification</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Instant Test Presets */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Don't have a label photo handy right now? Test with verified sample labels:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => loadSampleLabel('oats')}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    🥣 Whole Grain Oats (High Protein/Fibre)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleLabel('biscuit')}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    🍪 Choco Cream Biscuits (High Sugar/Palm Oil)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleLabel('juice')}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    🧃 Fruit Nectar (Packaged Beverage)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: USER VERIFICATION & CORRECTION FORM */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Step 2: Verify & Edit Extracted Information
                  </h3>
                  <p className="text-xs text-stone-600">
                    Review extracted facts before analysis. You can edit any value or fill in missing label figures.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-upload Photos
                </button>
              </div>

              {/* Quality & Missing Notice */}
              {formData.missingFields.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Missing Essential Fields for FBS Calculation: </span>
                    <span>{formData.missingFields.join(', ')}.</span>
                    <p className="mt-0.5 text-amber-800">
                      Food Benefit Score requires Energy, Protein, Sugar, Fat, and Sodium. Please enter the values from the label to unlock the full score.
                    </p>
                  </div>
                </div>
              )}

              {/* Section 1: Product Identifiers & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. Marie Gold Biscuits"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Britannia"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="BISCUIT">Biscuits & Cookies</option>
                    <option value="SNACKS">Snacks & Chips</option>
                    <option value="CHOCOLATE">Chocolates</option>
                    <option value="DAIRY">Dairy & Milk</option>
                    <option value="INSTANT FOOD">Instant Foods & Noodles</option>
                    <option value="JUICE">Juices & Beverages</option>
                    <option value="CAKE">Cakes & Bakery</option>
                    <option value="SAUCE">Sauces & Condiments</option>
                    <option value="SWEETS">Sweets & Desserts</option>
                    <option value="Packaged Food">Other Packaged Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Pack Price in ₹ (for Nutrition per Paisa)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.priceINR}
                      onChange={(e) => setFormData({ ...formData, priceINR: e.target.value })}
                      placeholder="e.g. 40"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Serving Size & Base */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Declared Serving Size
                  </label>
                  <input
                    type="number"
                    value={formData.servingSizeG}
                    onChange={(e) => setFormData({ ...formData, servingSizeG: e.target.value })}
                    placeholder="100"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Unit of Measure
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, servingUnit: 'g' })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        formData.servingUnit === 'g'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-stone-700 border-stone-300'
                      }`}
                    >
                      Grams (g)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, servingUnit: 'ml' })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        formData.servingUnit === 'ml'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-stone-700 border-stone-300'
                      }`}
                    >
                      Millilitres (ml)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nutrient Table Base
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, nutritionBasis: 'per100g' })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        formData.nutritionBasis === 'per100g'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-stone-700 border-stone-300'
                      }`}
                    >
                      Per 100{formData.servingUnit}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, nutritionBasis: 'perServing' })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        formData.nutritionBasis === 'perServing'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-stone-700 border-stone-300'
                      }`}
                    >
                      Per Serve
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Nutritional Facts Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                  <span>Nutritional Values ({formData.nutritionBasis === 'perServing' ? 'Per Serving' : `Per 100${formData.servingUnit}`})</span>
                  <span className="text-[11px] font-normal text-stone-500 lowercase">
                    * Required for FBS calculation
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-200">
                    <label className="block text-xs font-bold text-stone-800">
                      Energy (kcal) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.energyKcal}
                      onChange={(e) => setFormData({ ...formData, energyKcal: e.target.value })}
                      placeholder="e.g. 450"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-200">
                    <label className="block text-xs font-bold text-stone-800">
                      Protein (g) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.proteinG}
                      onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
                      placeholder="e.g. 8.5"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <label className="block text-xs font-bold text-stone-800">
                      Carbohydrates (g)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.carbsG}
                      onChange={(e) => setFormData({ ...formData, carbsG: e.target.value })}
                      placeholder="e.g. 68"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-200">
                    <label className="block text-xs font-bold text-stone-800">
                      Total Sugar (g) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.totalSugarG}
                      onChange={(e) => setFormData({ ...formData, totalSugarG: e.target.value })}
                      placeholder="e.g. 24"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <label className="block text-xs font-bold text-stone-800">
                      Added Sugar (g)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.addedSugarG}
                      onChange={(e) => setFormData({ ...formData, addedSugarG: e.target.value })}
                      placeholder="e.g. 22"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-200">
                    <label className="block text-xs font-bold text-stone-800">
                      Total Fat (g) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.fatG}
                      onChange={(e) => setFormData({ ...formData, fatG: e.target.value })}
                      placeholder="e.g. 16"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <label className="block text-xs font-bold text-stone-800">
                      Saturated Fat (g)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.satFatG}
                      onChange={(e) => setFormData({ ...formData, satFatG: e.target.value })}
                      placeholder="e.g. 7.5"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <label className="block text-xs font-bold text-stone-800">
                      Trans Fat (g)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.transFatG}
                      onChange={(e) => setFormData({ ...formData, transFatG: e.target.value })}
                      placeholder="0"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <label className="block text-xs font-bold text-stone-800">
                      Dietary Fibre (g)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.fibreG}
                      onChange={(e) => setFormData({ ...formData, fibreG: e.target.value })}
                      placeholder="e.g. 3.5"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-200">
                    <label className="block text-xs font-bold text-stone-800">
                      Sodium (mg) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.sodiumMg}
                      onChange={(e) => setFormData({ ...formData, sodiumMg: e.target.value })}
                      placeholder="e.g. 350"
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Ingredients List */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Ingredients List (in exact package order, separated by commas)
                </label>
                <textarea
                  rows={3}
                  value={formData.ingredientsText}
                  onChange={(e) => setFormData({ ...formData, ingredientsText: e.target.value })}
                  placeholder="e.g. Whole Wheat Flour (52%), Refined Palm Oil, Sugar, Milk Solids, Raising Agents INS 500(ii), Iodized Salt..."
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs leading-relaxed"
                />
              </div>

              {analysisError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Submit to Engine */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Computing Food Benefit Score & Nutritional Intelligence...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Run WiseFoodies Intelligence Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COMPLETE FOOD SCORECARD DISPLAY */}
          {step === 3 && analysisResult && (
            <div className="space-y-8 animate-fadeIn">
              {/* Result Header & Re-scan bar */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Independent Analysis Complete
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                    {analysisResult.product.name}
                  </h2>
                  <p className="text-xs text-stone-500 font-semibold mt-0.5">
                    Brand: <span className="text-stone-800">{analysisResult.product.brand}</span> • Category: <span className="text-stone-800">{analysisResult.product.category}</span>
                    {analysisResult.product.priceINR && ` • MRP: ₹${analysisResult.product.priceINR}`}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Input
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setImages([]);
                      setAnalysisResult(null);
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Scan Another
                  </button>
                </div>
              </div>

              {/* 1. FOOD BENEFIT SCORE (FBS) HERO */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 pb-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Food Benefit Score (FBS)
                    </div>
                    <h3 className="text-2xl font-black text-stone-900">
                      Scientific Rating: {analysisResult.fbs.score !== null ? `${analysisResult.fbs.score} / 10` : 'Pending Data'}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                      {analysisResult.fbs.score !== null
                        ? `Rated '${analysisResult.fbs.band}' based on protein, dietary fibre, healthy ingredients vs. added sugars, saturated fats, sodium, and processing penalties.`
                        : 'Score requires all 5 core nutrients: Energy, Protein, Sugar, Fat, and Sodium.'}
                    </p>
                  </div>

                  {analysisResult.fbs.score !== null && (
                    <div className="shrink-0 flex items-center gap-4">
                      <div className="w-24 h-24 rounded-2xl bg-emerald-800 text-white flex flex-col items-center justify-center shadow-md">
                        <span className="text-3xl font-black">{analysisResult.fbs.score}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                          {analysisResult.fbs.band}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Score Breakdown Factors */}
                {analysisResult.fbs.breakdown && analysisResult.fbs.breakdown.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Why this score? Factor Breakdown:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {analysisResult.fbs.breakdown.map((item: any, i: number) => {
                        const isPos = item.points > 0;
                        const isNeg = item.points < 0;
                        return (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                              isPos
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : isNeg
                                ? 'bg-red-50/60 border-red-200 text-red-950'
                                : 'bg-stone-50 border-stone-200 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold">{item.factor}</span>
                              <span
                                className={`font-black px-1.5 py-0.5 rounded text-[11px] ${
                                  isPos
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : isNeg
                                    ? 'bg-red-200 text-red-900'
                                    : 'bg-stone-200 text-stone-800'
                                }`}
                              >
                                {item.points > 0 ? `+${item.points}` : item.points}
                              </span>
                            </div>
                            <p className="text-[11px] opacity-80 leading-snug">{item.reason}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. NUTRITIONAL FACTS TABLE */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-3">
                  Nutritional Facts & Daily Value Reference
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold">
                        <th className="py-2.5 px-3">Nutrient</th>
                        <th className="py-2.5 px-3">Per 100{analysisResult.product.packSizeText?.includes('ml') ? 'ml' : 'g'}</th>
                        <th className="py-2.5 px-3">Per Serving ({analysisResult.product.servingSizeG || 100}g)</th>
                        <th className="py-2.5 px-3">Standard Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Energy</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.energyKcal ?? 'N/A'} kcal</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.energyKcal
                            ? Math.round((analysisResult.product.per100g.energyKcal * (analysisResult.product.servingSizeG || 100)) / 100)
                            : 'N/A'}{' '}
                          kcal
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">2000 kcal/day (ICMR)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Protein</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.proteinG ?? 'N/A'} g</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.proteinG
                            ? Math.round(((analysisResult.product.per100g.proteinG * (analysisResult.product.servingSizeG || 100)) / 100) * 10) / 10
                            : 'N/A'}{' '}
                          g
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">54g/day RDA</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Total Carbohydrates</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.carbsG ?? 'N/A'} g</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.carbsG
                            ? Math.round(((analysisResult.product.per100g.carbsG * (analysisResult.product.servingSizeG || 100)) / 100) * 10) / 10
                            : 'N/A'}{' '}
                          g
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">130g/day minimum</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 pl-6 text-stone-600 font-semibold">Total Sugars</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.totalSugarG ?? 'N/A'} g</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.totalSugarG
                            ? Math.round(((analysisResult.product.per100g.totalSugarG * (analysisResult.product.servingSizeG || 100)) / 100) * 10) / 10
                            : 'N/A'}{' '}
                          g
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">WHO limit: &lt;25g added sugar</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 pl-6 text-stone-600 font-semibold">Added Sugars</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.addedSugarG ?? 'N/A'} g</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.addedSugarG
                            ? Math.round(((analysisResult.product.per100g.addedSugarG * (analysisResult.product.servingSizeG || 100)) / 100) * 10) / 10
                            : 'N/A'}{' '}
                          g
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">Zero added sugar is optimal</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Total Fat</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.fatG ?? 'N/A'} g</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.fatG
                            ? Math.round(((analysisResult.product.per100g.fatG * (analysisResult.product.servingSizeG || 100)) / 100) * 10) / 10
                            : 'N/A'}{' '}
                          g
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">67g/day upper limit</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 pl-6 text-stone-600 font-semibold">Saturated Fat</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.satFatG ?? 'N/A'} g</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.satFatG
                            ? Math.round(((analysisResult.product.per100g.satFatG * (analysisResult.product.servingSizeG || 100)) / 100) * 10) / 10
                            : 'N/A'}{' '}
                          g
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">&lt;22g/day limit</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 pl-6 text-stone-600 font-semibold">Trans Fat</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.transFatG ?? 0} g</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.transFatG ?? 0} g</td>
                        <td className="py-2.5 px-3 text-stone-500">Must be 0g</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Dietary Fibre</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.fibreG ?? 'Not declared'} g</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.fibreG
                            ? Math.round(((analysisResult.product.per100g.fibreG * (analysisResult.product.servingSizeG || 100)) / 100) * 10) / 10 + ' g'
                            : 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">30g/day target</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Sodium</td>
                        <td className="py-2.5 px-3">{analysisResult.product.per100g.sodiumMg ?? 'N/A'} mg</td>
                        <td className="py-2.5 px-3">
                          {analysisResult.product.per100g.sodiumMg
                            ? Math.round((analysisResult.product.per100g.sodiumMg * (analysisResult.product.servingSizeG || 100)) / 100)
                            : 'N/A'}{' '}
                          mg
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">2000mg/day limit (WHO)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. SCORECARD V2 MODULES: SMART CONSUMPTION, NUTRITION PER PAISA, INGREDIENTS */}
              <ScorecardV2Container product={analysisResult.product} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
