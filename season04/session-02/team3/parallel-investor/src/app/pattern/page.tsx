// ============================================
// Feature A: Pattern Similarity Engine
// Owner: Team 1 (UX rewrite by Team C)
// ============================================

"use client";

import { Suspense } from "react";
import PatternPageContent from "./PatternPageContent";

export default function PatternPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-zinc-500 animate-pulse">로딩 중...</p>
        </div>
      }
    >
      <PatternPageContent />
    </Suspense>
  );
}
