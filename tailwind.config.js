/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#282828",
        },
        gray: {
          800: "rgb(33, 37, 41)",
        },
        blue: {
          DEFAULT: "rgb(13, 110, 253)",
          hover: "#0b5ed7",
        },
        yellow: {
          DEFAULT: "rgb(255, 200, 35)",
          hover: "#ffca2c",
        },
        danger: {
          DEFAULT: "#dc3545",
        },
      },
      fontFamily: {
        main: ["Courier", "monospace"],
      },
    },
  },
  plugins: [],
};
