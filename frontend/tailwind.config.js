/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lol-blue": "#0596aa",
        "lol-gold": "#c89b3c",
        "lol-dark": "#0f1419",
        "lol-bronze": "#cd7f32",
        "lol-silver": "#c0c0c0",
        "lol-platinum": "#e5e4e2",
        "lol-diamond": "#b9f2ff",
        "lol-master": "#9932cc",
        "lol-grandmaster": "#ff073a",
        "lol-challenger": "#ffd700",
        "riot-blue": "#003f7f",
        "champion-gold": "#463714",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'lol-gradient': 'linear-gradient(135deg, #0f1419 0%, #1e2328 50%, #0f1419 100%)',
        'gold-gradient': 'linear-gradient(135deg, #c89b3c 0%, #f0e6d2 50%, #c89b3c 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #c89b3c, 0 0 10px #c89b3c, 0 0 15px #c89b3c' },
          '100%': { boxShadow: '0 0 10px #c89b3c, 0 0 20px #c89b3c, 0 0 30px #c89b3c' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
