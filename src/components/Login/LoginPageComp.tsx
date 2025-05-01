"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { LoginInitialValue } from "@/types/loginType";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import LoginForm from "@/components/Login/LoginForm";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import useLocalStorage from "@/hooks/useLocalStorage";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { usePathname } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
const initialValues: LoginInitialValue = { email: "", password: "" };

const LoginPageComp = ({
  handleCloseAddAccountPopup,
}: {
  handleCloseAddAccountPopup?: () => void;
}) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [_, setPageName] = useLocalStorage("selectedMenu", "");
  const isLoginPath = pathname === URL_CONSTANTS.LOGIN;

  const handleSubmit = async (values: LoginInitialValue) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Login failed");
      } else {
        localStorage.setItem("access_token", data?.accessToken);
        if (data.redirect) {
          setPageName(data.redirect.name);
          window.location.href = data.redirect.url;
        }
        dispatch(
          showToastMessage({ message: data?.message, severity: "success" }),
        );
      }
    } catch (error: any) {
      dispatch(showToastMessage({ message: error.message, severity: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side Image (Visible on Large Screens) */}
      <div
        className={`hidden items-center justify-center bg-primary lg:flex ${isLoginPath ? "min-h-[70vh] lg:min-h-screen" : "min-h-[75vh]"}`}
      >
        <Image
          src="/images/logo/login_logo.webp"
          width={275}
          height={275}
          alt="logo"
          priority
        />
      </div>

      {/* Mobile Logo */}
      {isLoginPath === false && (
        <div className="flex w-full items-center justify-center bg-primary lg:hidden">
          <div className="relative aspect-square w-16 sm:w-20">
            <Image
              src="/images/logo/login_logo.webp"
              alt="logo"
              priority
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Login Form */}
      <div
        className={`min-w-full bg-white ${isLoginPath ? "min-h-[70vh] lg:min-h-screen" : "flex min-h-[75vh] items-center"}`}
      >
        <div className="w-full">
          {isLoginPath && (
            <div className="ml-5 mr-5 mt-5 grid grid-cols-12 items-center">
              <div className="col-span-2">
                <Link href="/">
                  <button className="flex w-max items-center text-gray-breadcrumb">
                    <ArrowBackIosIcon className="!text-[20px] !text-gray-breadcrumb" />
                    <span>Back</span>
                  </button>
                </Link>
              </div>
            </div>
          )}
          {!isLoginPath && (
            <div className="absolute right-2 top-2">
              <IconButton
                aria-label="close"
                onClick={handleCloseAddAccountPopup}
                className="!text-white lg:!text-gray-breadcrumb"
              >
                <CloseIcon />
              </IconButton>
            </div>
          )}
          <div
            className={`mx-5 grid grid-cols-12 pb-5 ${isLoginPath ? "mt-10 xl:mt-20 2xl:mt-30 2xl:pb-0 3xl:mt-35" : ""}`}
          >
            <div className="col-span-2"></div>
            <div className="col-span-8">
              <h1
                className="text-3xl font-bold text-gray-900"
                data-testid="login-title"
              >
                {isLoginPath ? CONSTANT_MESSAGE.LOGIN_TITLE : "Add Account"}
              </h1>
              <p className="mb-2 text-lg text-gray-breadcrumb xl:mb-5">
                {CONSTANT_MESSAGE.LOGIN_DESCRIPTION}
              </p>

              <LoginForm
                onSubmit={handleSubmit}
                initialValues={initialValues}
                isLoading={isLoading}
                isLoginPath={isLoginPath}
              />

              {isLoginPath && (
                <div className="mt-4 flex justify-center">
                  <span className="text-base text-gray-breadcrumb">
                    {CONSTANT_MESSAGE.LOGIN_DONT_HAVE_ACCOUNT_LABEL}
                  </span>
                  <Link
                    href={URL_CONSTANTS.SIGNUP}
                    className="ml-1 text-primary"
                  >
                    {CONSTANT_MESSAGE.LOGIN_SIGN_UP_LABEL}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageComp;
