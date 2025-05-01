"use client";

import React, { useState, useEffect } from "react";
import DeleteAccount from "@/components/my-profile/DeleteAccount";
import ProfileComponent from "@/components/my-profile/PersonalInfo";
import OnboardingResponses from "@/components/my-profile/OnboardingResponses";
import PasswordSection from "@/components/my-profile/PasswordSection";
import {
  useLazyGetProfileByTokenQuery,
  useLazyGetOnboardingAnswersByTokenQuery,
  useUpdateProfileInfoMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import {
  UserProfile,
  Questionnaire,
  ChangedPassword,
} from "@/types/personalInfo";
import Loader from "@/components/common/Loader";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useLogout } from "@/hooks/useLogout";

export default function MyProfile() {
  const dispatch = useAppDispatch();
  const logout = useLogout();
  const [getProfile] = useLazyGetProfileByTokenQuery();
  const [getOnboarding] = useLazyGetOnboardingAnswersByTokenQuery();
  const [updateProfile] = useUpdateProfileInfoMutation();
  const [updateUserPassword] = useUpdatePasswordMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [onboardingData, setOnboardingData] = useState<Questionnaire | null>(
    null,
  );

  const getProfileData = async () => {
    setIsUpdating(true);
    try {
      const response = await getProfile({
        endpoint: API_CONSTANTS.PROFILE,
        method: "GET",
      }).unwrap();
      setProfileData(response as UserProfile);
      setIsUpdating(false);
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getOnboardingResponses = async () => {
    setIsUpdating(true);
    try {
      const response = await getOnboarding({
        endpoint: API_CONSTANTS.ONBOARDING_ANSWER,
        method: "GET",
      }).unwrap();
      setOnboardingData(response as Questionnaire);
    } catch (error) {
      console.error("Onboarding fetch error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateProfileData = async (values: UserProfile) => {
    const formData = new FormData();
    if (values.name) formData.append("name", values.name);
    if (values.bio) formData.append("bio", values.bio);
    if (values.phone) {
      formData.append("phone", values.phone);
      formData.append("country_code", values.country_code ?? "");
    }
    if (values.profile_picture instanceof File) {
      formData.append("profile_picture", values.profile_picture);
    } else {
      formData.append("is_profile_public", "true");
    }

    setIsUpdating(true);
    try {
      await updateProfile({
        endpoint: API_CONSTANTS.PROFILE_UPDATE,
        method: "PUT",
        data: formData,
      }).unwrap();
      getProfileData();
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
      getProfileData();
    }
  };

  const updateOnboardingData = async (values: any) => {
    setIsUpdating(true);
    try {
      await updateProfile({
        endpoint: API_CONSTANTS.PROFILE_EDIT_ONBOARDING_ANSWER,
        method: "PUT",
        data: values,
      }).unwrap();
      getOnboardingResponses(); // Refresh onboarding data
    } catch (error) {
      console.error("Onboarding update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePassword = async (values: ChangedPassword) => {
    setIsUpdating(true);
    try {
      await updateUserPassword({
        endpoint: API_CONSTANTS.CHANGE_PASSWORD,
        method: "PUT",
        data: values,
      }).unwrap();
    } catch (error: any) {
      console.error("Password update error:", error);
      if (error?.data?.current_password) {
        dispatch(
          showToastMessage({
            message: error.data.current_password[0],
            severity: "error",
          }),
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteAccountSubmit = async (reason: string) => {
    setIsUpdating(true);
    try {
      await deleteAccount({
        endpoint: API_CONSTANTS.PROFILE_DLETET,
        method: "DELETE",
        data: { reason },
      }).unwrap();
      logout();
    } catch (error) {
      console.error("Delete account error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    getProfileData();
    getOnboardingResponses();
  }, []);
  
  return (
    <>
      {isUpdating && <Loader />}
  
      {!isUpdating && profileData && (
        <>
          <ProfileComponent
            updateProfileData={updateProfileData}
            initialValues={profileData}
          />
  
          {onboardingData && onboardingData?.length !== 0 && (
            <OnboardingResponses
              onboardingData={onboardingData}
              isLoading={isUpdating}
              updateOnboradingData={updateOnboardingData}
            />
          )}
  
          <PasswordSection updatePassword={updatePassword} />
          <DeleteAccount deleteAccountSubmit={deleteAccountSubmit} />
        </>
      )}
    </>
  );
  
}
