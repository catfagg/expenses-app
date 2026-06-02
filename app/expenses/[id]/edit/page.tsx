"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Category, Expense, PageProps } from "@/types";

type Props = PageProps;

export default function EditExpensePage({ params }: Props) {
  const router = useRouter();

  const [expense, setExpense] = useState<Expense | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");

  const [amount, setAmount] = useState("");

  const [date, setDate] = useState("");

  const [note, setNote] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { id } = await params;

      const [expenseResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/expenses/${id}`, {
          cache: "no-store",
        }),

        fetch("/api/categories?limit=100"),
      ]);

      const expenseData = await expenseResponse.json();

      const categoriesData = await categoriesResponse.json();

      setExpense(expenseData);

      setCategories(categoriesData.items);

      setTitle(expenseData.title);

      setAmount(String(expenseData.amount));

      setDate(expenseData.date);

      setNote(expenseData.note || "");

      setCategoryId(expenseData.categoryId);
    }

    loadData();
  }, [params]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!expense) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          amount: Number(amount),
          date,
          note,
          categoryId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка");
      }

      router.push("/expenses");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!expense) {
    return (
      <p className="animate-pulse px-6 py-12 text-gray-400">Загрузка...</p>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8 py-12 px-6">
      <Link
        href="/expenses"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 font-medium transition-colors"
      >
        ← Назад к расходам
      </Link>

      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
        Редактирование расхода
      </h1>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200"
      >
        {error && (
          <div className="mx-8 mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="divide-y divide-gray-50">
          <div className="flex flex-col gap-2 px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Название *
            </label>

            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl border border-gray-200 px-5 py-4 text-base text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2 px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Сумма *
            </label>

            <input
              required
              min="1"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-2xl border border-gray-200 px-5 py-4 text-base text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2 px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Дата *
            </label>

            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-2xl border border-gray-200 px-5 py-4 text-base text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2 px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Заметка
            </label>

            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-2xl border border-gray-200 px-5 py-4 text-base text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Категория *
            </label>

            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-gray-200 px-5 py-4 pr-12 text-base text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <Image
                  src="/images/arrow.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="invert"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-semibold py-4 text-base shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
