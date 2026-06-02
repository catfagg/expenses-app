"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Category, PageProps } from "@/types";

type Props = PageProps;

export default function EditCategoryPage({ params }: Props) {
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#000000");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/categories/${id}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          setCategory(data);
          setName(data.name);
          setDescription(data.description || "");
          setColor(data.color);
          setIsActive(data.isActive);
        });
    });
  }, [params]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, color, isActive }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      router.push("/categories");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!category) {
    return (
      <p className="text-gray-400 animate-pulse py-12 px-6">Загрузка...</p>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8 py-12 px-6">
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 font-medium transition-colors"
      >
        ← Назад к категориям
      </Link>

      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Редактирование</h1>

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border border-gray-200 px-5 py-4 text-base text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2 px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-2xl border border-gray-200 px-5 py-4 text-base text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Цвет *
            </label>
            <div className="flex items-center gap-3">
              <input
                required
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0"
              />
              <span className="text-sm font-mono text-gray-400">{color}</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Активна
            </label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isActive ? "bg-indigo-600" : "bg-gray-200"
                }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
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