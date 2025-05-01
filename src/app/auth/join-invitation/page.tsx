"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { JoinInvitationInitialValue } from "@/types/joinInvitationType";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import JoinInvitationForm from "@/components/JoinInvitation/JoinInvitationForm";
import PageMetaData from "@/components/common/PageMetaData";
import Loader from "@/components/common/Loader";

const JoinInvitationPageRender = () => {
  const joinInvitationParams = useSearchParams();
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const dispatch = useAppDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const initialValues: JoinInvitationInitialValue = {
    email: joinInvitationParams.get("email"),
    newPassword: "",
    confirmNewPassword: "",
  };

  const handleSubmit = (values: JoinInvitationInitialValue) => {
    setIsFormSubmitted(true);
    const joinInvitationPayload = {
      email: joinInvitationParams.get("email"),
      token: joinInvitationParams.get("token"),
      new_password: values.newPassword,
      is_invitation_flow: true,
    };
    resetPassword({
      endpoint: `${API_CONSTANTS.RESET_PASSWORD}`,
      method: "POST",
      data: joinInvitationPayload,
    })
      .unwrap()
      .then((res) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: res?.message,
            severity: "success",
          }),
        );
        router.push(URL_CONSTANTS.LOGIN);
      })
      .catch((err) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: err?.data?.error,
            severity: "error",
          }),
        );
      });
  };
  return (
    <>
      <PageMetaData title="Join Invitation" />
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
                data-testid="join-invitation-title"
              >
                {CONSTANT_MESSAGE.JOIN_INVITATION_TITLE}
              </div>
              <div className="mb-5 text-lg text-gray-16">
                {CONSTANT_MESSAGE.JOIN_INVITATION_DESCRIPTION}
              </div>
              <JoinInvitationForm
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

const JoinInvitationPage = () => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <JoinInvitationPageRender />
      </Suspense>
    </div>
  );
};

export default JoinInvitationPage;
