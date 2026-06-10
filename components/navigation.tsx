"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow relative z-50 sticky top-0">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.svg" width={32} height={32} alt="logo" />
            <span className="font-bold text-xl">Expense Tracker</span>
          </Link>

          <div className="hidden sm:flex gap-8">
            <Link href="/categories" className="hover:text-blue-600 font-semibold transition-colors">
              Категории
            </Link>
            <Link href="/expenses" className="hover:text-blue-600 font-semibold transition-colors">
              Расходы
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Меню"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {open && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          <Link
            href="/categories"
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            Категории
          </Link>
          <Link
            href="/expenses"
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            Расходы
          </Link>
        </div>
      )}
    </header>
  );
}

