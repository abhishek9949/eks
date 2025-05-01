"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/Signup/SignupForm";
import Onboarding from "@/components/Signup/Onboarding";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import {
  SignupInitialValue,
  Answer,
  OtherInputs,
  CreateUserError,
} from "@/types/signupType";
import {
  useAddOnboardingQnasMutation,
  useCreateUserMutation,
  useLazyGetOnboardingQnasQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { OnboardingAnswersType, OnboardingDataType } from "@/types/reducer";
import PageMetaData from "@/components/common/PageMetaData";
import { fetchAndRedirectIfNeeded } from "@/utils/fetchCookies";
import useLocalStorage from "@/hooks/useLocalStorage";
import Loader from "@/components/common/Loader";

interface OnboardingDataExtendedType extends OnboardingDataType {
  isOtherOption: boolean;
  options: OnboardingAnswersType[];
}

const initialValues: SignupInitialValue = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    // @ts-ignore
    backgroundColor: theme.palette.secondary[100],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [getOnboardingQnas] = useLazyGetOnboardingQnasQuery();
  const [createUser] = useCreateUserMutation();
  const [addOnboardingQnas] = useAddOnboardingQnasMutation();
  const [_, setPageName] = useLocalStorage("selectedMenu", "");
  const [signupStep, setSignupStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Answer>({});
  const [otherInputs, setOtherInputs] = useState<OtherInputs>({});
  const [validationErr, setValidationErr] = useState<string>("");
  const [getOnboardingData, setGetOnboardingData] = useState<
    OnboardingDataExtendedType[]
  >([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleNext = () => setSignupStep((prev) => prev + 1);
  const handleBack = () => setSignupStep((prev) => prev - 1);

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
  }, []);
  const handlegetOnboardingQnas = () => {
    setApiLoading(true);
    getOnboardingQnas({
      endpoint: API_CONSTANTS.GET_ONBOARDING_QNAS,
    })
      .unwrap()
      .then((res) => {
        setApiLoading(false);

        const updatedData = res?.data?.map((item) => ({
          ...item,
          isOtherOption: item.is_other || false, // Ensure "isOtherOption" is present
          options: item.answers || [], // Map "answers" to "options"
        }));
        setGetOnboardingData(updatedData);
      })
      .catch((err) => {
        setApiLoading(false);

        dispatch(
          showToastMessage({
            message: err?.data?.message || "Error fetching onboarding data",
            severity: "error",
          }),
        );
      });
  };

  const handleAnswerChange = (
    questionId: number,
    answer: (number | string)[],
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setValidationErr("");
  };

  const handleOtherInputChange = (questionId: number, value: string) => {
    setOtherInputs((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      const filteredAnswers = currentAnswers.filter(
        (answer) => answer !== "other" && typeof answer !== "string",
      );
      return {
        ...prev,
        [questionId]: [...filteredAnswers, "other"],
      };
    });
  };

  const handleContinue = () => {
    const currentQuestion = getOnboardingData?.[signupStep - 1];
    const currentAnswer =
      (currentQuestion && answers[currentQuestion?.id]) || [];
    const currentOtherInput =
      currentQuestion && otherInputs[currentQuestion?.id]?.trim();

    const hasSelectedOption = currentAnswer.some(
      (item) => typeof item === "number",
    );
    const hasOtherSelected = currentAnswer.includes("other");

    // Validation: Ensure either an option or "other" input is selected
    if (!hasSelectedOption && !hasOtherSelected) {
      setValidationErr("Please select an option or provide a valid answer.");
      return;
    }

    // Validation: Ensure "other" has a valid trimmed value if selected
    if (hasOtherSelected && !currentOtherInput) {
      setValidationErr("Please provide a valid answer for 'other'.");
      return;
    }

    // Save "other" input if provided
    if (currentQuestion.isOtherOption && currentOtherInput) {
      setAnswers((prev) => {
        const currentAnswers = prev[currentQuestion.id] || [];
        const filteredAnswers = currentAnswers.filter(
          (answer) => answer !== "other" && typeof answer !== "string",
        );
        return {
          ...prev,
          [currentQuestion.id]: [
            ...filteredAnswers,
            "other",
            currentOtherInput,
          ],
        };
      });
    }

    setValidationErr(""); // Clear any previous validation errors
    handleNext(); // Move to the next step
  };

  const handleSubmit = async (values: SignupInitialValue) => {
    setIsFormSubmitted(true);
    try {
      // Register user API call
      const registerRes = await createUser({
        endpoint: API_CONSTANTS.CREATE_USER,
        method: "POST",
        data: {
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          password: values.password,
        },
      }).unwrap();

      dispatch(
        showToastMessage({
          message: registerRes?.message,
          severity: "success",
        }),
      );

      const { id } = registerRes.user;

      // Onboarding user

      const formattedData = Object.entries(answers).map(
        ([questionId, answer]) => {
          const options: number[] = [];
          let customOption: string = "";

          (answer as (number | string)[]).forEach((item) => {
            if (typeof item === "string" && item !== "other") {
              customOption = item; // Collect custom input
            } else if (typeof item === "number") {
              options.push(item); // Collect selected option IDs
            }
          });

          return {
            question_id: parseInt(questionId, 10),
            answer_ids: options,
            custom_answer: customOption,
          };
        },
      );

      const onboardingPayload = {
        user_id: id,
        data: formattedData,
      };

      // Post Onboarding Qnas API call
      await addOnboardingQnas({
        endpoint: API_CONSTANTS.ADD_ONBOARDING_QNAS,
        method: "POST",
        data: onboardingPayload,
      }).unwrap();
      setIsFormSubmitted(false);
      router.push(URL_CONSTANTS.LOGIN);
    } catch (signupErr: unknown) {
      setIsFormSubmitted(false);
      dispatch(
        showToastMessage({
          message:
            (signupErr as CreateUserError)?.data?.error ||
            "Signup failed: Please check and try again",
          severity: "error",
        }),
      );
    }
  };

  useEffect(() => {
    handlegetOnboardingQnas();
  }, []);

  return (
    <>
      <PageMetaData title="Signup & Onboarding" />
      {isPageLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side */}
          <div className="hidden min-h-[70vh] items-center justify-center bg-primary lg:flex lg:min-h-screen">
            <Image
              src="/images/logo/login_logo.webp"
              width={275}
              height={275}
              alt="ttt_logo"
              priority={true}
            />
          </div>
          {/* Right Side */}
          {apiLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="min-h-[70vh] min-w-full bg-white lg:min-h-screen">
              {/* Progress Bar */}
              <div className="ml-5 mr-5 mt-5 grid grid-cols-12 items-center">
                <div className="col-span-2 xl:col-span-3">
                  <button
                    className="flex w-max items-center text-gray-breadcrumb"
                    onClick={() => {
                      signupStep === 1 ? router.back() : handleBack();
                    }}
                  >
                    <ArrowBackIosIcon className="!text-[20px] !text-gray-breadcrumb" />
                    <span>Back</span>
                  </button>
                </div>
                <div className="col-span-8 xl:col-span-6">
                  <BorderLinearProgress
                    variant="determinate"
                    value={(signupStep / (getOnboardingData?.length + 1)) * 100}
                  />
                </div>
                <div className="col-span-2 text-right xl:col-span-3">
                  <div>
                    <div className="text-sm text-gray-breadcrumb">
                      STEP 0{signupStep}/0{getOnboardingData?.length + 1}
                    </div>
                    <div className="text-base text-gray-breadcrumb">
                      Sign Up
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="ml-5 mr-5 mt-5 grid grid-cols-12 pb-5 xl:mt-10 2xl:pb-0">
                <div className="col-span-2 xl:col-span-3"></div>
                <div className="col-span-8 xl:col-span-6">
                  {signupStep <= getOnboardingData?.length && (
                    <Onboarding
                      onboardingData={getOnboardingData[signupStep - 1]}
                      selectedOptions={
                        answers[getOnboardingData[signupStep - 1]?.id] || []
                      }
                      otherInput={
                        otherInputs[getOnboardingData[signupStep - 1]?.id] || ""
                      }
                      handleAnswerChange={handleAnswerChange}
                      handleOtherInputChange={handleOtherInputChange}
                      handleContinue={handleContinue}
                      validationErr={validationErr}
                    />
                  )}
                  {signupStep === getOnboardingData?.length + 1 && (
                    <SignupForm
                      onSubmit={handleSubmit}
                      initialValues={initialValues}
                      isFormSubmitted={isFormSubmitted}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SignupPage;
