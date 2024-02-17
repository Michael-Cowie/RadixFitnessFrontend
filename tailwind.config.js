/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0081ff",

          secondary: "#cd0000",

          accent: "#0048ff",

          neutral: "#020515",

          "base-100": "#fff6e1",

          info: "#00e7ff",

          success: "#00f079",

          warning: "#e07300",

          error: "#ff6c8b",
        },
      },
    ],
  },
};
