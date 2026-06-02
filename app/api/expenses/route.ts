import { categories, expenses } from "@/lib/store";
import { expenseSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const categoryId = searchParams.get("categoryId");

  let filteredExpenses = expenses;

  if (categoryId) {
    filteredExpenses = expenses.filter(
      (expense) => expense.categoryId === categoryId
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  const items = filteredExpenses
    .slice(start, end)
    .map((expense) => ({
      ...expense,
      category: categories.find(
        (category) => category.id === expense.categoryId
      ),
    }));

  return Response.json({
    items,
    total: filteredExpenses.length,
    page,
    pages: Math.ceil(filteredExpenses.length / limit),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = expenseSchema.parse({
      ...body,
      amount: Number(body.amount),
    });

    const categoryExists = categories.some(
      (category) => category.id === validatedData.categoryId
    );

    if (!categoryExists) {
      return Response.json(
        {
          error: "Категория не найдена",
        },
        {
          status: 422,
        }
      );
    }

    const newExpense = {
      id: `exp-${Date.now()}`,
      ...validatedData,
    };

    expenses.push(newExpense);

    return Response.json(newExpense, {
      status: 201,
    });
  } catch {
    return Response.json(
      {
        error: "Некорректные данные",
      },
      {
        status: 422,
      }
    );
  }
}