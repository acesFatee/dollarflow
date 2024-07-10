import { getTransactions } from "@/api";
import SearchTransactions from "@/components/SearchTransactions";
import TransactionFilter from "@/components/TransactionFilter";
import TransactionPagination from "@/components/TransactionPagination";
import Transactions from "@/components/Transactions";
import React from "react";

export default async function Page() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const response = await getTransactions(1, "", null, currentYear, currentMonth);
  const transactions = response.transactions;
  const totalPages = response.totalPages

  return (
    <div className="transactions-container px-5">
      <section className="heading py-4">
        <h1 className="font-bold text-3xl">My Transactions</h1>
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="search-transactions pt-4 flex-1">
          <SearchTransactions  transactionsServer = {transactions}/>
        </section>
        <section className="filter-transactions pt-4 flex-1">
          <TransactionFilter />
        </section>
      </div>
      <section className="show-transactions mt-6">
        <Transactions totalPages = {totalPages} transactionsServer = {transactions}/>
      </section>
      <section className="mt-6 flex justify-center">
        <TransactionPagination totalPages = {totalPages}/>
      </section>
    </div>
  );
}
