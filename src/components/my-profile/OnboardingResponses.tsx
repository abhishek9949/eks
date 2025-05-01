"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Box,
  Typography,
  Button,
  Grid2 as Grid,
  Stack,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import MultiSelectDropdown from "@/components/common/MultiSelectCategory";
import { Questionnaire } from "@/types/personalInfo";
import clsx from "clsx";
import styles from "./MyProfile.module.scss";

interface OnboardingResponsesProps {
  onboardingData: Questionnaire;
  isLoading: boolean;
  updateOnboradingData: (value: any) => void;
}

const OnboardingComponent: React.FC<OnboardingResponsesProps> = ({
  onboardingData,
  isLoading,
  updateOnboradingData,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    { id: number; answers: string[]; customAnswer: string }[]
  >([]);
  const [errors, setErrors] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (onboardingData?.length) {
      setSelectedAnswers(
        onboardingData.map((q) => {
          const selectedValues = q.answers
            .filter((a) => a.isSelected)
            .map((a) => a.answer);

          const hasCustomAnswer = q.custom_answer.isSelected ? q.custom_answer.answer : "";
          const customAnswerValue = hasCustomAnswer
            ? q.custom_answer.answer
            : "";
          return {
            id: q.id,
            answers: hasCustomAnswer
              ? [...selectedValues, "Other"]
              : selectedValues,
            customAnswer: customAnswerValue,
          };
        }),
      );
    }
  }, [onboardingData]);

  const handleSelectChange = (questionId: number, value: string[]) => {
    setSelectedAnswers((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: value,
            }
          : q,
      ),
    );
    // Clear error when user selects something
    setErrors((prev) => ({ ...prev, [questionId]: false }));
  };

  const handleCustomAnswerChange = (questionId: number, value: string) => {
    setSelectedAnswers((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              customAnswer: value,
            }
          : q,
      ),
    );
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: number]: boolean } = {};
    let isValid = true;

    selectedAnswers.forEach((answer) => {
      if (answer.answers.length === 0) {
        newErrors[answer.id] = true;
        isValid = false;
      } else {
        newErrors[answer.id] = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const formattedData = selectedAnswers.map((q) => ({
      question_id: q.id,
      answer_ids:
        onboardingData
          .find((question) => question.id === q.id)
          ?.answers.filter((a) => q.answers.includes(a.answer))
          .map((a) => a.id) || [],
      custom_answer: q.answers.includes("Other") ? q.customAnswer : "",
    }));
    updateOnboradingData(formattedData);
    setIsEditing(false);
  };

  return (
    <Card sx={{ display: "flex", p: 2.5, mb: 2.5 }}>
      <Grid container spacing={2} size="grow">
        <Grid size={8}>
          <Typography component="div" variant="h6">
            Onboarding Responses
          </Typography>
        </Grid>
        <Grid size={4} sx={{ justifyContent: "right", display: "flex" }}>
          <Button
            variant="outlined"
            startIcon={
              <img
                src="/svg/edit_square.svg"
                alt="Edit"
                width={20}
                height={20}
              />
            }
            onClick={() => setIsEditing(!isEditing)}
          >
            Edit
          </Button>
        </Grid>

        {onboardingData?.map((question) => {
          const selectedAnswerObj = selectedAnswers.find(
            (q) => q.id === question.id,
          );
          const isOtherSelected = selectedAnswerObj?.answers.includes("Other");
          const customAnswerValue = selectedAnswerObj?.customAnswer ?? "";
          const hasError = errors[question.id];

          return (
            <Grid size={12} key={question.id}>
              <Box sx={{ width: "100%" }}>
                <Stack
                  direction="column"
                  className="!font-normal !leading-[1.54] !text-gray-13"
                >
                  <div
                    className={clsx(styles.onBoardingQuestions)}
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  />
                </Stack>
                {!isEditing ? (
                  <Stack direction="column">
                    <Typography component="div" variant="body1">
                      {selectedAnswers
                        .find((q) => q.id === question.id)
                        ?.answers.join(", ") ?? "N/A"}
                    </Typography>
                  </Stack>
                ) : (
                  <>
                    <Box sx={{ width: "100%", display: "flex" }}>
                      <Box sx={{ width: "40%" }}>
                        <FormControl error={hasError} fullWidth>
                          <MultiSelectDropdown
                            id={`multi-select-${question.id}`}
                            value={selectedAnswers
                              .filter((q) => q.id === question.id)
                              .flatMap((q) =>
                                q.answers.map((answer) => ({
                                  id: answer,
                                  label: answer,
                                })),
                              )}
                            options={[
                              ...question.answers.map((answer) => ({
                                id: answer.answer,
                                label: answer.answer,
                              })),
                              ...(  Object.keys(question.custom_answer).length > 0
                                ? [{ id: "Other", label: "Other" }]
                                : []),
                            ]}
                            onChange={(newValue) =>
                              handleSelectChange(
                                question.id,
                                newValue.map((v) => v.label),
                              )
                            }
                            placeholder="Select options"
                            fullWidth
                          />
                          {hasError && (
                            <FormHelperText error>
                              Please select at least one option
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>

                      {isOtherSelected && (
                        <TextField
                          sx={{ ml: 2, width: "40%" }}
                          variant="outlined"
                          placeholder="Other"
                          value={customAnswerValue}
                          onChange={(e) =>
                            handleCustomAnswerChange(
                              question.id,
                              e.target.value,
                            )
                          }
                          error={
                            hasError && isOtherSelected && !customAnswerValue
                          }
                          helperText={
                            hasError && isOtherSelected && !customAnswerValue
                              ? "Please enter a custom answer"
                              : ""
                          }
                        />
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </Grid>
          );
        })}

        {isEditing && (
          <Grid size={12} sx={{ display: "flex", justifyContent: "right" }}>
            <Grid size={1} sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid size={1} sx={{ display: "flex", justifyContent: "right" }}>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default OnboardingComponent;
