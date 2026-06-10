import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, expenses } from "@/lib/store";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;

  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const categoryExpenses = expenses.filter((e) => e.categoryId === id);

  return (
    <div className="w-full max-w-2xl space-y-6 py-6 px-4 sm:py-12 sm:px-6">
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 font-medium transition-colors"
      >
        ← Назад к категориям
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl shadow-sm shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 truncate">{category.name}</h1>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-50">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
            <span className="shrink-0 text-sm font-semibold uppercase tracking-wider text-gray-400">
              ID
            </span>
            <span className="truncate text-xs sm:text-base font-mono text-gray-500">
              {category.id}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
            <span className="shrink-0 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Описание
            </span>
            <span className="text-sm sm:text-base text-gray-700 text-right">
              {category.description || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
            <span className="shrink-0 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Статус
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium ${category.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-500"
                }`}
            >
              {category.isActive ? "Активна" : "Неактивна"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
            <span className="shrink-0 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Цвет
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="h-6 w-6 sm:h-8 sm:w-8 rounded-xl shadow-sm shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs sm:text-sm font-mono text-gray-400">
                {category.color}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg sm:text-xl font-bold text-gray-800">
          Расходы{" "}
          <span className="text-gray-400 font-normal text-sm sm:text-base">
            ({categoryExpenses.length})
          </span>
        </h2>

        {categoryExpenses.length === 0 ? (
          <p className="text-gray-400">Нет расходов в этой категории</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[45%]" />
                <col className="w-[25%]" />
                <col className="w-[30%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6 sm:py-4 sm:text-sm">
                    Название
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6 sm:py-4 sm:text-sm">
                    Сумма
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6 sm:py-4 sm:text-sm">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categoryExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="truncate px-4 py-3 text-sm font-medium text-gray-700 sm:px-6 sm:py-4 sm:text-base">
                      <Link
                        href={`/expenses/${expense.id}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {expense.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 sm:px-6 sm:py-4 sm:text-base">
                      {expense.amount.toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 sm:px-6 sm:py-4 sm:text-base">
                      {expense.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Link
          href={`/categories/${category.id}/edit`}
          className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 sm:px-8 sm:py-4 sm:text-base"
        >
          Редактировать
        </Link>
      </div>
    </div>
  );
}

