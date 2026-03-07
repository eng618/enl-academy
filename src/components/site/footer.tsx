import { Separator, Text } from '@gv-tech/ui-web';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Separator className="mb-6" />
      <div className="site-footer-row">
        <Text variant="caption" className="text-muted-foreground">
          Built with faith, curiosity, and daily habits of learning.
        </Text>
        <Text variant="caption" className="text-muted-foreground">
          Psalm 119:105
        </Text>
      </div>
    </footer>
  );
}
