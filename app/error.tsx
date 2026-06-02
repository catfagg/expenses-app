"use client";

export default function Error({
  error,
}: {
  error: Error;
}) {
  return (
    <div className="p-8">
      <h2 className="text-red-600 text-xl">
        Ошибка
      </h2>

      <p>{error.message}</p>
    </div>
  );
}