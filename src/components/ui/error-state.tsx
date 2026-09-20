"use client";

import { isApiError } from "@/lib/api/error";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  error,
  title = "Bir hata olustu",
  onRetry,
  className,
}: ErrorStateProps) {
  const message = error instanceof Error ? error.message : String(error);
  const code = isApiError(error) ? error.code : undefined;
  const status = isApiError(error) ? error.status : undefined;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 py-8 text-center ${className ?? ""}`}
    >
      <AlertCircle className="size-8 text-destructive" />
      <p className="text-sm font-medium text-destructive">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {(code || status) && (
        <p className="text-xs text-muted-foreground/70 font-mono">
          {status ? `HTTP ${status}` : ""}
          {status && code ? " · " : ""}
          {code ? code : ""}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RefreshCw className="mr-2 size-4" />
          Tekrar Dene
        </Button>
      )}
    </div>
  );
}
