"use client";

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CommissionFormData } from "@/lib/validations/commission";
import { projectTypes } from "@/lib/data";
import { Check } from "lucide-react";

interface Step1ProjectTypeProps {
  form: UseFormReturn<CommissionFormData>;
}

export function Step1ProjectType({ form }: Step1ProjectTypeProps) {
  const selectedProjectType = form.watch("projectType");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="projectType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">
              What type of project are you commissioning?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
              >
                {projectTypes.map((project) => (
                  <FormItem key={project.id}>
                    <FormControl>
                      <RadioGroupItem value={project.id} id={project.id} className="sr-only" />
                    </FormControl>
                    <FormLabel
                      htmlFor={project.id}
                      className="cursor-pointer"
                    >
                      <Card
                        className={`relative transition-all hover:shadow-lg ${
                          selectedProjectType === project.id
                            ? "border-2 border-primary shadow-md ring-2 ring-primary/20"
                            : "border-2 border-border hover:border-primary/50"
                        }`}
                      >
                        {selectedProjectType === project.id && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        <CardContent className="pt-6 pb-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="text-xl font-serif font-bold text-foreground">
                                {project.name}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {project.examples}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Badge variant="secondary" className="text-xs">
                                From £{project.basePrice}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.timeframe}
                              </Badge>
                              <Badge
                                variant={
                                  project.complexity === "simple"
                                    ? "default"
                                    : project.complexity === "moderate"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="text-xs capitalize"
                              >
                                {project.complexity}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedProjectType && (
        <Card className="bg-muted/30 border-border">
          <CardContent className="pt-6">
            <CardDescription className="text-sm">
              <strong className="text-foreground">Selected:</strong>{" "}
              {projectTypes.find((p) => p.id === selectedProjectType)?.name}
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                This is an estimate. Final pricing will be determined based on your specific requirements, materials, and complexity.
              </span>
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
