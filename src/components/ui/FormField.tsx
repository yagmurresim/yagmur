import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, required, id, className, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-ink">
          {label}
          {required && (
            <span className="text-plum ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
        {hint && !error && (
          <p id={hintId} className="text-xs text-ink-muted">{hint}</p>
        )}
        <input
          ref={ref}
          id={fieldId}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={cn(
            "h-11 w-full px-3.5 rounded-[8px] border bg-white font-body text-sm text-ink placeholder:text-ink-muted/60 transition-colors",
            "focus:outline-none focus:ring-1 focus:ring-violet focus:border-violet",
            error ? "border-red-400" : "border-line",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, required, id, className, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const errorId = `${fieldId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-plum ml-0.5" aria-hidden="true">*</span>}
          {hint && <span className="text-ink-muted font-normal ml-1.5 text-xs">{hint}</span>}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          rows={4}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full px-3.5 py-3 rounded-[8px] border bg-white font-body text-sm text-ink placeholder:text-ink-muted/60 transition-colors resize-y",
            "focus:outline-none focus:ring-1 focus:ring-violet focus:border-violet",
            error ? "border-red-400" : "border-line",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";