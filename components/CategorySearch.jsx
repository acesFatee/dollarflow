"use client";

import { Context } from "@/Context/Context";
import { getCategories } from "@/api";
import { useDebounce } from "@/app/hooks/useDebounce";
import React, { useContext } from "react";

export default function CategorySearch() {
  const { categorySearch, setCategorySearch, setCategories } = useContext(Context);

  const invalidPattern = /[^a-zA-Z0-9\s]/; // Example pattern: only allows alphanumeric characters and spaces

  const fetchCategories = async (query) => {
    if (invalidPattern.test(query)) {
      return;
    }
    const response = await getCategories(1, query);
    setCategories(response.categories);
  };

  const debouncedFetchCategories = useDebounce(fetchCategories, 500);

  const handleSearch = (e) => {
    const query = e.target.value;
    setCategorySearch(query);
    debouncedFetchCategories(query);
  };

  return (
    <>
      <input
        placeholder="Search Categories"
        type="text"
        value={categorySearch}
        onChange={handleSearch}
        className="search-categories-input input input-bordered w-full"
      />
    </>
  );
}
