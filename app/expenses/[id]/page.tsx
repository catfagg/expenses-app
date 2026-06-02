import Link from "next/link";
import { notFound } from "next/navigation";
import { expenses, categories } from "@/lib/store";
import { PageProps } from "@/types";

type Props = PageProps;

export default async function ExpensePage({ params }: Props) {
  const { id } = await params;

  const expense = expenses.find((e) => e.id === id);
  if (!expense) notFound();

  const category = categories.find((c) => c.id === expense.categoryId);
  const data = { ...expense, category };

  return (
    <div className="w-full max-w-2xl space-y-8 px-6 py-12">
      <Link
        href="/expenses"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-indigo-600"
      >
        ← Назад к расходам
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl shadow-sm">
          ₽
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{data.title}</h1>
          <p className="mt-1 text-sm text-gray-400">Детали расхода</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-50">
          <div className="flex items-center justify-between px-8 py-5">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">ID</span>
            <span className="font-mono text-base text-gray-500">{data.id}</span>
          </div>
          <div className="flex items-center justify-between px-8 py-5">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Сумма</span>
            <span className="text-lg font-semibold text-gray-800">
              {Number(data.amount).toLocaleString("ru-RU")} ₽
            </span>
          </div>
          <div className="flex items-center justify-between px-8 py-5">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Дата</span>
            <span className="text-base text-gray-700">{data.date}</span>
          </div>
          <div className="flex items-center justify-between px-8 py-5">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Категория</span>
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600">
              {data.category?.name || "—"}
            </span>
          </div>
          <div className="px-8 py-5">
            <div className="mb-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Заметка</span>
            </div>
            <div className="rounded-2xl bg-gray-50 px-5 py-4 text-gray-700">
              {data.note || "Заметка отсутствует"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href={`/expenses/${data.id}/edit`}
          className="rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
        >
          Редактировать
        </Link>
      </div>
    </div>
  );
}