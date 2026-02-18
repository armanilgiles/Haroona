import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StyleInspo() {
  return (
    <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
      <h3 className="font-serif text-sm font-semibold" data-testid="text-style-inspo">
        Style Inspo
      </h3>
      <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">
        Follow the Latest Trends
      </p>
      <Button
        variant="outline"
        className="w-full rounded-full text-xs"
        data-testid="button-follow-trends"
      >
        Follow
      </Button>
    </Card>
  );
}
