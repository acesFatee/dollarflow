import { getCategories } from "@/api";
import Categories from "@/components/Categories";
import CategorySearch from "@/components/CategorySearch";
import TransactionFilter from "@/components/TransactionFilter";
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="search-transactions pt-4 flex-1">
          <CategorySearch />
        </section>
        <section className="filter-transactions pt-4 flex-1">
          <TransactionFilter forCategory={true}/>
        </section>
      </div>
       
      <section className="show-transactions mt-6">
        <Categories totalPages = {totalPages} categoriesData = {categories}/>
      </section>
    </div>
  )
}
