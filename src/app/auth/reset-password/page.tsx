"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/ResetPassword/ResetPasswordForm";
import { useResetPasswordMutation } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { ResetPasswordInitialValue } from "@/types/resetPasswordType";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import PageMetaData from "@/components/common/PageMetaData";

const initialValues: ResetPasswordInitialValue = {
  newResetPassword: "",
  confirmNewResetPassword: "",
};

const ResetPasswordPage = () => {
  const resetPasswordParams = useSearchParams();
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const dispatch = useAppDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const handleSubmit = (values: ResetPasswordInitialValue) => {
    setIsFormSubmitted(true);
    const resetPasswordPayload = {
      email: resetPasswordParams.get("email"),
      token: resetPasswordParams.get("token"),
      new_password: values.newResetPassword,
    };

    resetPassword({
      endpoint: `${API_CONSTANTS.RESET_PASSWORD}`,
      method: "POST",
      data: resetPasswordPayload,
    })
      .unwrap()
      .then((resetPasswordRes) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: resetPasswordRes?.message,
            severity: "success",
          }),
        );
        router.push(URL_CONSTANTS.LOGIN);
      })
      .catch((resetPasswordErr) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: resetPasswordErr?.data?.error,
            severity: "error",
          }),
        );
        router.push(URL_CONSTANTS.LOGIN);
      });
  };

  return (
    <>
      <PageMetaData title="Reset Password" />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden min-h-[70vh] items-center justify-center bg-primary lg:flex lg:min-h-screen">
          <Image
            src="/images/logo/login_logo.webp"
            width={275}
            height={275}
            alt="ttt_logo"
            priority={true}
          />
        </div>
        <div className="min-h-[70vh] min-w-full bg-white lg:min-h-screen">
          <div className="ml-5 mr-5 mt-10 grid grid-cols-12 pb-5 xl:mt-20 2xl:mt-30 2xl:pb-0 3xl:mt-35">
            <div className="col-span-2"></div>
            <div className="col-span-8">
              <div
                className="text-3xl font-bold text-black"
                data-testid="reset-password-title"
              >
                {CONSTANT_MESSAGE.RESET_PASSWORD_TITLE}
              </div>
              <div className="mb-5 text-lg text-gray-16">
                {CONSTANT_MESSAGE.RESET_PASSWORD_DESCRIPTION}
              </div>
              <ResetPasswordForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isFormSubmitted={isFormSubmitted}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
