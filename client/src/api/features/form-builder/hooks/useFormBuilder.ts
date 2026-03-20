import { useState } from "react";
import type { QuestionInput, QuestionType } from "../../../generated";
import {
  createQuestionDraft,
  getDefaultOptionLabel,
  getQuestionOptions,
} from "../../../../features/form-builder/questionTypes";

export const useFormBuilder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([]);

  const addQuestion = () => {
    setQuestions((currentQuestions) => [...currentQuestions, createQuestionDraft()]);
  };

  const updateQuestion = (index: number, data: Partial<QuestionInput>) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...data } : question,
      ),
    );
  };

  const updateQuestionType = (index: number, type: QuestionType) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              type,
              options: getQuestionOptions(type, question.options),
            }
          : question,
      ),
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((currentQuestions) =>
      currentQuestions.filter((_question, questionIndex) => questionIndex !== index),
    );
  };

  const addOption = (questionIndex: number) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const currentOptions = question.options ? [...question.options] : [];
        return {
          ...question,
          options: [...currentOptions, getDefaultOptionLabel(currentOptions)],
        };
      }),
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, index) => {
        if (index !== questionIndex || !question.options) {
          return question;
        }

        return {
          ...question,
          options: question.options.filter((_option, index) => index !== optionIndex),
        };
      }),
    );
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    addQuestion,
    updateQuestion,
    updateQuestionType,
    removeQuestion,
    addOption,
    removeOption,
  };
};
