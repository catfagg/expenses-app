export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  note?: string;
  categoryId: string;
}

export interface ExpenseWithCategory extends Expense {
  category?: Category;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface PageProps {
  params: Promise<{ id: string }>;
}