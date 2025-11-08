import { CommissionFormData, commissionFormSchema } from "@/lib/validations/commission";

interface ProcessResult {
  body: Record<string, unknown>;
  status: number;
}

/**
 * Pure function to process commission form submissions
 * @param data - Form data from request body
 * @param ip - Client IP address
 * @returns Response object with body and status code
 */
export function processCommission(data: unknown, ip: string): ProcessResult {
  // Validate input data
  if (!data || typeof data !== "object") {
    return {
      body: { error: "invalid_data", message: "Invalid request data" },
      status: 400,
    };
  }

  // Validate against schema
  const validation = commissionFormSchema.safeParse(data);
  if (!validation.success) {
    return {
      body: {
        error: "validation_failed",
        message: "Form validation failed",
        details: validation.error.errors,
      },
      status: 400,
    };
  }

  const commissionData: CommissionFormData = validation.data;

  // Log commission request (in production, this would save to database)
  console.log("Commission request received:", {
    timestamp: new Date().toISOString(),
    ip,
    projectType: commissionData.projectType,
    projectName: commissionData.projectName,
    contact: {
      name: commissionData.fullName,
      email: commissionData.email,
      phone: commissionData.phone,
      location: commissionData.location,
    },
    budget: commissionData.budgetRange,
    timeline: commissionData.timeline,
  });

  // In production, you would:
  // 1. Save to database
  // 2. Send email notifications to admin and customer
  // 3. Create a tracking ID
  // 4. Integrate with CRM or project management system

  // For now, return success
  return {
    body: {
      success: true,
      message: "Commission request received successfully",
      requestId: `COMM-${Date.now()}`, // Generate a simple tracking ID
      estimatedResponse: "24-48 hours",
      contactEmail: commissionData.email,
    },
    status: 200,
  };
}
