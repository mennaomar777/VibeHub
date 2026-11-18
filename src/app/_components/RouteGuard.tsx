"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function RouteGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/" || pathname === "/register";
  const [authorizedPath, setAuthorizedPath] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (isAuthPage) {
      if (token) {
        setAuthorizedPath(null);
        router.replace("/feed");
        return;
      }

      setAuthorizedPath(pathname);
      return;
    }

    if (!token) {
      setAuthorizedPath(null);
      router.replace("/");
      return;
    }

    setAuthorizedPath(pathname);
  }, [isAuthPage, pathname, router]);

  if (authorizedPath === pathname) return children;

  return <LoadingScreen />;
}
