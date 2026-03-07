export const semanticTokenMap = {
  'site-bg': 'background',
  'site-fg': 'foreground',
  'site-surface': 'card',
  'site-surface-fg': 'cardForeground',
  'site-brand': 'primary',
  'site-brand-fg': 'primaryForeground',
  'site-accent': 'secondary',
  'site-accent-fg': 'secondaryForeground',
  'site-muted': 'muted',
  'site-muted-fg': 'mutedForeground',
  'site-border': 'border',
} as const;

type UiThemeTokens = Record<(typeof semanticTokenMap)[keyof typeof semanticTokenMap], string>;

export function applySemanticTokens(root: HTMLElement, tokens: UiThemeTokens): void {
  for (const [alias, tokenName] of Object.entries(semanticTokenMap)) {
    root.style.setProperty(`--${alias}`, tokens[tokenName]);
  }
}
