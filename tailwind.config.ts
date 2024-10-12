/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: {
          "light-100": "#F9E3DF", // cards
          "light-200": "#F3CCC4", // cards
          "light-300": "#D53636", // links, buttons
          "light-400": "#A92323", // btn hover
          "dark-100": "#796360",
          "dark-200": "#503E3A",
          "dark-300": "#EC6C6C",
          "dark-400": "#EADFDF",
        },
        secondary: {
          "light-100": "#FFFFFF", // background color
          "light-200": "#EFF5F7", // btn text
          "light-300": "#DFF4F7",
          "light-400": "#27284E", // text
          "dark-100": "#27284E",
          "dark-200": "#2EC5D2",
          "dark-300": "#CAF1F9",
          "dark-400": "#FFFFFF",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
};
export default config;
