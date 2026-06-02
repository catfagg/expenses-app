import { categories, expenses } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.toLowerCase() || "";
  const categoryId = searchParams.get("categoryId") || "";

  const items = expenses
    .filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(query);
      const matchesCategory = categoryId
        ? expense.categoryId === categoryId
        : true;
      return matchesSearch && matchesCategory;
    })
    .map((expense) => ({
      ...expense,
      category: categories.find((c) => c.id === expense.categoryId),
    }));

  return Response.json({
    items,
    total: items.length,
    page: 1,
    pages: 1,
  });
}
