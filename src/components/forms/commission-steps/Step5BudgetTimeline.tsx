"use client";

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CommissionFormData, budgetRanges, timelineOptions } from "@/lib/validations/commission";
import { Calendar, PoundSterling, Clock, Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Step5BudgetTimelineProps {
  form: UseFormReturn<CommissionFormData>;
}

export function Step5BudgetTimeline({ form }: Step5BudgetTimelineProps) {
  const selectedBudget = budgetRanges.find((b) => b.id === form.watch("budgetRange"));
  const selectedTimeline = timelineOptions.find((t) => t.id === form.watch("timeline"));
  const isRushProject = form.watch("rushProject");
  const isFlexibleTimeline = form.watch("flexibleTimeline");

  return (
    <div className="space-y-8">
      {/* Budget Range */}
      <FormField
        control={form.control}
        name="budgetRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold flex items-center gap-2">
              <PoundSterling className="w-5 h-5 text-accent" />
              Budget Range *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {budgetRanges.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {budget.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              This helps us recommend appropriate materials and design complexity
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedBudget && selectedBudget.id !== "flexible" && (
        <Card className="bg-muted/30 border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Selected Budget:</strong> {selectedBudget.label}
              <br />
              <span className="text-xs mt-2 block">
                Final pricing will be confirmed after discussing your specific requirements.
                Material costs, complexity, and timeline affect the final quote.
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Timeline */}
      <FormField
        control={form.control}
        name="timeline"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Desired Timeline *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="When do you need this completed?" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timelineOptions.map((timeline) => (
                  <SelectItem key={timeline.id} value={timeline.id}>
                    <div className="flex items-center gap-2">
                      {timeline.id === "1-2-weeks" && <Zap className="w-4 h-4 text-amber-500" />}
                      {timeline.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Complex pieces require more time to ensure quality craftsmanship
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedTimeline && selectedTimeline.id === "1-2-weeks" && (
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Rush Project Notice
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Rush projects (1-2 weeks) may incur additional fees and are subject to availability.
                  Complex pieces may not be feasible within this timeframe. We'll discuss options during consultation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Flexibility */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="flexibleTimeline"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  I'm flexible with the timeline
                </FormLabel>
                <FormDescription>
                  Flexibility allows us to optimize our schedule and may reduce costs
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rushProject"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  This is a rush/priority project
                </FormLabel>
                <FormDescription>
                  Check this if you need expedited service (additional fees may apply)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Preferred Start Date */}
      <FormField
        control={form.control}
        name="preferredStartDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Preferred Start Date (Optional)
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="date"
                className="text-base"
                min={new Date().toISOString().split("T")[0]}
              />
            </FormControl>
            <FormDescription>
              When would you ideally like us to begin work?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Summary Card */}
      {selectedBudget && selectedTimeline && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Badge variant="default">Project Planning Summary</Badge>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget Range:</span>
                <span className="font-medium">{selectedBudget.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timeline:</span>
                <span className="font-medium">{selectedTimeline.label}</span>
              </div>
              {isFlexibleTimeline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flexibility:</span>
                  <Badge variant="secondary" className="text-xs">Flexible timeline</Badge>
                </div>
              )}
              {isRushProject && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant="default" className="text-xs flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Rush project
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
