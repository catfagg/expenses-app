"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Category, ExpenseWithCategory, PaginatedResponse } from "@/types";

const LIMIT = 5;

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadExpenses = useCallback(
    async (searchValue: string, categoryValue: string, currentPage: number) => {
      setLoading(true);
      try {
        let url: string;

        if (searchValue.trim()) {
          url = `/api/expenses/search?q=${encodeURIComponent(searchValue.trim())}`;
          if (categoryValue) url += `&categoryId=${categoryValue}`;
        } else {
          url = `/api/expenses?page=${currentPage}&limit=${LIMIT}`;
          if (categoryValue) url += `&categoryId=${categoryValue}`;
        }

        const res = await fetch(url);
        const data: PaginatedResponse<ExpenseWithCategory> = await res.json();

        if (searchValue.trim()) {
          const start = (currentPage - 1) * LIMIT;
          setExpenses(data.items.slice(start, start + LIMIT));
          setTotalPages(Math.max(1, Math.ceil(data.total / LIMIT)));
        } else {
          setExpenses(data.items ?? []);
          setTotalPages(data.pages ?? 1);
        }
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [],
  );

  async function deleteExpense(id: string) {
    const confirmed = confirm("Удалить расход?");
    if (!confirmed) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses(search, categoryId, page);
  }

  useEffect(() => {
    fetch("/api/categories?limit=100")
      .then((r) => r.json())
      .then((data) => setCategories(data.items));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadExpenses(search, categoryId, page);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, categoryId, page, loadExpenses]);

  function getPageNumbers(): (number | "dots")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "dots")[] = [1];

    if (page > 3) pages.push("dots");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push("dots");

    pages.push(totalPages);

    return pages;
  }

  return (
    <div className="w-full space-y-6 px-4 py-6 sm:px-6 sm:py-12 overflow-x-hidden">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-4xl">
          Расходы
        </h1>
        <Link
          href="/expenses/new"
          className="shrink-0 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 sm:px-8 sm:py-4 sm:text-base"
        >
          + Добавить
        </Link>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Поиск расходов..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-5 sm:py-4 sm:text-base"
        />
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 cursor-pointer sm:px-5 sm:py-4 sm:text-base"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {initialLoad ? (
        <p className="animate-pulse text-gray-400">Загрузка...</p>
      ) : (
        <div
          className={`transition-opacity duration-150 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="hidden w-full table-fixed sm:table">
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[16%]" />
                <col className="w-[16%]" />
                <col className="w-[24%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-8 lg:py-5 lg:text-sm">
                    Название
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-8 lg:py-5 lg:text-sm">
                    Сумма
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-8 lg:py-5 lg:text-sm">
                    Дата
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-8 lg:py-5 lg:text-sm">
                    Категория
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-8 lg:py-5 lg:text-sm">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-12 text-center text-gray-400"
                    >
                      Ничего не найдено
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="truncate px-4 py-4 text-sm font-medium text-gray-700 lg:px-8 lg:py-5 lg:text-base">
                        {expense.title}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800 lg:px-8 lg:py-5 lg:text-base">
                        {expense.amount.toLocaleString("ru-RU")} ₽
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 lg:px-8 lg:py-5 lg:text-base">
                        {expense.date}
                      </td>
                      <td className="px-4 py-4 lg:px-8 lg:py-5">
                        <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 lg:px-3 lg:text-sm">
                          {expense.category?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4 lg:px-8 lg:py-5">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/expenses/${expense.id}`}
                            title="Открыть"
                            className="p-2 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 lg:h-5 lg:w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </Link>
                          <Link
                            href={`/expenses/${expense.id}/edit`}
                            title="Изменить"
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 lg:h-5 lg:w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            title="Удалить"
                            className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 lg:h-5 lg:w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <ul className="divide-y divide-gray-100 sm:hidden">
              {expenses.length === 0 ? (
                <li className="px-4 py-12 text-center text-gray-400">
                  Ничего не найдено
                </li>
              ) : (
                expenses.map((expense) => (
                  <li key={expense.id} className="px-4 py-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="truncate text-base font-medium text-gray-800">
                        {expense.title}
                      </span>
                      <span className="shrink-0 text-base font-semibold text-gray-800">
                        {expense.amount.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {expense.date}
                        </span>
                        <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                          {expense.category?.name ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/expenses/${expense.id}`}
                          title="Открыть"
                          className="p-1.5 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                        <Link
                          href={`/expenses/${expense.id}/edit`}
                          title="Изменить"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          title="Удалить"
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mt-6 flex justify-center items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            {getPageNumbers().map((p, idx) =>
              p === "dots" ? (
                <span
                  key={`dots-${idx}`}
                  className="px-2 text-sm text-gray-400 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[36px] rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition-all ${p === page
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}