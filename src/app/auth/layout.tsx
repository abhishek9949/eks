"use client";

import React, { useState, useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import Loader from "@/components/common/Loader";
import { fetchAndRedirectIfNeeded } from "@/utils/fetchCookies";

export default function PersonalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [_, setPageName] = useLocalStorage("selectedMenu", "");
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    const checkAndRedirect = async () => {
      const redirect = await fetchAndRedirectIfNeeded();
      if (redirect?.url) {
        setPageName(redirect.name);
        window.location.href = redirect.url;
      } else {
        setIsPageLoading(false);
      }
    };
    checkAndRedirect();
  });

  return (
    <>
      {isPageLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
