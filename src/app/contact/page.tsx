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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary tracking-tight">
          Contact WiseFoodies
        </h1>
        <p className="text-sm text-on-surface-variant font-medium max-w-lg mx-auto leading-relaxed">
          Have a product label to submit, found a data discrepancy, or want to partner on food intelligence? We would love to hear from you.
        </p>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8 shadow-sm space-y-6">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <h3 className="font-serif font-bold text-xl text-primary">Message Received</h3>
            <p className="text-sm text-on-surface-variant max-w-sm mx-auto font-medium">
              Thank you for reaching out! Our food intelligence research team will review your submission promptly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-primary text-on-primary text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-outline uppercase tracking-wider block">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarwesh"
                  className="w-full text-sm p-3 border border-outline-variant/40 rounded-xl bg-surface-container-low text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-outline uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full text-sm p-3 border border-outline-variant/40 rounded-xl bg-surface-container-low text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full text-sm p-3 border border-outline-variant/40 rounded-xl bg-surface-container-low text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:border-primary"
              >
                <option value="Label Submission">Submit New Product / Label Photo</option>
                <option value="Data Correction">Correction for Existing Product</option>
                <option value="Algorithm Question">Question About FBS Methodology</option>
                <option value="General Inquiry">General Feedback or Partnership</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">
                Message &amp; Label Details
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Include product brand name, declared nutritional values, ingredient list, or link to label photos..."
                className="w-full text-sm p-3 border border-outline-variant/40 rounded-xl bg-surface-container-low text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-semibold text-sm py-3.5 rounded-full shadow-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
