"use client";

import { type CategoryRow } from "@/lib/validations/category";

type SaleCategoryGridProps = {
  categories: CategoryRow[];
  onSelect: (category: CategoryRow) => void;
};

export function SaleCategoryGrid({
  categories,
  onSelect,
}: SaleCategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category)}
          className="flex h-32 cursor-pointer items-center justify-center rounded-2xl border border-white bg-black px-4 text-center text-base font-medium text-white transition hover:bg-white/10"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
