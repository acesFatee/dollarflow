"use client";

import { Context } from "@/Context/Context";
import { getTransactions } from "@/api";
import React, { useContext } from "react";

export default function SearchTransactions({ category }) {
  const {
    transactionSearch,
    setTransactionSearch,
    setTransactions,
    setTransactionPage,
    settransactionTotalPages,
    selectedYear,
    selectedMonth,
  } = useContext(Context);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setTransactionSearch(query);
    if (query.length < 1) {
      const response = await getTransactions(
        1,
        "",
        category ? category : null,
        selectedYear,
        selectedMonth
      );
      settransactionTotalPages(response.totalPages);
      setTransactions(response.transactions);
      setTransactionPage(1);
      return;
    }
    const response = await getTransactions(
      1,
      query,
      category ? category : null,
      selectedYear,
      selectedMonth
    );
    settransactionTotalPages(response.totalPages);
    setTransactions(response.transactions);
    setTransactionPage(1);
  };

  return (
    <>
      <input
        placeholder="Search Transactions"
        type="text"
        value={transactionSearch}
        onChange={(e) => handleSearch(e)}
        className="search-transactions-input input input-bordered w-full"
      />
    </>
  );
}
