"use client";

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CommissionFormData, budgetRanges, timelineOptions } from "@/lib/validations/commission";
import { projectTypes, woodTypes, finishTypes } from "@/lib/data";
import { Send, User, Mail, Phone, MapPin, Info } from "lucide-react";

interface Step6ReviewProps {
  form: UseFormReturn<CommissionFormData>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function Step6Review({ form, onSubmit, isSubmitting }: Step6ReviewProps) {
  const formData = form.watch();

  const selectedProject = projectTypes.find((p) => p.id === formData.projectType);
  const selectedWood = woodTypes.find((w) => w.id === formData.woodType);
  const selectedFinish = finishTypes.find((f) => f.id === formData.finishType);
  const selectedBudget = budgetRanges.find((b) => b.id === formData.budgetRange);
  const selectedTimeline = timelineOptions.find((t) => t.id === formData.timeline);

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div className="space-y-6">
        <h3 className="text-xl font-serif font-semibold text-foreground">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" />
                  Full Name *
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Smith" className="text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  Email Address *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent" />
                  Phone Number *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="+44 7700 900000"
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  Location *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="City, Country"
                    className="text-base"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Helps us estimate shipping/delivery
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hearAboutUs"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                How did you hear about us?
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Google search, Instagram, referral, etc."
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalComments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Comments or Questions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Anything else you'd like us to know?"
                  className="min-h-[100px] text-base resize-y"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      {/* Project Summary */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-serif">Commission Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project Type */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">PROJECT TYPE</h4>
            <Badge variant="default" className="text-sm">
              {selectedProject?.name}
            </Badge>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">PROJECT NAME</h4>
            <p className="text-base font-medium">{formData.projectName || "Not specified"}</p>
          </div>

          {/* Vision */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">VISION</h4>
            <p className="text-sm text-foreground/80 line-clamp-3">
              {formData.vision || "Not specified"}
            </p>
          </div>

          {/* Materials */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">WOOD</h4>
              <p className="text-sm font-medium">{selectedWood?.name || "Not selected"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">FINISH</h4>
              <p className="text-sm font-medium">{selectedFinish?.name || "Not selected"}</p>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">BUDGET</h4>
              <p className="text-sm font-medium">{selectedBudget?.label || "Not specified"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">TIMELINE</h4>
              <p className="text-sm font-medium">{selectedTimeline?.label || "Not specified"}</p>
            </div>
          </div>

          {/* Reference Images */}
          {formData.hasReferences && formData.referenceImages && formData.referenceImages.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">REFERENCES</h4>
              <Badge variant="secondary" className="text-xs">
                {formData.referenceImages.length} image(s) uploaded
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <FormField
        control={form.control}
        name="agreeToTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 border-border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="cursor-pointer font-medium">
                I agree to the terms and conditions *
              </FormLabel>
              <FormDescription>
                By submitting this form, you agree that we may contact you regarding your commission request.
                We respect your privacy and will never share your information with third parties.
                View our{" "}
                <a href="/privacy" className="text-primary underline hover:text-primary/80">
                  privacy policy
                </a>
                .
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {/* Submit Button */}
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !form.formState.isValid}
          size="lg"
          className="w-full text-lg py-6"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Commission Request
            </>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          We'll review your request and contact you within 24 hours to discuss next steps
        </p>
      </div>
    </div>
  );
}
