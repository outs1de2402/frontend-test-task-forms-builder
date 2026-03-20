import type { QuestionInput, QuestionType } from "../../api/generated";

export const questionTypeOptions: Array<{ value: QuestionType; label: string }> = [
  { value: "TEXT", label: "Text" },
  { value: "DATE", label: "Date" },
  { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
  { value: "CHECKBOX", label: "Checkboxes" },
];

const createsOptions = (type: QuestionType) =>
  type === "MULTIPLE_CHOICE" || type === "CHECKBOX";

export const createQuestionDraft = (): QuestionInput => ({
  label: "",
  type: "TEXT",
  options: null,
});

export const getQuestionOptions = (type: QuestionType, current?: Array<string | null> | null) =>
  createsOptions(type) ? current?.filter(Boolean) ?? ["Option 1"] : null;

export const getDefaultOptionLabel = (options: Array<string | null>) =>
  `Option ${options.length + 1}`;
