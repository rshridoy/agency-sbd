import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const FormField = forwardRef<HTMLInputElement & HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, multiline, rows = 4, className, ...props }, ref) => {
    const baseClass = cn(
      "w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors",
      "border-gray-300 bg-white placeholder-gray-400",
      "focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
      error && "border-red-400 focus:border-red-400 focus:ring-red-100",
      className
    );

    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            className={baseClass}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={baseClass}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
