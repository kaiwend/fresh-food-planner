import { type Config } from "tailwindcss";
import typography from "typography";
import daisyui from "daisyui";

export default {
  content: ["{routes,islands,components}/**/*.{ts,tsx}"],
  // deno-lint-ignore no-explicit-any
  plugins: [typography, daisyui as any],
  daisyui: {
    themes: ["light", "dark", "lemonade", "autumn", "aqua", "nord"],
    logs: false,
  },
} satisfies Config;
