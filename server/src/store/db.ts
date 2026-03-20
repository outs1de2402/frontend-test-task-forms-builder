export type QuestionType = "TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX" | "DATE";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value: string[];
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
}

export interface CreateFormInput {
  title: string;
  description?: string | null;
  questions?: Array<Omit<Question, "id">> | null;
}

export interface SubmitResponseInput {
  formId: string;
  answers?: Answer[] | null;
}

export const db = {
  forms: [] as Form[],
  responses: [] as Response[],
};
