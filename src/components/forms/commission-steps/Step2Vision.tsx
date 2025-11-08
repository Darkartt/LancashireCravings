"use client";

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CommissionFormData } from "@/lib/validations/commission";
import { Lightbulb, Ruler } from "lucide-react";

interface Step2VisionProps {
  form: UseFormReturn<CommissionFormData>;
}

export function Step2Vision({ form }: Step2VisionProps) {
  const visionLength = form.watch("vision")?.length || 0;
  const maxVisionLength = 2000;
  const minVisionLength = 50;

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <FormField
        control={form.control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              Project Name
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g., Oak Dining Table, Eagle Sculpture, Custom Bookshelf"
                className="text-base"
              />
            </FormControl>
            <FormDescription>
              Give your project a memorable name
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Vision Description */}
      <FormField
        control={form.control}
        name="vision"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Describe Your Vision *
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Tell us about your project vision... What do you imagine? What feeling or purpose should this piece embody? Be as detailed as possible - describe the style, aesthetic, any specific features or details you envision."
                className="min-h-[200px] text-base resize-y"
              />
            </FormControl>
            <div className="flex items-center justify-between">
              <FormDescription>
                The more detail you provide, the better we can understand your vision (minimum {minVisionLength} characters)
              </FormDescription>
              <Badge
                variant={visionLength >= minVisionLength ? "default" : "secondary"}
                className="text-xs"
              >
                {visionLength} / {maxVisionLength}
              </Badge>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Inspiration */}
      <FormField
        control={form.control}
        name="inspiration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Inspiration Sources (Optional)
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g., Art Deco, Japanese minimalism, Victorian furniture, modern Scandinavian"
                className="text-base"
              />
            </FormControl>
            <FormDescription>
              Any styles, periods, or aesthetics that inspire this project?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Intended Use */}
      <FormField
        control={form.control}
        name="intendedUse"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <Ruler className="w-4 h-4 text-accent" />
              Intended Use *
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Where will this piece live? How will it be used? Will it be functional, decorative, or both? Any special considerations (e.g., outdoor use, high-traffic area, display only)?"
                className="min-h-[120px] text-base resize-y"
              />
            </FormControl>
            <FormDescription>
              Understanding the context helps us design appropriately
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
