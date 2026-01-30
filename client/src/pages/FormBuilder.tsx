import { useNavigate } from "react-router-dom";
// 1. Імпортуємо типи згенеровані кодегеном
import type { QuestionType } from "../api/generated";
import { useCreateFormMutation } from "../api/generated";
import { useFormBuilder } from "../api/features/form-builder/hooks/useFormBuilder";

export const FormBuilder = () => {
  const navigate = useNavigate();
  const {
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
  } = useFormBuilder();

  // Мутація для створення форми
  const [createForm, { isLoading }] = useCreateFormMutation();

  const handleSave = async () => {
    if (!title.trim()) return; // Додаткова перевірка перед відправкою
    try {
      await createForm({ title, description, questions }).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Помилка при збереженні форми:", err);
    }
  };

  return (
    /* Встановлюємо text-gray-900, щоб текст у картках завжди був темним */
    <div className="p-8 max-w-2xl mx-auto space-y-6 text-gray-900">
      {/* Секція заголовка форми */}
      <div className="bg-white p-6 rounded-lg shadow-md border-t-8 border-purple-700">
        <input
          className="text-3xl w-full border-b mb-4 outline-none text-black placeholder:text-gray-400 focus:border-purple-500 transition-colors"
          placeholder="Заголовок форми"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full outline-none text-gray-600 placeholder:text-gray-400 min-h-[60px]"
          placeholder="Опис форми"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Список запитань */}
      {questions.map((q, qIdx) => (
        <div
          key={qIdx}
          className="bg-white p-6 rounded-lg shadow-md relative border border-gray-100 transition-all"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              className="flex-1 border-b p-2 outline-none bg-gray-50 text-black focus:bg-white focus:border-purple-400 transition-all"
              placeholder="Введіть запитання"
              value={q.label}
              onChange={(e) => updateQuestion(qIdx, { label: e.target.value })}
            />
            <select
              className="border p-2 rounded bg-white text-black cursor-pointer hover:border-purple-400"
              value={q.type}
              onChange={(e) =>
                updateQuestion(qIdx, {
                  type: e.target.value as QuestionType,
                  options:
                    e.target.value === "TEXT" || e.target.value === "DATE"
                      ? null
                      : ["Варіант 1"],
                })
              }
            >
              <option value="TEXT">Текст</option>
              <option value="DATE">Дата</option>
              <option value="MULTIPLE_CHOICE">Один варіант (Radio)</option>
              <option value="CHECKBOX">Кілька варіантів (Checkbox)</option>
            </select>
          </div>

          {/* Варіанти відповідей (тільки для вибіркових типів) */}
          {(q.type === "MULTIPLE_CHOICE" || q.type === "CHECKBOX") && (
            <div className="space-y-3 mb-6 ml-4">
              {q.options?.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 border ${q.type === "CHECKBOX" ? "rounded" : "rounded-full"} border-gray-300`}
                  />
                  <input
                    className="border-b flex-1 outline-none text-black py-1 focus:border-purple-300"
                    value={opt ?? ""}
                    onChange={(e) => {
                      const newOpts = [...(q.options || [])];
                      newOpts[optIdx] = e.target.value;
                      updateQuestion(qIdx, { options: newOpts as string[] });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(qIdx, optIdx)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Видалити варіант"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIdx)}
                className="text-purple-600 text-sm font-semibold hover:text-purple-800 flex items-center gap-1 mt-2"
              >
                <span className="text-lg">+</span> Додати варіант
              </button>
            </div>
          )}

          <div className="flex justify-end border-t pt-4 mt-4">
            <button
              type="button"
              onClick={() => removeQuestion(qIdx)}
              className="text-red-500 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors"
            >
              Видалити запитання
            </button>
          </div>
        </div>
      ))}

      {/* Нижня панель дій */}
      <div className="flex justify-between items-center bg-gray-900/5 p-4 rounded-xl">
        <button
          type="button"
          onClick={addQuestion}
          className="bg-white border-2 border-purple-700 px-6 py-2 rounded-lg shadow-sm text-purple-700 font-bold hover:bg-purple-50 transition-all active:scale-95"
        >
          + Додати запитання
        </button>
        <button
          type="button"
          onClick={handleSave}
          // Кнопка активна тільки якщо вказано заголовок і не йде завантаження
          disabled={isLoading || !title.trim()}
          className="bg-purple-700 text-white px-10 py-2 rounded-lg shadow-lg font-bold hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isLoading ? "Збереження..." : "Зберегти форму"}
        </button>
      </div>
    </div>
  );
};
