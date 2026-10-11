'use client';

import React, { useState } from 'react';
import { Flag, X, CheckCircle, AlertTriangle } from 'lucide-react';

interface ReportIssueModalProps {
  productId: string;
  productSlug: string;
  productName: string;
}

export default function ReportIssueModal({
  productId,
  productSlug,
  productName,
}: ReportIssueModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [issueType, setIssueType] = useState('missing-nutrition');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setErrorMsg('Please describe the issue or missing information.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productSlug,
          issueType,
          details,
          email,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit report. Please try again.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setIsSubmitted(false);
          setErrorMsg('');
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors py-1.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50"
      >
        <Flag className="w-3.5 h-3.5 text-amber-600" />
        <span>Report an Issue / Complete Data</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-lg text-stone-900">Thank you for your report!</h3>
                <p className="text-sm text-stone-600 max-w-sm mx-auto">
                  Your feedback helps keep WiseFoodies accurate and transparent for all Indian consumers.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-900"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg">
                    Report an Issue
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Flag incorrect data or submit verified nutrition facts for <strong>{productName}</strong>.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    What needs correction?
                  </label>
                  <select
                    value={issueType}
                    onChange={e => setIssueType(e.target.value)}
                    className="w-full text-sm p-2.5 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                  >
                    <option value="missing-nutrition">Missing nutrition facts from label</option>
                    <option value="wrong-nutrition">Incorrect calories / sugar / protein</option>
                    <option value="wrong-ingredients">Incorrect or missing ingredients</option>
                    <option value="wrong-image">Image does not match packaging</option>
                    <option value="wrong-price">Incorrect MRP or pack size</option>
                    <option value="other">Other question or feedback</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Details / Label Information
                  </label>
                  <textarea
                    rows={4}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    placeholder="Provide actual figures from the pack (e.g. Energy 420 kcal, Protein 8.5g per 100g, or paste photo URL)..."
                    className="w-full text-sm p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Your Email (Optional, for verification updates)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-sm p-2.5 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
