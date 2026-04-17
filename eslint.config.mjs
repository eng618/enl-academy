import { nextjs } from '@gv-tech/eslint-config';

/**
 * ESLint configuration for Next.js projects.
 * Uses @gv-tech/eslint-config for sensible defaults.
 * For more information on configuration options, see:
 * https://github.com/Garcia-Ventures/eslint-config
 */
export default [
  ...nextjs,
  {
    // Project-level ignores on top of @gv-tech/eslint-config commonIgnores.
    // .open-next and .wrangler contain generated Cloudflare Worker bundles
    // (1000+ JS files) that must not be linted.
    ignores: ['eslint.config.mjs', '.open-next/**', '.wrangler/**', 'tsconfig.tsbuildinfo'],
  },
];
