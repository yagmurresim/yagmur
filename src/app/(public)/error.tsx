"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-[420px]">
        <h1 className="font-display text-3xl text-ink mb-4">
          Bir şeyler ters gitti.
        </h1>
        <p className="text-ink-muted mb-8">
          Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <Button onClick={reset} variant="primary" size="lg">
          Tekrar Dene
        </Button>
      </div>
    </div>
  );
}