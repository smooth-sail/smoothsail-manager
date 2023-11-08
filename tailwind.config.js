/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindcssForms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "ss-blgr": "#239cba",
        "ss-blgr-hover": "#28B1D4",
        "ss-bl": "#23395b",
        "ss-coral": "#eb9486",
      },
    },
  },
  plugins: [tailwindcssForms],
};
