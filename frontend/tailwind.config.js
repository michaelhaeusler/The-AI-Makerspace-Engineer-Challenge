/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 70s Theme Colors
        'retro-70s-orange': '#FF6B35',
        'retro-70s-yellow': '#F7C242',
        'retro-70s-green': '#4A7C59',
        'retro-70s-brown': '#8B4513',
        'retro-70s-cream': '#F5F5DC',
        'retro-70s-rust': '#D2691E',
        'retro-70s-olive': '#6B8E23',
        'retro-70s-gold': '#DAA520',
        'retro-70s-teal': '#008080',
        'retro-70s-pink': '#FF69B4',
        'retro-70s-purple': '#9370DB',

        // 80s Theme Colors
        'retro-80s-cyan': '#00FFFF',
        'retro-80s-magenta': '#FF00FF',
        'retro-80s-yellow': '#FFFF00',
        'retro-80s-black': '#000000',
        'retro-80s-white': '#FFFFFF',
        'retro-80s-blue': '#0000FF',
        'retro-80s-red': '#FF0000',
        'retro-80s-green': '#00FF00',
        'retro-80s-orange': '#FF8000',
        'retro-80s-purple': '#8000FF',
        'retro-80s-pink': '#FF0080',

        // Legacy colors for backward compatibility
        'retro-orange': '#FF6B35',
        'retro-yellow': '#F7C242',
        'retro-green': '#4A7C59',
        'retro-brown': '#8B4513',
        'retro-cream': '#F5F5DC',
        'retro-rust': '#D2691E',
        'retro-olive': '#6B8E23',
        'retro-gold': '#DAA520',
        'retro-teal': '#008080',
        'retro-pink': '#FF69B4',
        'retro-purple': '#9370DB',
      },
      fontFamily: {
        'groovy': ['Comic Sans MS', 'cursive'],
        'retro': ['Courier New', 'monospace'],
        'disco': ['Arial Black', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'retro-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23FF6B35\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'groove': 'groove 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        groove: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
