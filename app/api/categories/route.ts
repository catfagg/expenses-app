import { categories } from "@/lib/store";
import { categorySchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const start = (page - 1) * limit;
  const end = start + limit;

  const items = categories.slice(start, end);

  return Response.json({
    items,
    total: categories.length,
    page,
    pages: Math.ceil(categories.length / limit),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = categorySchema.parse(body);

    const existingCategory = categories.find(
      (category) =>
        category.name.toLowerCase() ===
        validatedData.name.toLowerCase()
    );

    if (existingCategory) {
      return Response.json(
        {
          error: "Категория с таким названием уже существует",
        },
        {
          status: 422,
        }
      );
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      ...validatedData,
    };

    categories.push(newCategory);

    return Response.json(newCategory, {
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