/**
 * Central Feature Flags configuration for WiseFoodies
 */
export const FEATURES = {
  /**
   * Scanner Feature Flag
   * Set to true to reactivate camera scanning and label OCR analysis.
   * When false, the Scanner page presents an interactive Coming Soon state with camera access disabled.
   */
  ENABLE_SCANNER: false,
} as const;
