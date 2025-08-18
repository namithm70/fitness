import React from 'react';

// Skip to content props
export interface SkipToContentProps {
  targetId?: string;
  children?: React.ReactNode;
}

// Screen reader only props
export interface ScreenReaderOnlyProps {
  children: React.ReactNode;
}

// Focus trap props
export interface FocusTrapProps {
  children: React.ReactNode;
  onEscape?: () => void;
}

// Accessible button props
export interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  [key: string]: any;
}

// Accessible form field props
export interface AccessibleFormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Accessible input props
export interface AccessibleInputProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  type?: string;
  className?: string;
  [key: string]: any;
}

// Accessible textarea props
export interface AccessibleTextareaProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  rows?: number;
  className?: string;
  [key: string]: any;
}

// Select option interface
export interface SelectOption {
  value: string;
  label: string;
}

// Accessible select props
export interface AccessibleSelectProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

// Live region props
export interface LiveRegionProps {
  children: React.ReactNode;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  className?: string;
}
