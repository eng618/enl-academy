import { Separator, Text } from '@gv-tech/ui-web';

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <Separator className="mb-6" />
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
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
