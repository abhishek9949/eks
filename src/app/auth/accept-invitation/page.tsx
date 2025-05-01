"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAcceptInvitationMutation } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import PageMetaData from "@/components/common/PageMetaData";
import Loader from "@/components/common/Loader";

const AcceptInvitationRenderPage = () => {
  const acceptInvitationParams = useSearchParams();
  const router = useRouter();
  const [acceptInvitation] = useAcceptInvitationMutation();
  const dispatch = useAppDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const acceptInvitationPayload = {
    token: acceptInvitationParams.get("token"),
  };
  const handleAcceptInvitation = () => {
    setIsFormSubmitted(true);
    acceptInvitation({
      endpoint: `${API_CONSTANTS.ACCEPT_INVITATION}`,
      method: "POST",
      data: acceptInvitationPayload,
    })
      .unwrap()
      .then((acceptInvitationRes) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: acceptInvitationRes?.message,
            severity: "success",
          }),
        );
        setTimeout(() => {
          router.push(URL_CONSTANTS.LOGIN);
        }, 2000);
      })
      .catch((acceptInvitationErr) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: acceptInvitationErr?.data?.error,
            severity: "error",
          }),
        );
        setTimeout(() => {
          router.push(URL_CONSTANTS.LOGIN);
        }, 2000);
      });
  };

  return (
    <>
      <PageMetaData title="Accept Invitation" />
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="flex flex-col items-center justify-center rounded bg-white px-15 py-6 text-center">
          <Image
            src="/images/firework_image.webp"
            width={135}
            height={135}
            alt="congratulations"
          />
          <div className="text-4xl text-gray-16">
            {CONSTANT_MESSAGE.ACCEPT_INVITATION_CONGRATULATIONS_LABEL}
          </div>
          <div className="mb-2 text-xl text-gray-16">
            {CONSTANT_MESSAGE.ACCEPT_INVITATION_INVITED_TO_JOIN_TEAM_LABEL}
          </div>
          <div>
            <Button
              variant="contained"
              className="!px-10 !bg-primary"
              onClick={handleAcceptInvitation}
              endIcon={<ArrowForwardIcon />}
              disabled={isFormSubmitted}
              sx={{
                p: 1.533,
                backgroundColor: "primary.main",
                "&.Mui-disabled": {
                  backgroundColor: "primary.main",
                  color: "white",
                  cursor: "not-allowed",
                },
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              startIcon={
                isFormSubmitted && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                )
              }
              disableRipple
            >
              {CONSTANT_MESSAGE.ACCEPT_INVITATION_BTN_LABEL}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const AcceptInvitationPage = () => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <AcceptInvitationRenderPage />
      </Suspense>
    </div>
  );
};

export default AcceptInvitationPage;
