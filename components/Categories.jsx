"use client";

import { Context } from "@/Context/Context";
import React, { useContext, useEffect, useState } from "react";
import Category from "./Category";
import NoData from "./NoData";
import Loading from "./Loading";

export default function Categories({ categoriesData }) {
  const { categories, setCategories } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
      setLoading(false);
    }
  }, [categoriesData]);

  if (loading) {
    return <Loading loadingFor={"categories"} />;
  }

  return (
    <>
      {categories?.length === 0 ? (
        <NoData forCategory={true} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category, index) => (
            <Category key={index} category={category} />
          ))}
        </div>
      )}
    </>
  );
}
