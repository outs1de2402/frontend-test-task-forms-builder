import { useParams, useNavigate } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../api/generated";

export const FormResponses = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Отримуємо структуру форми (label питань)
  const { data: formData, isLoading: formLoading } = useGetFormQuery({
    id: id || "",
  });

  // 2. Отримуємо всі відповіді для цієї форми
  const {
    data: responsesData,
    isLoading: responsesLoading,
    error,
  } = useGetResponsesQuery({
    formId: id || "",
  });

  if (formLoading || responsesLoading)
    return <div className="p-8 text-white">Завантаження відповідей...</div>;
  if (error)
    return <div className="p-8 text-red-500">Помилка завантаження даних.</div>;

  const questions = formData?.form?.questions || [];
  const responses = responsesData?.responses || [];

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-white"
        >
          ← Назад
        </button>
        <h1 className="text-3xl font-bold">
          Відповіді: {formData?.form?.title}
        </h1>
      </div>

      {responses.length === 0 ? (
        <div className="bg-gray-800 p-10 rounded-xl text-center border border-dashed border-gray-600">
          <p className="text-gray-400">
            На цю форму ще немає жодної відповіді.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {responses.map((resp, index) => (
            <div
              key={resp.id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                <span className="text-purple-400 font-mono text-sm">
                  ID: {resp.id}
                </span>
                <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-xs">
                  Респондент #{index + 1}
                </span>
              </div>

              <div className="grid gap-6">
                {questions.map((q) => {
                  // Знаходимо відповідь на конкретне питання
                  const answer = resp.answers.find(
                    (a) => a.questionId === q.id,
                  );

                  return (
                    <div key={q.id} className="space-y-1">
                      <p className="text-gray-400 text-sm font-medium">
                        {q.label}
                      </p>
                      <div className="text-lg">
                        {answer && answer.value.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {answer.value.map((val, i) => (
                              <li key={i} className="text-gray-100">
                                {val}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500 italic">
                            Немає відповіді
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
