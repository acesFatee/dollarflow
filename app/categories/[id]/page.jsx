import { getTransactions } from "@/api";
import SearchTransactions from "@/components/SearchTransactions";
import TransactionPagination from "@/components/TransactionPagination";
import Transactions from "@/components/Transactions";
import React from "react";

export default async function page({params}) {
  
  const response = await getTransactions(1, "", null, params.id);
  let heading = response.categoryName
  const transactions = response.transactions;
  const totalPages = response.totalPages

  return (
    <div className="transactions-container px-5">
      <section className="heading py-4">
        <h1 className="font-bold text-3xl">My Transactions - {heading}</h1>
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="search-transactions pt-4 flex-1">
          <SearchTransactions  transactionsServer = {transactions} category = {params.id}/>
        </section>
      </div>
      <section className="show-transactions mt-6">
        <Transactions totalPages = {totalPages} transactionsServer = {transactions} category = {params.id}/>
      </section>
      <section className="mt-6 flex justify-center">
        <TransactionPagination totalPages = {totalPages} category = {params.id}/>
      </section>
    </div>
  )
}
