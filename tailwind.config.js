/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'templates/**/*.html.twig',
    'assets/js/**/*.js',
    'assets/js/**/*.jsx', // Si vous utilisez des fichiers React JSX
  ],
  theme: {
    extend: {
      animation: {
        correct: 'correct 3s ease forwards',
        wrong: 'wrong 3s ease forwards',
      },
      keyframes: {
        correct: {
          '0%, 22%, 42%': { background: 'mediumblue' },
          '20%, 40%, 60%': { background: 'linear-gradient(#0e0124, #22074d)' },
          '62%, 100%': { background: 'green' },
        },
        wrong: {
          '0%, 22%, 42%': { background: 'mediumblue' },
          '20%, 40%, 60%': { background: 'linear-gradient(#0e0124, #22074d)' },
          '62%, 100%': { background: 'crimson' },
        },
      },
    },
  },
  plugins: [],
}

