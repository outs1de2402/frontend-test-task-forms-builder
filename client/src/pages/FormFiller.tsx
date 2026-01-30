import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFormQuery, useSubmitResponseMutation } from "../api/generated";
import type { AnswerInput } from "../api/generated";

export const FormFiller = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Отримуємо дані форми
  const { data, isLoading, error } = useGetFormQuery({ id: id || "" });

  // Мутація для відправки
  const [submitResponse, { isLoading: isSubmitting }] =
    useSubmitResponseMutation();

  // Локальний стан для відповідей: { questionId: [values] }
  const [answersState, setAnswersState] = useState<Record<string, string[]>>(
    {},
  );

  if (isLoading)
    return (
      <div className="p-8 text-center text-white">Завантаження форми...</div>
    );

  if (error || !data?.form)
    return (
      <div className="p-8 text-red-500 text-center">Форма не знайдена</div>
    );

  const handleInputChange = (
    questionId: string,
    value: string,
    isCheckbox = false,
  ) => {
    setAnswersState((prev) => {
      if (isCheckbox) {
        const currentValues = prev[questionId] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return { ...prev, [questionId]: newValues };
      }
      return { ...prev, [questionId]: [value] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Формуємо масив AnswerInput згідно зі схемою
    const formattedAnswers: AnswerInput[] = Object.entries(answersState).map(
      ([questionId, value]) => ({
        questionId,
        value,
      }),
    );

    try {
      await submitResponse({
        formId: id || "",
        answers: formattedAnswers,
      }).unwrap();

      alert("Форму успішно відправлено!");
      navigate("/");
    } catch (err) {
      console.error("Помилка при відправці:", err);
      alert("Не вдалося відправити форму.");
    }
  };

  return (
    /* Додаємо text-gray-900 для всього контейнера, щоб перебити білий колір з body */
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-2xl rounded-xl mt-10 text-gray-900">
      <h1 className="text-3xl font-extrabold mb-2 text-black">
        {data.form.title}
      </h1>
      <p className="text-gray-500 mb-8 border-b pb-6">
        {data.form.description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {data.form.questions.map((q) => (
          <div
            key={q.id}
            className="p-6 border border-gray-100 rounded-xl bg-gray-50/50"
          >
            <label className="block font-bold mb-4 text-lg text-black">
              {q.label}
            </label>

            {/* Текстове поле */}
            {q.type === "TEXT" && (
              <input
                type="text"
                required
                className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400"
                placeholder="Ваша відповідь"
                onChange={(e) => handleInputChange(q.id, e.target.value)}
              />
            )}

            {/* Дата */}
            {q.type === "DATE" && (
              <input
                type="date"
                required
                className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                onChange={(e) => handleInputChange(q.id, e.target.value)}
              />
            )}

            {/* Радіо-кнопки */}
            {q.type === "MULTIPLE_CHOICE" && (
              <div className="space-y-3">
                {q.options?.map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      required
                      className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                      onChange={() => handleInputChange(q.id, opt || "")}
                    />
                    <span className="text-gray-700 group-hover:text-black transition-colors">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Чекбокси */}
            {q.type === "CHECKBOX" && (
              <div className="space-y-3">
                {q.options?.map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      onChange={() => handleInputChange(q.id, opt || "", true)}
                    />
                    <span className="text-gray-700 group-hover:text-black transition-colors">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-700 text-white px-12 py-3 rounded-lg font-bold hover:bg-purple-800 disabled:bg-gray-400 transition-all active:scale-95 shadow-lg shadow-purple-200"
          >
            {isSubmitting ? "Надсилання..." : "Надіслати відповідь"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-gray-400 font-medium hover:text-gray-600 transition-colors"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
};
