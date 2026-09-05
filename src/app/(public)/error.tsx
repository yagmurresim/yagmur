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
    <div className="flex min-h-[70vh] items-center bg-paper px-6">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="font-display text-4xl text-ink">Sayfa yüklenemedi.</h1>
        <p className="mt-3 max-w-[36ch] text-ink-muted">Beklenmedik bir hata oluştu. Yeniden deneyin.</p>
        <div className="mt-8">
          <Button onClick={reset} variant="primary" size="lg">
            Tekrar dene
          </Button>
        </div>
      </div>
    </div>
  );
}
