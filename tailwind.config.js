/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Technical Tooling Palette
        'tech-bg': '#0D0D0D',
        'tech-surface': '#1A1A1A',
        'tech-orange': '#FF4F00',
        'tech-white': '#FFFFFF',
        'tech-grey': '#888888',
        'tech-green': '#4ADE80',
        'tech-border': '#333333',
        // Keep legacy primary for compatibility
        primary: '#2563EB',
      },
      fontFamily: {
        'mono': ['Consolas', 'Monaco', 'Courier New', 'monospace'],
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
