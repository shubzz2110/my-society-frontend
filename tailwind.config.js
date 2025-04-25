/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "brand-hover": "var(--brand-hover)",
        bg: "var(--background)",
        "blue-500": "#3B82F6",
        "red-500": "#FF3D32",
        "red-900": "#661814",
        "green-500": "#22C55E",
        "green-600": "#1DA750",
        "surface-0": "rgb(var(--surface-0))",
        "surface-50": "rgb(var(--surface-50))",
        "surface-100": "rgb(var(--surface-100))",
        "surface-200": "rgb(var(--surface-200))",
        "surface-300": "rgb(var(--surface-300))",
        "surface-400": "rgb(var(--surface-400))",
        "surface-500": "rgb(var(--surface-500))",
        "surface-600": "rgb(var(--surface-600))",
        "surface-700": "rgb(var(--surface-700))",
        "surface-800": "rgb(var(--surface-800))",
        "surface-900": "rgb(var(--surface-900))",
        "surface-950": "rgb(var(--surface-950))",
        icon: "#6B7280",
      },
      container: {
        center: true,
      },
      borderRadius: {
        "2.5xl": "20px",
      },
      padding: {
        4.5: "18px",
      },
      margin: {
        4.5: "18px",
      },
      height: {
        4.5: "18px",
      },
      width: {
        4.5: "18px",
      },
      gap: {
        4.5: "18px",
      },
      space: {
        4.5: "18px",
      },
    },
  },
  darkMode: "class",
  plugins: [require("tailwindcss-primeui")],
};
