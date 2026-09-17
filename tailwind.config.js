module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md', './assets/js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { ink: '#090d16', accent: '#6366f1', mint: '#a3e6bb' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};
