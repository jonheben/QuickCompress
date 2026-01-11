/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Technical Brutalist Dark Palette
        'tech-bg': '#000000',                    // True black background
        'tech-surface': '#0A0A0A',               // Slightly elevated black
        'tech-surface-secondary': '#141414',     // Secondary surfaces

        'tech-text': '#FFFFFF',                  // Primary white text
        'tech-text-secondary': '#A0A0A0',        // Gray secondary
        'tech-text-muted': '#666666',            // Muted hints

        'tech-orange': '#FF4F00',                // International Orange
        'tech-orange-hover': '#FF6A1F',          // Hover state
        'tech-orange-dark': '#CC3F00',           // Active state

        'tech-green': '#00CC99',                 // Industrial Mint
        'tech-green-dark': '#00A37A',            // Hover state

        'tech-red': '#FF3B30',                   // Errors

        'tech-border': '#333333',                // Hairline borders
        'tech-border-light': '#1A1A1A',          // Subtle separators
        'tech-divider': '#444444',               // Section dividers
        'tech-border-teal': '#2A5555',           // Teal accent option

        // Keep legacy colors for compatibility
        'tech-white': '#ffffff',
        'tech-grey': '#9ca3af',
        'tech-grey-muted': '#6b7280',
        primary: '#FF4F00',
      },
      fontFamily: {
        'grotesk': ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
        'sans': ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'none': 'none',
        'brutalist': '0 0 0 1px #333333',
        'brutalist-orange': '0 0 0 2px #FF4F00',
        'brutalist-hover': '0 0 0 2px #666666',
      },
    },
  },
  plugins: [],
}
