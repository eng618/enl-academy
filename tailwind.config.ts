import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@gv-tech/ui-web/**/*.{js,ts,jsx,tsx,mjs,cjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
