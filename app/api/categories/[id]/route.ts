import { categories, expenses } from "@/lib/store";
import { categorySchema } from "@/lib/validators";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;

  const category = categories.find((c) => c.id === id);

  if (!category) {
    return Response.json({ error: "Категория не найдена" }, { status: 404 });
  }

  const categoryExpenses = expenses.filter((e) => e.categoryId === id);

  return Response.json({
    ...category,
    expenses: categoryExpenses,
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const categoryIndex = categories.findIndex(
      (category) => category.id === id,
    );

    if (categoryIndex === -1) {
      return Response.json(
        {
          error: "Категория не найдена",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const validatedData = categorySchema.partial().parse(body);

    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...validatedData,
    };

    return Response.json(categories[categoryIndex]);
  } catch {
    return Response.json(
      {
        error: "Некорректные данные",
      },
      {
        status: 422,
      },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;

  const categoryIndex = categories.findIndex((category) => category.id === id);

  if (categoryIndex === -1) {
    return Response.json(
      {
        error: "Категория не найдена",
      },
      {
        status: 404,
      },
    );
  }

  categories.splice(categoryIndex, 1);

  return Response.json({
    message: "Категория удалена",
  });
}
