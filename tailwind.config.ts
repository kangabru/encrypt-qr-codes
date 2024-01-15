import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
      },
      minHeight: {
        40: "10rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("./tailwind.utils.js")],
}
export default config
