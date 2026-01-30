import { useState } from "react";
// Імпортуємо типи прямо з генерації
import type { QuestionType, QuestionInput } from "../../../generated";

export const useFormBuilder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Явно вказуємо масив QuestionInput
  const [questions, setQuestions] = useState<QuestionInput[]>([]);

  const addQuestion = () => {
    const newQuestion: QuestionInput = {
      label: "",
      type: "TEXT" as QuestionType,
      options: null,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, data: Partial<QuestionInput>) => {
    const newQs = [...questions];
    newQs[index] = { ...newQs[index], ...data } as QuestionInput;
    setQuestions(newQs);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    const currentOptions = q.options ? [...q.options] : [];
    updateQuestion(qIndex, {
      options: [...currentOptions, `Варіант ${currentOptions.length + 1}`],
    });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const q = questions[qIndex];
    if (q.options) {
      updateQuestion(qIndex, {
        options: q.options.filter((_, i) => i !== optIndex),
      });
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    removeOption,
  };
};
