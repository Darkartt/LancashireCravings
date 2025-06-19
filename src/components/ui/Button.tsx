'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'disabled:pointer-events-none',
      'transform-gpu', // Enable hardware acceleration
    ];

    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-accent-primary to-accent-warm',
        'text-surface-elevated shadow-lg',
        'hover:shadow-xl hover:scale-105',
        'focus:ring-accent-primary/50',
        'active:scale-95',
      ],
      secondary: [
        'bg-accent-secondary text-surface-elevated',
        'shadow-md hover:shadow-lg',
        'hover:bg-accent-secondary/90',
        'focus:ring-accent-secondary/50',
      ],
      outline: [
        'border-2 border-accent-primary text-accent-primary',
        'hover:bg-accent-primary hover:text-surface-elevated',
        'focus:ring-accent-primary/50',
      ],
      ghost: [
        'text-accent-primary hover:bg-accent-primary/10',
        'focus:ring-accent-primary/50',
      ],
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ');

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!isLoading && leftIcon}
        
        <span className={isLoading ? 'opacity-70' : ''}>
          {children}
        </span>
        
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
