'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  X,
  FileText,
  Database,
  ArrowRight,
  Layers,
} from 'lucide-react';
import type { PackagedFoodItem, CategorySummary, BrandSummary } from '@/types/packaged-food';
import { CATEGORY_ICONS } from '@/lib/foodConstants';

interface Props {
  initialProducts: PackagedFoodItem[];
  categories: CategorySummary[];
  brands: BrandSummary[];
}

export default function AdminClient({ initialProducts, categories, brands }: Props) {
  // Passcode authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Products state
  const [products, setProducts] = useState<PackagedFoodItem[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<PackagedFoodItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PackagedFoodItem | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Bulk Import state
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    totalProvided: number;
    validCount: number;
    invalidCount: number;
    errors: string[];
    sample: any[];
  } | null>(null);
  const [importLog, setImportLog] = useState<{ imported: number; errors: string[] } | null>(null);

  // Authentication check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'wisefoodies' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. (Hint: admin123)');
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchCat = !selectedCat || p.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [products, search, selectedCat]);

  const totalPages = Math.ceil(filteredProducts.length / limit) || 1;
  const paginated = filteredProducts.slice((page - 1) * limit, page * limit);

  // Handle Save (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.brand || !editingItem?.category) {
      alert('Product Name, Brand, and Category are required.');
      return;
    }

    try {
      const isEdit = !!editingItem.id;
      const url = isEdit ? `/api/products/${editingItem.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to save product');
        return;
      }

      if (isEdit) {
        setProducts(prev => prev.map(p => (p.id === data.data.id ? data.data : p)));
        setActionMessage({ text: `Updated "${data.data.name}" successfully`, type: 'success' });
      } else {
        setProducts(prev => [data.item, ...prev]);
        setActionMessage({ text: `Added new product "${data.item.name}" (ID: ${data.item.id})`, type: 'success' });
      }

      setIsAddEditOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      alert(err.message || 'Network error saving product');
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to delete product');
        return;
      }

      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setActionMessage({ text: `Deleted "${deleteTarget.name}" successfully`, type: 'success' });
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Network error deleting product');
    }
  };

  // Handle Bulk Import Preview
  const handlePreviewImport = async () => {
    if (!importText.trim()) {
      alert('Please paste JSON or CSV text to import');
      return;
    }

    setIsImporting(true);
    try {
      const isJson = importText.trim().startsWith('[') || importText.trim().startsWith('{');
      const res = await fetch('/api/admin/import?preview=true', {
        method: 'POST',
        headers: {
          'Content-Type': isJson ? 'application/json' : 'text/plain',
        },
        body: importText,
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to preview import');
        return;
      }

      setImportPreview(data);
      setImportLog(null);
    } catch (err: any) {
      alert(err.message || 'Import preview error');
    } finally {
      setIsImporting(false);
    }
  };

  // Handle Commit Import
  const handleCommitImport = async () => {
    setIsImporting(true);
    try {
      const isJson = importText.trim().startsWith('[') || importText.trim().startsWith('{');
      const res = await fetch(`/api/admin/import?mode=${importMode}`, {
        method: 'POST',
        headers: {
          'Content-Type': isJson ? 'application/json' : 'text/plain',
        },
        body: importText,
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Import commit failed');
        return;
      }

      setImportLog({ imported: data.imported, errors: data.errors });
      setImportPreview(null);
      setImportText('');

      // Refresh product list
      const freshRes = await fetch('/api/products?limit=1000');
      const freshData = await freshRes.json();
      if (freshData.success) {
        setProducts(freshData.data);
      }
    } catch (err: any) {
      alert(err.message || 'Import commit error');
    } finally {
      setIsImporting(false);
    }
  };

  // Passcode gate view
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bubble-card bg-[var(--surface)] text-[var(--ink)] text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto border-2 border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)]">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-stone-900 dark:text-stone-50">
            Admin Authentication
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Protected area for dataset management and bulk operations.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter admin passcode (admin123)"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              className="w-full text-center text-sm p-3 rounded-xl border-2 border-[var(--ink)] bg-white dark:bg-stone-900 shadow-[3px_3px_0px_var(--ink)] font-bold"
            />
            {authError && (
              <p className="text-xs text-[var(--tomato)] font-bold mt-2">{authError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-chunky py-3 bg-[var(--leaf)] text-white text-sm font-black flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Access Control Panel</span>
          </button>
        </form>

        <p className="text-[11px] text-stone-400">
          Demo passcode: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono font-bold">admin123</code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bubble-card bg-[var(--surface)] p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Authenticated Session</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-50">
            Packaged Food Database Admin
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Manage all 852 Indian packaged food records, perform live CRUD operations, and bulk sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingItem({
                name: '',
                brand: '',
                category: 'SNACKS',
                subCategory: '',
                ingredients: '',
                servingSizeG: 100,
                caloriesKcal: 400,
                proteinG: 5,
                carbohydratesG: 60,
                totalFatG: 15,
                saturatedFatG: 5,
                transFatG: 0,
                sugarG: 10,
                sodiumMg: 200,
                dietaryFiberG: 2,
                priceINR: 50,
              });
              setIsAddEditOpen(true);
            }}
            className="btn-chunky py-2.5 px-4 bg-[var(--leaf)] text-white text-xs font-black flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Product</span>
          </button>

          <a
            href="/api/admin/export?format=csv"
            download="packaged_foods_india_export.csv"
            className="btn-chunky py-2.5 px-4 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>

          <a
            href="/api/admin/export?format=json"
            download="packaged_foods_india_export.json"
            className="btn-chunky py-2.5 px-4 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </a>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border-2 flex items-center justify-between font-bold text-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button type="button" onClick={() => setActionMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Tabs: Product Table & Bulk Import */}
      <div className="space-y-6">
        {/* Products Table Section */}
        <div className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display font-black text-xl text-stone-900 dark:text-stone-50">
              Product Catalog ({filteredProducts.length} items)
            </h2>

            {/* Filter inputs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter name, brand, or ID..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>

              <select
                value={selectedCat}
                onChange={e => {
                  setSelectedCat(e.target.value);
                  setPage(1);
                }}
                className="text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
              >
                <option value="">All Categories ({categories.length})</option>
                {categories.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.icon} {c.name} ({c.productCount})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-100 dark:bg-stone-800/60 uppercase font-black text-stone-500">
                <tr>
                  <th className="p-3">ID / S.No</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Energy (kcal)</th>
                  <th className="p-3 text-right">Protein (g)</th>
                  <th className="p-3 text-right">Sugar (g)</th>
                  <th className="p-3 text-right">Price (₹)</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {paginated.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-mono font-bold text-stone-500">{p.id}</td>
                    <td className="p-3 font-bold max-w-xs truncate text-stone-900 dark:text-stone-100">
                      <Link href={`/products/${p.id}`} className="hover:text-[var(--leaf)] underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-3 font-semibold text-stone-600 dark:text-stone-400">{p.brand}</td>
                    <td className="p-3">
                      <span className="chip text-[10px] py-0.5 px-2 bg-stone-100 dark:bg-stone-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">{p.caloriesKcal ?? '—'}</td>
                    <td className="p-3 text-right font-mono">{p.proteinG ?? '—'}</td>
                    <td className="p-3 text-right font-mono">{p.sugarG ?? '—'}</td>
                    <td className="p-3 text-right font-mono font-bold text-[var(--leaf)]">
                      {p.priceINR !== null ? `₹${p.priceINR}` : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(p);
                            setIsAddEditOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="btn-chunky py-1.5 px-3 text-xs bg-stone-100 dark:bg-stone-800 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="btn-chunky py-1.5 px-3 text-xs bg-stone-100 dark:bg-stone-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Operations Section */}
        <div className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h2 className="font-display font-black text-xl text-stone-900 dark:text-stone-50">
                Bulk Import & Data Sync
              </h2>
              <p className="text-xs text-stone-500">
                Paste JSON array or CSV records to preview validation and import in bulk.
              </p>
            </div>
            <Upload className="w-5 h-5 text-[var(--leaf)]" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs font-bold">
              <span>Import Mode:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                />
                <span>Merge / Update Duplicates</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                />
                <span className="text-[var(--tomato)]">Full Database Replace</span>
              </label>
            </div>

            <textarea
              rows={6}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste raw JSON array or CSV text here..."
              className="w-full text-xs font-mono p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 leading-relaxed"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isImporting || !importText.trim()}
                onClick={handlePreviewImport}
                className="btn-chunky py-2 px-4 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-black disabled:opacity-40"
              >
                Validate & Preview
              </button>

              <button
                type="button"
                disabled={isImporting || !importText.trim()}
                onClick={handleCommitImport}
                className="btn-chunky py-2 px-4 bg-[var(--leaf)] text-white text-xs font-black disabled:opacity-40"
              >
                Execute Bulk Import
              </button>
            </div>
          </div>

          {/* Import Preview Card */}
          {importPreview && (
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 space-y-2 text-xs">
              <div className="font-bold flex items-center justify-between">
                <span>Validation Preview:</span>
                <span className="text-emerald-600 font-black">{importPreview.validCount} valid records</span>
              </div>
              <p className="text-stone-500">
                Total payload records: {importPreview.totalProvided} | Invalid: {importPreview.invalidCount}
              </p>
              {importPreview.errors.length > 0 && (
                <div className="text-[var(--tomato)] font-medium space-y-1 mt-2">
                  <span className="font-bold">Errors found:</span>
                  {importPreview.errors.slice(0, 5).map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Import Result Log */}
          {importLog && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs space-y-1">
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                Bulk import successfully completed! {importLog.imported} records processed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddEditOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] text-[var(--ink)] border-2 border-[var(--ink)] rounded-3xl shadow-[8px_8px_0px_var(--ink)] max-w-2xl w-full p-6 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-display font-black text-xl">
                {editingItem.id ? `Edit Product (${editingItem.id})` : 'Add New Packaged Food'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddEditOpen(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.brand || ''}
                    onChange={e => setEditingItem({ ...editingItem, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Category *</label>
                  <select
                    value={editingItem.category || ''}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  >
                    {categories.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={editingItem.subCategory || ''}
                    onChange={e => setEditingItem({ ...editingItem, subCategory: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Ingredients</label>
                <textarea
                  rows={3}
                  value={editingItem.ingredients || ''}
                  onChange={e => setEditingItem({ ...editingItem, ingredients: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>

              {/* Nutrition Inputs Grid */}
              <div className="border-t border-stone-200 dark:border-stone-800 pt-3">
                <div className="font-black text-stone-500 uppercase tracking-wider mb-2">
                  Nutrition Declarations (null if missing)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-stone-400">Calories (kcal)</label>
                    <input
                      type="number"
                      value={editingItem.caloriesKcal ?? ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          caloriesKcal: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingItem.proteinG ?? ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          proteinG: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400">Sugar (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingItem.sugarG ?? ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          sugarG: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400">Sodium (mg)</label>
                    <input
                      type="number"
                      value={editingItem.sodiumMg ?? ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          sodiumMg: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400">Total Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingItem.totalFatG ?? ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          totalFatG: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400">Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingItem.carbohydratesG ?? ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          carbohydratesG: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400">Serving (g)</label>
                    <input
                      type="number"
                      value={editingItem.servingSizeG ?? ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          servingSizeG: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400">Price (₹ INR)</label>
                    <input
                      type="number"
                      value={editingItem.priceINR ?? ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          priceINR: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="btn-chunky py-2 px-4 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-chunky py-2 px-5 bg-[var(--leaf)] text-white font-black"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] text-[var(--ink)] border-2 border-[var(--ink)] rounded-3xl shadow-[8px_8px_0px_var(--ink)] max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-black text-xl text-stone-900 dark:text-stone-50">
                Delete Product?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you sure you want to delete <strong>{deleteTarget.name}</strong> ({deleteTarget.id})? This action will remove it from the catalog.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="btn-chunky py-2 px-4 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn-chunky py-2 px-4 bg-rose-600 text-white text-xs font-black"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
