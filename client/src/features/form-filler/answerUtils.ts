import type { AnswerInput } from "../../api/generated";

export type AnswerState = Record<string, string[]>;

export const updateAnswerState = (
  previousState: AnswerState,
  questionId: string,
  value: string,
  isCheckbox = false,
): AnswerState => {
  if (isCheckbox) {
    const currentValues = previousState[questionId] || [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    return {
      ...previousState,
      [questionId]: nextValues,
    };
  }

  return {
    ...previousState,
    [questionId]: [value],
  };
};

export const formatAnswersForSubmission = (answersState: AnswerState): AnswerInput[] =>
  Object.entries(answersState).map(([questionId, value]) => ({
    questionId,
    value,
  }));
