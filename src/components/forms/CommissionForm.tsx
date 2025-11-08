"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

import {
  commissionFormSchema,
  type CommissionFormData,
} from "@/lib/validations/commission";

import { Step1ProjectType } from "./commission-steps/Step1ProjectType";
import { Step2Vision } from "./commission-steps/Step2Vision";
import { Step3References } from "./commission-steps/Step3References";
import { Step4Materials } from "./commission-steps/Step4Materials";
import { Step5BudgetTimeline } from "./commission-steps/Step5BudgetTimeline";
import { Step6Review } from "./commission-steps/Step6Review";

const steps = [
  { id: 1, name: "Project Type", description: "What would you like created?" },
  { id: 2, name: "Your Vision", description: "Describe your project" },
  { id: 3, name: "References", description: "Share inspiration" },
  { id: 4, name: "Materials", description: "Wood & finish selection" },
  { id: 5, name: "Budget & Timeline", description: "Planning details" },
  { id: 6, name: "Review & Submit", description: "Final confirmation" },
];

export function CommissionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommissionFormData>({
    resolver: zodResolver(commissionFormSchema),
    mode: "onChange",
    defaultValues: {
      projectType: "",
      projectName: "",
      vision: "",
      inspiration: "",
      intendedUse: "",
      hasReferences: false,
      referenceImages: [],
      referenceNotes: "",
      woodType: "",
      finishType: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
        unit: "cm",
      },
      additionalRequirements: "",
      budgetRange: "",
      timeline: "",
      flexibleTimeline: false,
      rushProject: false,
      preferredStartDate: "",
      fullName: "",
      email: "",
      phone: "",
      location: "",
      hearAboutUs: "",
      additionalComments: "",
      agreeToTerms: false,
    },
  });

  const progress = (currentStep / steps.length) * 100;

  // Validate current step before proceeding
  const validateStep = async (step: number): Promise<boolean> => {
    let fields: string[] = [];

    switch (step) {
      case 1:
        fields = ["projectType"];
        break;
      case 2:
        fields = ["projectName", "vision", "intendedUse"];
        break;
      case 3:
        fields = ["hasReferences"];
        break;
      case 4:
        fields = ["woodType", "finishType"];
        break;
      case 5:
        fields = ["budgetRange", "timeline"];
        break;
      case 6:
        fields = ["fullName", "email", "phone", "location", "agreeToTerms"];
        break;
      default:
        return true;
    }

    const isValid = await form.trigger(fields as any);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Please complete all required fields before continuing");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CommissionFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      toast.success("Commission request submitted successfully! We'll contact you within 24 hours.");
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      toast.error("Failed to submit commission request. Please try again or contact us directly.");
      console.error("Commission submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProjectType form={form} />;
      case 2:
        return <Step2Vision form={form} />;
      case 3:
        return <Step3References form={form} />;
      case 4:
        return <Step4Materials form={form} />;
      case 5:
        return <Step5BudgetTimeline form={form} />;
      case 6:
        return <Step6Review form={form} onSubmit={form.handleSubmit(onSubmit)} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <Card className="mb-8 border-2 border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif font-bold text-foreground">
            Commission Request
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Let's bring your vision to life with bespoke woodcarving
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-accent text-accent-foreground border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <Badge
                    variant={currentStep === step.id ? "default" : "secondary"}
                    className="text-xs whitespace-nowrap"
                  >
                    {step.name}
                  </Badge>
                </div>
              </div>
              {index < steps.length - 1 && (
                <Separator
                  className={`w-12 md:w-20 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                  orientation="horizontal"
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground mt-2">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
        </p>
      </div>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">
                {steps[currentStep - 1].name}
              </CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
          </Card>

          {/* Navigation Buttons */}
          {currentStep < steps.length && (
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
