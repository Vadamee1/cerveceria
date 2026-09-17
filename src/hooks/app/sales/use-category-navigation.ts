"use client";

import { useState } from "react";
import { type CategoryRow } from "@/lib/validations/category";

export function useCategoryNavigation() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(
    null,
  );

  function selectCategory(category: CategoryRow) {
    setSelectedCategory(category);
  }

  function backToCategories() {
    setSelectedCategory(null);
  }

  return {
    selectedCategory,
    selectCategory,
    backToCategories,
  };
}
