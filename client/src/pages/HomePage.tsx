import { Link } from "react-router-dom";
import { useGetFormsQuery } from "../api/generated";

export const HomePage = () => {
  const { data, isLoading, error } = useGetFormsQuery();

  // 1. Обов'язково обробляємо завантаження
  if (isLoading) {
    return <div className="p-8 text-center">Завантаження форм...</div>;
  }

  // 2. Обов'язково обробляємо помилку (наприклад, сервер не запущено)
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Помилка завантаження даних
      </div>
    );
  }

  // 3. Тільки тепер працюємо з даними
  const forms = data?.forms || [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мої форми</h1>
        <Link
          to="/forms/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Створити нову
        </Link>
      </div>

      <div className="grid gap-4">
        {forms.length > 0 ? (
          forms.map((form) => (
            <div
              key={form.id}
              className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white"
            >
              <div>
                <h2 className="text-xl font-semibold">{form.title}</h2>
                <p className="text-gray-600">
                  {form.description || "Немає опису"}
                </p>
              </div>
              <Link
                to={`/forms/${form.id}/fill`}
                className="text-blue-600 hover:underline"
              >
                Переглянути →
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg">
            У вас ще немає створених форм. Натисніть кнопку вище, щоб створити
            першу!
          </p>
        )}
      </div>
    </div>
  );
};
