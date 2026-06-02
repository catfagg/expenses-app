import { categories, expenses } from "@/lib/store";
import { expenseSchema } from "@/lib/validators";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const expense = expenses.find(
    (expense) => expense.id === id
  );

  if (!expense) {
    return Response.json(
      {
        error: "Расход не найден",
      },
      {
        status: 404,
      }
    );
  }

  const category = categories.find(
    (category) => category.id === expense.categoryId
  );

  return Response.json({
    ...expense,
    category,
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const expenseIndex = expenses.findIndex(
      (expense) => expense.id === id
    );

    if (expenseIndex === -1) {
      return Response.json(
        {
          error: "Расход не найден",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    const validatedData = expenseSchema
      .partial()
      .parse({
        ...body,
        amount:
          body.amount !== undefined
            ? Number(body.amount)
            : undefined,
      });

    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      ...validatedData,
    };

    return Response.json(
      expenses[expenseIndex]
    );
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

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const expenseIndex = expenses.findIndex(
    (expense) => expense.id === id
  );

  if (expenseIndex === -1) {
    return Response.json(
      {
        error: "Расход не найден",
      },
      {
        status: 404,
      }
    );
  }

  expenses.splice(expenseIndex, 1);

  return Response.json({
    message: "Расход удалён",
  });
}