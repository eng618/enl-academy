import { nextjs } from '@gv-tech/eslint-config';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * ESLint configuration for Next.js projects.
 * Uses @gv-tech/eslint-config for sensible defaults.
 * For more information on configuration options, see:
 * https://github.com/Garcia-Ventures/eslint-config
 */
export default defineConfig([...nextjs, globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])]);
