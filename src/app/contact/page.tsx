'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Label Submission', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Contact WiseFoodies
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Have a product label to submit, found a data discrepancy, or want to partner on food intelligence? We would love to hear from you.
        </p>
      </div>

      <div className="wf-card p-6 sm:p-8 bg-white space-y-6">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-xl text-stone-900">Message Received</h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              Thank you for reaching out! Our food intelligence research team will review your submission promptly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-900"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarwesh"
                  className="w-full text-sm p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full text-sm p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full text-sm p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
              >
                <option value="Label Submission">Submit New Product / Label Photo</option>
                <option value="Data Correction">Correction for Existing Product</option>
                <option value="Algorithm Question">Question About FBS Methodology</option>
                <option value="General Inquiry">General Feedback or Partnership</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Message & Label Details
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Include product brand name, declared nutritional values, ingredient list, or link to label photos..."
                className="w-full text-sm p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm py-3.5 rounded-xl shadow-xs transition-transform active:scale-98 inline-flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
