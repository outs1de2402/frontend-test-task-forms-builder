import { db } from "../store/db.js";
import { v4 as uuidv4 } from "uuid";

export const resolvers = {
  Query: {
    forms: () => db.forms,
    form: (_: any, { id }: { id: string }) => db.forms.find((f) => f.id === id),
    responses: (_: any, { formId }: { formId: string }) =>
      db.responses.filter((r) => r.formId === formId),
  },
  Mutation: {
    createForm: (_: any, { title, description, questions }: any) => {
      const newForm = {
        id: uuidv4(),
        title,
        description,
        questions: questions.map((q: any) => ({ ...q, id: uuidv4() })),
      };
      db.forms.push(newForm);
      return newForm;
    },
    submitResponse: (_: any, { formId, answers }: any) => {
      const newResponse = {
        id: uuidv4(),
        formId,
        answers,
      };
      db.responses.push(newResponse);
      return newResponse;
    },
  },
};
