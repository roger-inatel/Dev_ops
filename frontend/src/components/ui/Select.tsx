import React, { forwardRef, useId } from "react";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = "", label, error, id, options, placeholder = "Selecione...", ...props }, ref) => {
        const generatedId = useId();
        const selectId = id || generatedId;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label htmlFor={selectId} className="text-sm font-medium text-foreground">
                        {label}
                    </label>
                )}
                <select
                    id={selectId}
                    ref={ref}
                    className={`
            flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors duration-200
            ${error
                            ? "border-destructive focus-visible:ring-destructive text-destructive"
                            : "border-border focus-visible:ring-ring"
                        }
            ${className}
          `}
                    {...props}
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <span className="text-xs font-medium text-destructive mt-0.5">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";