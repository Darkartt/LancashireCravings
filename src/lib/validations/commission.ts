import { z } from "zod";

// Step 1: Project Type Selection
export const step1Schema = z.object({
  projectType: z.string().min(1, "Please select a project type"),
});

// Step 2: Vision & Description
export const step2Schema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters").max(100, "Project name too long"),
  vision: z.string().min(50, "Please provide at least 50 characters describing your vision").max(2000, "Description too long (max 2000 characters)"),
  inspiration: z.string().optional(),
  intendedUse: z.string().min(10, "Please describe the intended use").max(500, "Description too long"),
});

// Step 3: Design References
export const step3Schema = z.object({
  hasReferences: z.boolean(),
  referenceImages: z.array(z.string()).optional(),
  referenceNotes: z.string().max(1000, "Notes too long").optional(),
});

// Step 4: Material & Finish Selection
export const step4Schema = z.object({
  woodType: z.string().min(1, "Please select a wood type"),
  finishType: z.string().min(1, "Please select a finish type"),
  dimensions: z.object({
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    unit: z.enum(["cm", "inches"]),
  }).optional(),
  additionalRequirements: z.string().max(500, "Additional requirements too long").optional(),
});

// Step 5: Budget & Timeline
export const step5Schema = z.object({
  budgetRange: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  flexibleTimeline: z.boolean(),
  rushProject: z.boolean(),
  preferredStartDate: z.string().optional(),
});

// Step 6: Contact & Review
export const step6Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number too long"),
  location: z.string().min(2, "Location required").max(200, "Location too long"),
  hearAboutUs: z.string().optional(),
  additionalComments: z.string().max(1000, "Comments too long").optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

// Complete commission form schema
export const commissionFormSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
  ...step6Schema.shape,
});

export type CommissionFormData = z.infer<typeof commissionFormSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type Step6Data = z.infer<typeof step6Schema>;

// Budget ranges
export const budgetRanges = [
  { id: "under-500", label: "Under £500", min: 0, max: 500 },
  { id: "500-1000", label: "£500 - £1,000", min: 500, max: 1000 },
  { id: "1000-2500", label: "£1,000 - £2,500", min: 1000, max: 2500 },
  { id: "2500-5000", label: "£2,500 - £5,000", min: 2500, max: 5000 },
  { id: "5000-10000", label: "£5,000 - £10,000", min: 5000, max: 10000 },
  { id: "10000-plus", label: "£10,000+", min: 10000, max: Infinity },
  { id: "flexible", label: "Flexible / Open to Discussion", min: 0, max: Infinity },
];

// Timeline options
export const timelineOptions = [
  { id: "1-2-weeks", label: "1-2 weeks (Rush)" },
  { id: "3-4-weeks", label: "3-4 weeks" },
  { id: "1-2-months", label: "1-2 months" },
  { id: "2-3-months", label: "2-3 months" },
  { id: "3-6-months", label: "3-6 months" },
  { id: "6-plus-months", label: "6+ months" },
  { id: "flexible", label: "Flexible / Whenever ready" },
];
