'use client';

import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
}

interface FormConfig {
  [key: string]: ValidationRule;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationConfig: FormConfig
) {
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields: Record<keyof T, FormField> = {} as any;
    Object.keys(initialValues).forEach((key) => {
      initialFields[key as keyof T] = {
        value: initialValues[key as keyof T],
        error: null,
        touched: false,
      };
    });
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const rules = validationConfig[name as string];
      if (!rules) return null;

      if (rules.required && (!value || value.toString().trim() === '')) {
        return `${String(name)} is required`;
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        return `${String(name)} must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value && value.length > rules.maxLength) {
        return `${String(name)} must not exceed ${rules.maxLength} characters`;
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        return `${String(name)} format is invalid`;
      }

      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [validationConfig]
  );

  const updateField = useCallback(
    (name: keyof T, value: any, shouldValidate = true) => {
      setFields((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: shouldValidate ? validateField(name, value) : prev[name].error,
          touched: true,
        },
      }));
    },
    [validateField]
  );

  const validateAll = useCallback(() => {
    const newFields = { ...fields };
    let hasErrors = false;

    Object.keys(fields).forEach((key) => {
      const fieldKey = key as keyof T;
      const error = validateField(fieldKey, fields[fieldKey].value);
      newFields[fieldKey] = {
        ...newFields[fieldKey],
        error,
        touched: true,
      };
      if (error) hasErrors = true;
    });

    setFields(newFields);
    return !hasErrors;
  }, [fields, validateField]);

  const getValues = useCallback(() => {
    const values: Partial<T> = {};
    Object.keys(fields).forEach((key) => {
      values[key as keyof T] = fields[key as keyof T].value;
    });
    return values as T;
  }, [fields]);

  const reset = useCallback(() => {
    const resetFields: Record<keyof T, FormField> = {} as any;
    Object.keys(initialValues).forEach((key) => {
      resetFields[key as keyof T] = {
        value: initialValues[key as keyof T],
        error: null,
        touched: false,
      };
    });
    setFields(resetFields);
    setIsSubmitting(false);
  }, [initialValues]);

  const hasErrors = Object.values(fields).some((field) => field.error !== null);
  const isValid = !hasErrors && Object.values(fields).every((field) => field.touched);

  return {
    fields,
    updateField,
    validateAll,
    getValues,
    reset,
    isSubmitting,
    setIsSubmitting,
    hasErrors,
    isValid,
  };
}

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  postcode: /^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][ABD-HJLNP-UW-Z]{2}$/i,
  url: /^https?:\/\/.+\..+/,
};

// Common validation rules
export const commonValidations = {
  required: { required: true },
  email: {
    required: true,
    pattern: validationPatterns.email,
    custom: (value: string) => {
      if (value && !validationPatterns.email.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    },
  },
  phone: {
    pattern: validationPatterns.phone,
    custom: (value: string) => {
      if (value && !validationPatterns.phone.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    },
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
};
