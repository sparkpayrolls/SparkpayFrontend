module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css,scss}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Ensure Tailwind doesn't conflict with existing styles
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts
  },
};
