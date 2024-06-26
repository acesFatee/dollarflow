"use client";

import { Context } from "@/Context/Context";
import { getCategories } from "@/api";
import React, { useContext } from "react";

export default function CategorySearch() {
  const { categorySearch, setCategorySearch, setCategories } =
    useContext(Context);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setCategorySearch(query);
    if (query.length < 1) {
      const response = await getCategories(1, query);
      setCategories(response.categories);
      return;
    }
    const response = await getCategories(1, query);
    setCategories(response.categories);
  };
  return (
    <>
      <input
        placeholder="Search Categories"
        type="text"
        value={categorySearch}
        onChange={(e) => handleSearch(e)}
        className="search-categories-input input input-bordered w-full lg:w-2/4"
      />
    </>
  );
}
