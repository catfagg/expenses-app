"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Category, PaginatedResponse } from "@/types";

const LIMIT = 5;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const loadCategories = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/categories?page=${currentPage}&limit=${LIMIT}`,
        { cache: "no-store" },
      );
      const data: PaginatedResponse<Category> = await res.json();
      setCategories(data.items ?? []);
      setTotalPages(data.pages ?? 1);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    loadCategories(page);
  }, [page, loadCategories]);

  async function deleteCategory(id: string) {
    const confirmed = confirm("Удалить категорию?");
    if (!confirmed) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    loadCategories(page);
  }

  return (
    <div className="w-full space-y-6 py-6 px-4 sm:py-12 sm:px-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
          Категории
        </h1>
        <Link
          href="/categories/new"
          className="shrink-0 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-semibold px-4 py-2.5 text-sm sm:px-8 sm:py-4 sm:text-base shadow-lg shadow-indigo-200"
        >
          + Добавить
        </Link>
      </div>

      {initialLoad ? (
        <p className="animate-pulse text-gray-400">Загрузка...</p>
      ) : (
        <div
          className={`transition-opacity duration-150 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
            <table className="hidden sm:table w-full table-fixed">
              <colgroup>
                <col className="w-[32%]" />
                <col className="w-[24%]" />
                <col className="w-[20%]" />
                <col className="w-[24%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 lg:px-8 lg:py-5 lg:text-sm">
                    Название
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 lg:px-8 lg:py-5 lg:text-sm">
                    Цвет
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 lg:px-8 lg:py-5 lg:text-sm">
                    Активна
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 lg:px-8 lg:py-5 lg:text-sm">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-8 py-12 text-center text-gray-400"
                    >
                      Нет категорий
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="truncate px-4 py-4 text-sm font-medium text-gray-700 lg:px-8 lg:py-5 lg:text-base">
                        {category.name}
                      </td>
                      <td className="px-4 py-4 lg:px-8 lg:py-5">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded-xl shadow-sm shrink-0 lg:h-8 lg:w-8"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="hidden text-xs font-mono text-gray-400 lg:inline">
                            {category.color}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 lg:px-8 lg:py-5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium lg:px-4 lg:py-1.5 lg:text-sm ${category.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {category.isActive ? "Активна" : "Неактивна"}
                        </span>
                      </td>
                      <td className="px-4 py-4 lg:px-8 lg:py-5">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/categories/${category.id}`}
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
                            href={`/categories/${category.id}/edit`}
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
                            onClick={() => deleteCategory(category.id)}
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
              {categories.length === 0 ? (
                <li className="px-4 py-12 text-center text-gray-400">
                  Нет категорий
                </li>
              ) : (
                categories.map((category) => (
                  <li key={category.id} className="px-4 py-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="h-6 w-6 rounded-lg shadow-sm shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="truncate text-base font-medium text-gray-800">
                          {category.name}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${category.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {category.isActive ? "Активна" : "Неактивна"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-400">
                        {category.color}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/categories/${category.id}`}
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
                          href={`/categories/${category.id}/edit`}
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
                          onClick={() => deleteCategory(category.id)}
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

          <div className="mt-6 flex items-center gap-2 justify-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition-all ${p === page
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {p}
              </button>
            ))}
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
