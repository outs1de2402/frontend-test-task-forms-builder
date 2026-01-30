export interface Question {
  id: string;
  type: "TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX" | "DATE";
  label: string;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Response {
  id: string;
  formId: string;
  answers: { questionId: string; value: string[] }[];
}

export const db = {
  forms: [] as Form[],
  responses: [] as Response[],
};
