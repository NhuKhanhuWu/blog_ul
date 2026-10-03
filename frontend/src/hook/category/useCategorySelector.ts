/** @format */

import { useEffect, useMemo, useState } from "react";
import { ICategory } from "../../types/category.type";
import { useCategories } from "../search/useCategories";
import { useDebounce } from "../shared/useDebounce";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";

interface UseCategorySelectorOptions {
  selectedIds?: string[];
  maxSelected?: number;
  debounceMs?: number;
}

export function useCategorySelector({
  selectedIds = [],
  maxSelected = Infinity,
  debounceMs = 500,
}: UseCategorySelectorOptions = {}) {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, debounceMs);

  const { data, fetchNextPage, hasNextPage, isPending, isFetchingNextPage } =
    useCategories(debouncedSearch);

  const [cachedSelected, setCachedSelected] = useState<ICategory[]>([]);

  /*
   * Categories currently returned from API
   */
  const categories = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  /*
   * Cache selected categories.
   *
   * This is important because when user searches for another
   * keyword, the previous selected category may disappear
   * from API results.
   */
  useEffect(() => {
    const selectedSet = new Set(selectedIds);

    const newSelected = categories.filter(
      (category) =>
        selectedSet.has(category._id) &&
        !cachedSelected.some((cached) => cached._id === category._id),
    );

    if (newSelected.length > 0) {
      setCachedSelected((prev) => [...prev, ...newSelected]);
    }
  }, [categories, selectedIds, cachedSelected]);

  /*
   * All categories that we currently know about.
   */
  const allKnownCategories = useMemo(() => {
    const map = new Map<string, ICategory>();

    cachedSelected.forEach((category) => map.set(category._id, category));

    categories.forEach((category) => map.set(category._id, category));

    return Array.from(map.values());
  }, [cachedSelected, categories]);

  /*
   * Infinite scroll
   */
  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  );

  /*
   * Select category
   */
  const canSelectMore = selectedIds.length < maxSelected;

  const select = (category: ICategory) => {
    if (!canSelectMore) return;
    if (selectedIds.includes(category._id)) return;

    setCachedSelected((prev) => {
      if (prev.some((item) => item._id === category._id)) {
        return prev;
      }

      return [...prev, category];
    });

    return [...selectedIds, category._id];
  };

  /*
   * Remove category
   */
  const remove = (id: string) => {
    setCachedSelected((prev) => prev.filter((category) => category._id !== id));

    return selectedIds.filter((categoryId) => categoryId !== id);
  };

  return {
    search,
    setSearch,

    categories,
    allKnownCategories,

    select,
    remove,

    canSelectMore,

    isPending,
    isFetchingNextPage,
    hasNextPage,

    lastElementRef,
  };
}
