import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";

type InlineAlertProps = {
  message: string;
  variant: "error" | "info" | "warning";
  onDismiss?: () => void;
};

export function InlineAlert({ message, variant, onDismiss }: InlineAlertProps) {
  if (!message) return null;

  const variantClasses = {
    error: "bg-destructive/15 text-destructive border-destructive/50",
    info: "bg-blue-500/15 text-blue-500 border-blue-500/50",
    warning: "bg-yellow-500/15 text-yellow-500 border-yellow-500/50",
  };

  return (
    <Alert
      className={`${variantClasses[variant]} flex items-center justify-between`}
    >
      <AlertDescription>{message}</AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 text-current hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </Alert>
  );
}
