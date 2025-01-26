import { useState, useCallback, useEffect } from "react";

// sort_and_filter_query_params.ts
export interface SortOption {
  value: string;
  name: string;
  current: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
}

export interface FilterGroup {
  id: "style" | "roast";
  name: string;
  options: FilterOption[];
}

export const initialSortOptions: SortOption[] = [
  { value: "default", name: "Default", current: true },
  { value: "newest", name: "Newest", current: false },
  { value: "best_reviews", name: "Best Reviews", current: false },
  { value: "title_a_z", name: "Title A-Z", current: false },
  { value: "title_z_a", name: "Title Z-A", current: false },
  { value: "price_low_high", name: "Price (Low to High)", current: false },
  { value: "price_high_low", name: "Price (High to Low)", current: false },
];

export const initialFilters: FilterGroup[] = [
  {
    id: "style",
    name: "Style",
    options: [
      { value: "Fresh Ground", label: "Fresh Ground", checked: true },
      { value: "Whole Bean", label: "Whole Bean", checked: true },
      { value: "Powder", label: "Powder", checked: true },
      { value: "No Caffeine", label: "No Caffeine", checked: true },
    ],
  },
  {
    id: "roast",
    name: "Roast",
    options: [
      { value: "Light Roast", label: "Light Roast", checked: true },
      { value: "Medium Roast", label: "Medium Roast", checked: true },
      { value: "Dark Roast", label: "Dark Roast", checked: true },
      { value: "Flavor", label: "Flavored", checked: true },
    ],
  },
];

/**
 * Reads "sort" from ?sort=XYZ, and updates sortOptions accordingly.
 * If no "sort" is found, fallback to "default".
 */
export function getUpdatedSortOptions(
  currentSortOptions: SortOption[],
  queryParams: URLSearchParams,
): SortOption[] {
  const sortFromQuery = queryParams.get("sort");

  return currentSortOptions.map((option) => ({
    ...option,
    current: sortFromQuery
      ? option.value === sortFromQuery
      : option.value === "default",
  }));
}

/**
 * Reads filter values from something like ?roast=fresh_ground&roast=powder
 * and marks them as checked in the relevant FilterGroup(s).
 */
export function getUpdatedFilters(
  currentFilters: FilterGroup[],
  queryParams: URLSearchParams,
): FilterGroup[] {
  return currentFilters.map((group) => {
    const paramValues = queryParams.getAll(group.id); // e.g. ["fresh_ground", "powder"]
    return {
      ...group,
      options: group.options.map((opt) => ({
        ...opt,
        checked:
          // If no params for this group, keep everything checked:
          paramValues.length === 0
            ? true
            : // Else only check if the option’s value is found in paramValues:
              paramValues.includes(opt.value),
      })),
    };
  });
}

/**
 * Updates the browser's query string (without reloading the page)
 * to reflect the user’s current sort and filter selections.
 */
export function setQueryParams(
  sortOptions: SortOption[],
  filters: FilterGroup[],
) {
  const params = new URLSearchParams();

  // Add the selected sort (only one can be selected)
  const selectedSort = sortOptions.find((s) => s.current);
  if (selectedSort && selectedSort.value !== "default") {
    params.set("sort", selectedSort.value);
  }

  // Add the filters (multiple possible for each group)
  filters.forEach((group) => {
    group.options.forEach((opt) => {
      if (opt.checked) {
        // If user checks multiple options in the same group,
        // we append each as a separate param: ?roast=fresh_ground&roast=powder
        params.append(group.id, opt.value);
      }
    });
  });

  // Build the new URL. Keep the same path and hash, if any.
  const newUrl = `${window.location.pathname}?${params.toString()}${
    window.location.hash
  }`;

  // Push the new state to the browser's history.
  // This does not trigger a page reload, but it *does* fire the "popstate" event when using Back/Forward.
  window.history.pushState({}, "", newUrl);
}

/**
 * Returns how many filter options are checked in the specified group (by id).
 */
export function getCheckedCountInGroup(
  filters: FilterGroup[],
  groupId: string,
): number {
  // Find the relevant group by its id
  const targetGroup = filters.find((group) => group.id === groupId);
  if (!targetGroup) {
    return 0; // or throw an error, depending on your preference
  }

  // Count how many of its options are checked
  return targetGroup.options.filter((opt) => opt.checked).length;
}

export function useSortAndFilterQueryParams() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // React State for sort and filters
  const [sortOptions, setSortOptions] = useState<SortOption[]>(() => [
    ...initialSortOptions,
  ]);
  const [filters, setFilters] = useState<FilterGroup[]>(() => [
    ...initialFilters,
  ]);

  // Function to read the current URL and update our states:
  const syncStateFromUrl = useCallback(() => {
    const queryParams = new URLSearchParams(window.location.search);
    // update sortOptions
    setSortOptions((prev) => getUpdatedSortOptions(prev, queryParams));
    // update filters
    setFilters((prev) => getUpdatedFilters(prev, queryParams));
  }, []);

  // On mount: parse the current URL + set up popstate listener
  useEffect(() => {
    // 1) Initialize from URL
    syncStateFromUrl();

    // 2) Listen for back/forward
    function handlePopState() {
      syncStateFromUrl();
    }

    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [syncStateFromUrl]);

  /**
   * Handle user sorting changes.
   * We allow only one item in sortOptions to be `current: true` at a time.
   */
  function handleSortChange(newSortValue: string) {
    setSortOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        current: opt.value === newSortValue,
      })),
    );
  }

  /**
   * Handle toggling a filter.
   * e.g. user checks/unchecks "fresh_ground" in the "roast" filter group.
   */
  function handleToggleFilter(filterGroupId: string, optionValue: string) {
    setFilters((prev) =>
      prev.map((group) => {
        if (group.id !== filterGroupId) return group;
        return {
          ...group,
          options: group.options.map((opt) =>
            opt.value === optionValue ? { ...opt, checked: !opt.checked } : opt,
          ),
        };
      }),
    );
  }

  /**
   * Whenever `sortOptions` or `filters` change,
   * reflect the new state in the URL by calling setQueryParams.
   */
  useEffect(() => {
    setQueryParams(sortOptions, filters);
  }, [sortOptions, filters]);

  return {
    handleSortChange,
    handleToggleFilter,
    sortOptions,
    filters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
  };
}
