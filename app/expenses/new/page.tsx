"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

export default function NewExpensePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const response = await fetch("/api/categories?limit=100");

      const data = await response.json();

      setCategories(data.items);

      if (data.items.length > 0) {
        setCategoryId(data.items[0].id);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/expenses", {
        method: "POST",
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
      } else {
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-8 px-6 py-12">
      <Link
        href="/expenses"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-gray-400
          transition-colors
          hover:text-indigo-600
        "
      >
        ← Назад к расходам
      </Link>

      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Новый расход</h1>

      <form
        onSubmit={handleSubmit}
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >
        {error && (
          <div
            className="
              mx-8
              mt-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              text-red-600
            "
          >
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
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                rounded-2xl
                border
                border-gray-200
                px-5
                py-4
                outline-none
                transition-all
                focus:border-indigo-400
                focus:ring-2
                focus:ring-indigo-100
              "
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
              className="
                rounded-2xl
                border
                border-gray-200
                px-5
                py-4
                outline-none
                transition-all
                focus:border-indigo-400
                focus:ring-2
                focus:ring-indigo-100
              "
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
              className="
                rounded-2xl
                border
                border-gray-200
                px-5
                py-4
                outline-none
                transition-all
                focus:border-indigo-400
                focus:ring-2
                focus:ring-indigo-100
              "
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
              className="
                resize-none
                rounded-2xl
                border
                border-gray-200
                px-5
                py-4
                outline-none
                transition-all
                focus:border-indigo-400
                focus:ring-2
                focus:ring-indigo-100
              "
            />
          </div>

          <div className="flex flex-col gap-2 px-8 py-5">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Категория *
            </label>

            <div className="relative">
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="
                  w-full
                  appearance-none
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  py-4
                  pr-12
                  outline-none
                  transition-all
                  focus:border-indigo-400
                  focus:ring-2
                  focus:ring-indigo-100
                "
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
            className="
              w-full
              rounded-2xl
              bg-indigo-600
              py-4
              text-base
              font-semibold
              text-white
              shadow-lg
              shadow-indigo-200
              transition-all
              hover:bg-indigo-700
              active:scale-95
              disabled:opacity-50
            "
          >
            {loading ? "Сохранение..." : "Создать"}
          </button>
        </div>
      </form>
    </div>
  );
}