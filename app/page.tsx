import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 leading-tight">
          Система учёта расходов
        </h1>
      </div>

      <p className="text-gray-400 text-base sm:text-lg max-w-sm sm:max-w-none">
        Удобный учёт расходов на каждый день.
      </p>

      <div className="flex gap-3 sm:gap-4 pt-2">
        <Link
          href="/categories"
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-sm sm:text-base transition-all text-white font-semibold px-8 py-3 shadow-lg shadow-indigo-200"
        >
          Категории
        </Link>
        <Link
          href="/expenses"
          className="rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-sm sm:text-base transition-all text-white font-semibold px-8 py-3 shadow-lg shadow-rose-200"
        >
          Расходы
        </Link>
      </div>
    </div>
  );
}