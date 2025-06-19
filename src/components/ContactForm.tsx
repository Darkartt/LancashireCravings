'use client';

import { useState } from 'react';
import { useFormValidation, commonValidations } from '../hooks/useFormValidation';
import Input from './ui/Input';
import Button from './ui/Button';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  projectType: string;
  budget: string;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  projectType: '',
  budget: '',
};

const validationConfig = {
  name: commonValidations.name,
  email: commonValidations.email,
  phone: {
    ...commonValidations.phone,
    required: false, // Optional field
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 100,
  },
  message: commonValidations.message,
  projectType: commonValidations.required,
  budget: commonValidations.required,
};

const projectTypes = [
  { value: 'furniture', label: 'Custom Furniture' },
  { value: 'sculpture', label: 'Artistic Sculpture' },
  { value: 'functional', label: 'Functional Art' },
  { value: 'architectural', label: 'Architectural Elements' },
  { value: 'other', label: 'Other' },
];

const budgetRanges = [
  { value: '500-1000', label: '£500 - £1,000' },
  { value: '1000-2500', label: '£1,000 - £2,500' },
  { value: '2500-5000', label: '£2,500 - £5,000' },
  { value: '5000-10000', label: '£5,000 - £10,000' },
  { value: '10000+', label: '£10,000+' },
  { value: 'discuss', label: 'Let\'s discuss' },
];

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  className?: string;
}

export default function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    fields,
    updateField,
    validateAll,
    getValues,
    reset,
    isSubmitting,
    setIsSubmitting,
    hasErrors,
  } = useFormValidation(initialFormData, validationConfig);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = getValues();
      
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default form submission (you can replace this with your API endpoint)
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }
      }

      setSubmitStatus('success');
      setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          type="text"
          value={fields.name.value}
          onChange={(e) => updateField('name', e.target.value)}
          error={fields.name.touched ? fields.name.error : null}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Email Address"
          type="email"
          value={fields.email.value}
          onChange={(e) => updateField('email', e.target.value)}
          error={fields.email.touched ? fields.email.error : null}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Phone Number"
          type="tel"
          value={fields.phone.value}
          onChange={(e) => updateField('phone', e.target.value)}
          error={fields.phone.touched ? fields.phone.error : null}
          helperText="Optional - for urgent inquiries"
          disabled={isSubmitting}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Project Type <span className="text-red-500">*</span>
          </label>
          <select
            value={fields.projectType.value}
            onChange={(e) => updateField('projectType', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-colors disabled:opacity-50"
            required
            disabled={isSubmitting}
          >
            <option value="">Select a project type</option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {fields.projectType.touched && fields.projectType.error && (
            <p className="text-sm text-red-600">{fields.projectType.error}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Budget Range <span className="text-red-500">*</span>
          </label>
          <select
            value={fields.budget.value}
            onChange={(e) => updateField('budget', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-colors disabled:opacity-50"
            required
            disabled={isSubmitting}
          >
            <option value="">Select budget range</option>
            {budgetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          {fields.budget.touched && fields.budget.error && (
            <p className="text-sm text-red-600">{fields.budget.error}</p>
          )}
        </div>
      </div>

      <Input
        label="Subject"
        type="text"
        value={fields.subject.value}
        onChange={(e) => updateField('subject', e.target.value)}
        error={fields.subject.touched ? fields.subject.error : null}
        required
        disabled={isSubmitting}
        placeholder="Brief description of your project"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          Project Details <span className="text-red-500">*</span>
        </label>
        <textarea
          value={fields.message.value}
          onChange={(e) => updateField('message', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-colors disabled:opacity-50 resize-vertical"
          placeholder="Tell us about your vision, dimensions, preferred materials, timeline, and any specific requirements..."
          required
          disabled={isSubmitting}
        />
        {fields.message.touched && fields.message.error && (
          <p className="text-sm text-red-600">{fields.message.error}</p>
        )}
      </div>

      {submitStatus !== 'idle' && (
        <div
          className={`p-4 rounded-lg ${
            submitStatus === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
          role="alert"
        >
          {submitMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={reset}
          disabled={isSubmitting}
        >
          Clear Form
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          disabled={hasErrors || isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
}
