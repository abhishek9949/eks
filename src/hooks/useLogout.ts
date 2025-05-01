"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { resetCookies } from "@/redux/slices/cookieSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = async () => {
    try {
      const savedCookieConsent = localStorage.getItem("cookieConsent");

      const res = await fetch("/api/cookies/deleteCookies", {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to logout");

      localStorage.clear();
      if (savedCookieConsent) {
        localStorage.setItem("cookieConsent", savedCookieConsent);
      }

      dispatch(resetCookies());
      router.replace(URL_CONSTANTS.LOGIN);

      setTimeout(() => {
        window.location.href = URL_CONSTANTS.LOGIN; // Full reload to clear cache
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logout;
};