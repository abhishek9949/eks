"use client";
import "@/css/style.scss";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PreLogin from "@/components/Layouts/PreLogin";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/constants/MaterialTheme";
import StoreProvider from "@/redux/StoreProvider";
import { usePathname } from "next/navigation";
import ToastMessage from "@/components/common/ToastMessage";
import Footer from "@/components/Layouts/Footer";
import dynamic from "next/dynamic";

// Dynamically import Lottie with no SSR
const LottieAnimation = dynamic(
  () => import("@/components/common/LottieAnimation"),
  { ssr: false },
);

const preLoginPaths = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/join-invitation",
  "/auth/accept-invitation",
  "/auth/contact-sales",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/about-us",
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isPreLogin = preLoginPaths.some(
    (path) => pathname?.startsWith(path) || pathname === "/",
  );
  const [loading, setLoading] = useState(pathname === "/");
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    if (pathname === "/") {
      fetch("/loading.json")
        .then((res) => res.json())
        .then((data) => setAnimationData(data));
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getLayout = () => {
    const content = isPreLogin ? (
      <PreLogin>
        {children}
        <Footer />
      </PreLogin>
    ) : (
      <DefaultLayout>{children}</DefaultLayout>
    );

    return (
      <>
        {content}
        {loading && isPreLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <LottieAnimation
              animationData={animationData}
              speed={1.5}
              direction={1}
              loop={true}
              className="xl:!w-200 xl:!mt-5 xl:!h-100"
            />
          </div>
        )}
      </>
    );
  };

  return (
    <html lang="en">
      <body className="!text-gray-17">
        <StoreProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastMessage />
            {getLayout()}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
