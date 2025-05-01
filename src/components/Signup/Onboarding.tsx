import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Check } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import clsx from "clsx";
import CloseIcon from "@mui/icons-material/Close";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import styles from "./Signup.module.scss";
import { Grid2 } from "@mui/material";
interface Option {
  id: number;
  answer: string;
}

interface OnboardingQuestion {
  id: number;
  question: string;
  isOtherOption: boolean;
  options: Option[];
}

interface OnboardingProps {
  onboardingData: OnboardingQuestion;
  selectedOptions: (number | string)[];
  otherInput: string;
  handleAnswerChange: (questionId: number, answer: (number | string)[]) => void;
  handleOtherInputChange: (questionId: number, value: string) => void;
  handleContinue: () => void;
  validationErr: string;
}

const Onboarding = ({
  onboardingData,
  selectedOptions,
  otherInput,
  handleAnswerChange,
  handleOtherInputChange,
  handleContinue,
  validationErr,
}: OnboardingProps) => {
  const {
    id: questionId,
    question: questionTitle,
    isOtherOption,
    options,
  } = onboardingData;

  const handleOptionClick = (optionId: number) => {
    const updatedOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];

    handleAnswerChange(questionId, updatedOptions);
  };

  const handleOtherOptionClick = () => {
    if (!selectedOptions.includes("other")) {
      handleAnswerChange(questionId, [...selectedOptions, "other"]);
    }
    handleOtherInputChange(questionId, ""); // Initialize "other" input
  };

  const handleOtherInputClear = () => {
    handleOtherInputChange(questionId, ""); // Clear the other input value

    // Filter out "other" and the associated otherInput value
    const updatedOptions = selectedOptions.filter(
      (id) => id !== "other" && id !== otherInput,
    );
    handleAnswerChange(questionId, updatedOptions);
  };

  return (
    <div>
      {/* Question Title */}
      <div
        className={clsx(
          "mb-3 text-3xl font-bold text-gray-900",
          styles.onBoardingHeader,
        )}
        dangerouslySetInnerHTML={{ __html: questionTitle }}
      />
      {/* Options List */}
      <div className="flex flex-col gap-2">
        {options?.map((option) => (
          <Button
            key={option?.id}
            onClick={() => handleOptionClick(option?.id)}
            variant="outlined"
            className={clsx(
              "justify-start !border-gray-1 !px-3 !py-2 text-left !text-gray-900",
              {
                "!border-primary !bg-blue-light-7": selectedOptions.includes(
                  option?.id,
                ),
                "bg-white": !selectedOptions.includes(option?.id),
              },
            )}
            disableRipple
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-base">{option?.answer}</span>
              {selectedOptions.includes(option?.id) && (
                <Check color="primary" />
              )}
            </div>
          </Button>
        ))}

        {/* other option */}
        {isOtherOption &&
          (selectedOptions.includes("other") ? (
            <TextField
              value={otherInput}
              onChange={(e) =>
                handleOtherInputChange(questionId, e.target.value)
              }
              placeholder="Please type"
              size="small"
              variant="outlined"
              className="!mt-2 !bg-blue-light-7 !text-gray-900"
              slotProps={{
                input: {
                  classes: {
                    root: "border-primary",
                    notchedOutline: "border-primary",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Check color="primary" />
                      <CloseIcon
                        onClick={handleOtherInputClear}
                        className="cursor-pointer"
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : (
            <Button
              onClick={handleOtherOptionClick}
              variant="outlined"
              className="justify-start !border-gray-1 !px-3 !py-2 text-left !text-gray-900"
              disableRipple
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-base">Others</span>
              </div>
            </Button>
          ))}
      </div>

      {/* Validation Error */}
      {validationErr?.length > 0 && (
        <FormHelperText error>{validationErr}</FormHelperText>
      )}

      {/* Continue Button */}
      <Grid2 size={{ xs: 12, md: 12 }}>
        <Button
          size="large"
          fullWidth
          className="!mb-5 !mt-5 !bg-primary !text-lg"
          variant="contained"
          color="primary"
          onClick={handleContinue}
          disableRipple
          sx={{ p: 1.533 }}
        >
          {CONSTANT_MESSAGE.ONBOARDING_CONTINUE_BUTTON_LABEL}
        </Button>
      </Grid2>
    </div>
  );
};

export default Onboarding;
