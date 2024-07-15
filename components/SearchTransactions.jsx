"use client";

import { Context } from "@/Context/Context";
import { getTransactions } from "@/api";
import { useDebounce } from "@/app/hooks/useDebounce";
import React, { useContext, useState, useCallback } from "react";

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

  const [loading, setLoading] = useState(false);

  const debouncedFetchTransactions = useDebounce(async (query) => {
    const invalidPattern = /[^a-zA-Z0-9\s]/;
    if (invalidPattern.test(query)) {
      setTransactions([]);
      settransactionTotalPages(0);
      return;
    }

    setLoading(true);
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
    setLoading(false);
  }, 500);

  const handleSearch = (e) => {
    const query = e.target.value;
    setTransactionSearch(query);
    debouncedFetchTransactions(query);
  };

  return (
    <>
    
      <input
        placeholder="Search Transactions"
        type="text"
        value={transactionSearch}
        onChange={handleSearch}
        className="search-transactions-input input input-bordered w-full"
      />
    </>
  );
}
