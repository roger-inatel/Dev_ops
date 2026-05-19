import React, { forwardRef, useId } from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: React.ReactNode;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className = "", label, error, id, ...props }, ref) => {
        const generatedId = useId();
        const checkboxId = id || generatedId;

        return (
            <div className="flex flex-col pt-2">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id={checkboxId}
                        ref={ref}
                        className={`mt-1 size-4 rounded border-border text-primary focus:ring-primary accent-primary ${className}`}
                        {...props}
                    />
                    {label && (
                        <label htmlFor={checkboxId} className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                            {label}
                        </label>
                    )}
                </div>
                {error && (
                    <span className="text-xs font-medium text-destructive mt-1 ml-7">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";