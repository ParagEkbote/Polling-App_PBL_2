// ui.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface FormGroupProps {
  className?: string;
  children: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-6 py-4 mb-6 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`block text-sm font-medium text-gray-700 mb-6 ${className}`}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mb-6";
    
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
    };
    
    const sizes = {
      sm: "h-8 px-6 py-4 text-sm",
      md: "h-10 px-6 py-4 text-base",
      lg: "h-12 px-6 py-4 text-lg"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", children }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-lg shadow-md p-6 mb-6 ${className}`}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const FormGroup: React.FC<FormGroupProps> = ({ className = "", children }) => {
  return (
    <div className={`space-y-7 mb-6 ${className}`}>
      {children}
    </div>
  );
};
FormGroup.displayName = "FormGroup";