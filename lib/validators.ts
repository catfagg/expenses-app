import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Название должно содержать минимум 2 символа"),

  description: z.string().optional(),

  color: z
    .string()
    .min(1, "Укажите цвет"),

  isActive: z.boolean(),
});

export const expenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Название должно содержать минимум 2 символа"),

  amount: z
    .number()
    .positive("Сумма должна быть больше 0"),

  date: z.string(),

  note: z.string().optional(),

  categoryId: z
    .string()
    .min(1, "Выберите категорию"),
});
