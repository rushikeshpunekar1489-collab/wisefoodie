'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  moduleName: string;
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

export default class ModuleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Unexpected module rendering issue.' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(`[Scorecard V2] Module error in ${this.props.moduleName}:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bubble-card border-dashed bg-[var(--surface-alt)] p-5 text-left space-y-3">
          <div className="flex items-center gap-2.5 text-[var(--mango)] font-bold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{this.props.moduleName} temporarily unavailable</span>
          </div>
          <p className="text-xs opacity-70 leading-relaxed">
            {this.props.fallbackMessage ||
              'This module encountered a data rendering exception. Other scorecard modules and verified nutrition ratings remain fully accessible.'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="btn-chunky bg-[var(--surface)] text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
