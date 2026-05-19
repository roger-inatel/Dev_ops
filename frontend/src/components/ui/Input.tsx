import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", type, label, error, id, ...props }, ref) => {
        // Cria um ID único aleatório (ex: :r1:, :r2:) caso a gente não passe um id manual
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    // A mágica acontece aqui: conectamos a Label ao Input
                    <label htmlFor={inputId} className="text-sm font-medium text-foreground">
                        {label}
                    </label>
                )}

                <input
                    id={inputId} // E o input recebe o ID correspondente
                    type={type}
                    ref={ref}
                    className={`
            flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-muted-foreground
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors duration-200
            ${error
                            ? "border-destructive focus-visible:ring-destructive"
                            : "border-border focus-visible:ring-ring"
                        }
            ${className}
          `}
                    {...props}
                />

                {error && (
                    <span className="text-xs font-medium text-destructive mt-0.5">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";