"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterData = z.infer<typeof newsletterSchema>;

interface NewsletterSignupProps {
  variant?: "card" | "inline" | "minimal";
  title?: string;
  description?: string;
  className?: string;
}

export function NewsletterSignup({
  variant = "card",
  title = "Stay Updated",
  description = "Subscribe to our newsletter for exclusive updates, new products, and craftsmanship tips.",
  className = "",
}: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<NewsletterData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      setIsSuccess(true);
      toast.success("Successfully subscribed to newsletter!");
      form.reset();
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && variant !== "minimal") {
    return (
      <Alert className={`bg-primary/10 border-primary/20 ${className}`}>
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong>Success!</strong> You've been subscribed to our newsletter. Check your email for confirmation.
        </AlertDescription>
      </Alert>
    );
  }

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Subscribe</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {variant === "card" && (
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
          </p>
        )}
      </form>
    </Form>
  );

  if (variant === "minimal") {
    return (
      <div className={className}>
        <FormContent />
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`space-y-3 ${className}`}>
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <FormContent />
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
}
