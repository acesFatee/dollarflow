import { getCategories } from "@/api";
import Categories from "@/components/Categories";
import CategorySearch from "@/components/CategorySearch";
import TransactionPagination from "@/components/TransactionPagination";
import React from "react";

export default async function page() {
  
  const response = await getCategories(1, null);
  const categories = response.categories;
  const totalPages = response.totalPages

  return (
    <div className="transactions-container px-5">
      <section className="heading py-4">
        <h1 className="font-bold text-3xl">My Categories</h1>
      </section>
        <section className="search-transactions pt-4 flex-1">
          <CategorySearch />
        </section>
      <section className="show-transactions mt-6">
        <Categories totalPages = {totalPages} categoriesData = {categories}/>
      </section>
    </div>
  )
}
