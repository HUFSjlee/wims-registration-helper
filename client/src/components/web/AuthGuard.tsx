"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useMockAuth } from "../../contexts/MockAuthContext";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useMockAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/web/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">로딩 중...</p>
      </div>
    );
  }
  if (!user) {
    return null;
  }
  return <>{children}</>;
}
