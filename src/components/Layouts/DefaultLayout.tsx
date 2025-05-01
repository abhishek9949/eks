"use client";
import React, { useState, useEffect, ReactNode, useCallback } from "react";
import Sidebar from "@/components/Layouts/Sidebar";
import Header from "@/components/Layouts/Header";
import style from "@/components/Layouts/Sidebar/Sidebar.module.scss";
import clsx from "clsx";
import { fetchCookies } from "@/redux/slices/cookieSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute"; // Import ProtectedRoute

export default function DefaultLayout({ children }: Readonly<{ children: ReactNode }>) {
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { status } = useAppSelector((state) => state.cookies);
  const pathname = usePathname();
  const isChat = pathname?.includes("chats") && !pathname?.includes("admin");
  const toggleSidebar = useCallback((value?: boolean) => {
    setSidebarOpen((prev) => value ?? !prev);
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCookies());
    }
  }, [dispatch, status]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex  overflow-hidden">
      {/* Main content area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-white">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={toggleSidebar} />

        <main className="px-4 lg:px-6">
          <div className="mx-auto gap-4">
            {/* Sidebar */}
            <aside
              className={clsx(
                style.sidebar,
                "no-scrollbar absolute flex flex-col overflow-visible transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                sidebarOpen
                  ? "translate-x-0 border-r lg:border-gray-1"
                  : "-translate-x-full lg:border-r lg:border-gray-1",
              )}
            >
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={toggleSidebar}
              />
            </aside>

            {/* Main Content */}
            <div
              className={clsx(
                style.mainContainer,
                "col-span-9 transition-opacity duration-300",
                sidebarOpen && "pointer-events-none opacity-50",
                isChat && "flex h-dvh max-h-dvh overflow-hidden",
              )}
            >
              {status === "succeeded" &&(
              <ProtectedRoute requiredPermission={pathname}>
                {children}
              </ProtectedRoute>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
