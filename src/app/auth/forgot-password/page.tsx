"use client";

import React, { useState } from "react";
import Image from "next/image";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useForgotPasswordMutation } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { ForgotPasswordInitialValue } from "@/types/forgotPasswordType";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import ForgotPasswordForm from "@/components/ForgotPassword/ForgotPasswordForm";
import PageMetaData from "@/components/common/PageMetaData";

const initialValues: ForgotPasswordInitialValue = {
  email: "",
};

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [forgotPassword] = useForgotPasswordMutation();
  const dispatch = useAppDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);


  const handleSubmit = (values: ForgotPasswordInitialValue) => {
    setIsFormSubmitted(true);
    forgotPassword({
      endpoint: API_CONSTANTS.FORGOT_PASSWORD,
      method: "POST",
      data: {
        email: values.email,
      },
    })
      .unwrap()
      .then((forgotPasswordRes) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: forgotPasswordRes?.message,
            severity: "success",
          }),
        );
      })
      .catch((forgotPasswordErr) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: forgotPasswordErr?.data?.error || "An error occurred",
            severity: "error",
          }),
        );
      });
  };
  return (
    <>
      <PageMetaData title="Forgot Password" />
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
          <div className="ml-5 mr-5 mt-5 grid grid-cols-12 items-center">
            <div className="col-span-2">
              <button
                className="flex w-max items-center text-gray-breadcrumb"
                onClick={() => router.back()}
              >
                <ArrowBackIosIcon className="!text-[20px] !text-gray-breadcrumb" />
                <span>Back</span>
              </button>
            </div>
          </div>
          <div className="ml-5 mr-5 mt-10 grid grid-cols-12 pb-5 xl:mt-20 2xl:mt-30 2xl:pb-0 3xl:mt-35">
            <div className="col-span-2"></div>
            <div className="col-span-8">
              <div
                className="text-3xl font-bold text-gray-900"
                data-testid="forgot-password-title"
              >
                {CONSTANT_MESSAGE.FORGOT_PASSWORD_DESCRIPTION_1}
              </div>
              <div className="mb-5 text-lg text-gray-breadcrumb">
                {CONSTANT_MESSAGE.FORGOT_PASSWORD_DESCRIPTION_2}
              </div>
              <ForgotPasswordForm
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

export default ForgotPasswordPage;
