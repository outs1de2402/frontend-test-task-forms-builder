import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";
import {
  db,
  type CreateFormInput,
  type Form,
  type Question,
  type SubmitResponseInput,
} from "../store/db.js";

const sanitizeOptions = (options?: Array<string | null> | null) =>
  (options ?? []).map((option) => option?.trim() ?? "").filter(Boolean);

const normalizeQuestions = (questions?: CreateFormInput["questions"]): Question[] =>
  (questions ?? []).map((question) => ({
    ...question,
    id: uuidv4(),
    label: question.label.trim(),
    options: sanitizeOptions(question.options),
  }));

const getFormById = (formId: string): Form => {
  const form = db.forms.find((item) => item.id === formId);

  if (!form) {
    throw new GraphQLError("Form not found.");
  }

  return form;
};

export const resolvers = {
  Query: {
    forms: () => db.forms,
    form: (_parent: unknown, { id }: { id: string }) =>
      db.forms.find((form) => form.id === id) ?? null,
    responses: (_parent: unknown, { formId }: { formId: string }) => {
      getFormById(formId);
      return db.responses.filter((response) => response.formId === formId);
    },
  },
  Mutation: {
    createForm: (_parent: unknown, { title, description, questions }: CreateFormInput) => {
      const normalizedTitle = title.trim();

      if (!normalizedTitle) {
        throw new GraphQLError("Form title is required.");
      }

      const newForm: Form = {
        id: uuidv4(),
        title: normalizedTitle,
        description: description?.trim() || undefined,
        questions: normalizeQuestions(questions),
      };

      db.forms.push(newForm);
      return newForm;
    },
    submitResponse: (_parent: unknown, { formId, answers }: SubmitResponseInput) => {
      const form = getFormById(formId);
      const safeAnswers = answers ?? [];

      safeAnswers.forEach((answer) => {
        const questionExists = form.questions.some(
          (question) => question.id === answer.questionId,
        );

        if (!questionExists) {
          throw new GraphQLError(`Question ${answer.questionId} does not belong to form ${formId}.`);
        }
      });

      const newResponse = {
        id: uuidv4(),
        formId,
        answers: safeAnswers,
      };

      db.responses.push(newResponse);
      return newResponse;
    },
  },
};
