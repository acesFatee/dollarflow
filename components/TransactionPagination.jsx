"use client";

import { Context } from "@/Context/Context";
import { getTransactions } from "@/api";
import React, { useContext } from "react";

export default function TransactionPagination({category}) {
  const {
    transactionPage,
    setTransactionPage,
    transactionSearch,
    transactionFilter,
    setTransactions,
    transactionTotalPages,
  } = useContext(Context);

  const fetchTransactions = async () => {
    const nextPage = transactionPage + 1;
    if (nextPage > transactionTotalPages) {
      return;
    }
    setTransactionPage((prev) => prev + 1);
    const response = await getTransactions(
      nextPage,
      transactionSearch,
      transactionFilter,
      category ? category : null
    );
    setTransactions(response.transactions);
  };

  const goBack = async () => {
    const nextPage = transactionPage - 1;
    setTransactionPage((prev) => prev - 1);
    const response = await getTransactions(
      nextPage,
      transactionSearch,
      transactionFilter,
      category ? category : null
    );
    setTransactions(response.transactions);
  };

  return (
    <>
      <div className="join">
        <button
          disabled={transactionPage === 1}
          onClick={goBack}
          className="join-item btn"
        >
          «
        </button>
        <button className="join-item btn">{transactionPage}</button>
        <button
          disabled={transactionPage >= transactionTotalPages}
          onClick={fetchTransactions}
          className="join-item btn"
        >
          »
        </button>
      </div>
    </>
  );
}
