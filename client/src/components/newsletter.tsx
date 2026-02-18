import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNewsletterSchema } from "@shared/schema";
import type { InsertNewsletter } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = insertNewsletterSchema.extend({});

export function Newsletter() {
  const { toast } = useToast();

  const form = useForm<InsertNewsletter>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: InsertNewsletter) => {
    try {
      await apiRequest("POST", "/api/newsletter", values);
      toast({ title: "Subscribed!", description: "You'll receive stylish updates soon." });
      form.reset();
    } catch {
      toast({ title: "Already subscribed", description: "This email is already on our list.", variant: "destructive" });
    }
  };

  return (
    <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
      <h3 className="font-serif text-sm font-semibold" data-testid="text-newsletter-title">
        Get Stylish Updates
      </h3>
      <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">
        From Paris, Copenhagen & Beyond!
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-1.5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    className="rounded-full text-xs"
                    data-testid="input-newsletter-email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            size="sm"
            className="rounded-full text-xs"
            data-testid="button-newsletter-submit"
          >
            Sign Up
          </Button>
        </form>
      </Form>
    </Card>
  );
}
