/**
 * STITCH Design System Colors
 * Dark mode-first color palette with cyan accent
 */

export const COLORS = {
  // Cyan accent palette (#13c8ec)
  cyan: {
    base: "#13c8ec",
    light: "#4dd9f5",
    lighter: "#8ee7fa",
    dark: "#0fa8c9",
    darker: "#0a7fa5",
  },

  // Status colors
  status: {
    good: "#0cce6b", // Green
    warning: "#ffa400", // Yellow
    poor: "#ff4e42", // Red
  },

  // Gray scale (dark mode)
  gray: {
    50: "oklch(0.98 0 0)",
    100: "oklch(0.95 0 0)",
    200: "oklch(0.92 0 0)",
    300: "oklch(0.85 0 0)",
    400: "oklch(0.708 0 0)",
    500: "oklch(0.556 0 0)",
    600: "oklch(0.399 0 0)",
    700: "oklch(0.269 0 0)",
    800: "oklch(0.205 0 0)",
    850: "oklch(0.145 0 0)",
    900: "oklch(0.08 0 0)",
  },

  // Background and surface
  background: {
    primary: "oklch(0.08 0 0)", // Very dark
    secondary: "oklch(0.145 0 0)", // Card/elevated
    tertiary: "oklch(0.205 0 0)", // Hover state
  },

  // Text
  text: {
    primary: "oklch(0.98 0 0)", // Near white
    secondary: "oklch(0.708 0 0)", // Medium gray
    tertiary: "oklch(0.556 0 0)", // Lighter gray
    disabled: "oklch(0.399 0 0)", // Disabled text
  },

  // Semantic
  success: "#0cce6b",
  warning: "#ffa400",
  error: "#ff4e42",
  info: "#13c8ec", // Cyan
};

/**
 * Get rating color based on performance
 */
export function getRatingColor(
  rating: "good" | "needs-improvement" | "poor"
): string {
  switch (rating) {
    case "good":
      return COLORS.status.good;
    case "needs-improvement":
      return COLORS.status.warning;
    case "poor":
      return COLORS.status.poor;
  }
}

/**
 * Color utilities
 */
export const colorUtils = {
  // Convert hex to RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  // Add opacity to hex color
  hexWithOpacity: (hex: string, opacity: number): string => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },

  // Get background tint for status color
  getStatusBackgroundTint: (
    status: "good" | "needs-improvement" | "poor"
  ): string => {
    const color = getRatingColor(status);
    return colorUtils.hexWithOpacity(color, 0.1);
  },
};
