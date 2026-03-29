"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useMockAuth } from "../../contexts/MockAuthContext";

const PUBLIC_PATH_PREFIXES = ["/web/login", "/web/signup"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function WebRouteGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading } = useMockAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user || isPublicPath(pathname)) {
      return;
    }

    const queryString = searchParams.toString();
    const nextPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(`/web/login?next=${encodeURIComponent(nextPath)}`);
  }, [isLoading, pathname, router, searchParams, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">로그인 상태를 확인하는 중입니다.</p>
      </div>
    );
  }

  if (!user && !isPublicPath(pathname)) {
    return null;
  }

  return <>{children}</>;
}
