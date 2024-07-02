"use client";

import { Context } from "@/Context/Context";
import React, { useContext, useEffect } from "react";
import Category from "./Category";

export default function Categories({ categoriesData }) {
  const { categories, setCategories } = useContext(Context);

  useEffect(() => {
    setCategories(categoriesData);
  }, [categoriesData]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories?.map((category, index) => (
        <Category index={index} category={category} />
      ))}
    </div>
  );
}
