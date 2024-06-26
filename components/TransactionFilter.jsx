"use client";

import { Context } from "@/Context/Context";
import { getTransactions } from "@/api";
import React, { useContext, useEffect, useState } from "react";

export default function TransactionFilter({category}) {
  const { transactionFilter, setTransactionFilter, setTransactions, transactionSearch, settransactionTotalPages, setTransactionPage } =
    useContext(Context);
  const [incomeChecked, setIncomeChecked] = useState(false);
  const [expenseChecked, setExpenseChecked] = useState(false);

  useEffect(() => {
    const handleCheckboxChange = () => {
      if (!incomeChecked && !expenseChecked) {
      }
      if (incomeChecked) {
        setTransactionFilter("income");
      } else if (expenseChecked) {
        setTransactionFilter("expense");
      }
    };

    handleCheckboxChange();
  }, [incomeChecked, expenseChecked]);

  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      if (transactionFilter === null) {
        return;
      }
      const filterdTransactions = await getTransactions(
        1,
        transactionSearch,
        transactionFilter,
        category ? category : null
      );
      setTransactionPage(1)
      settransactionTotalPages(filterdTransactions?.totalPages)
      setTransactions(filterdTransactions?.transactions);
    };

    fetchFilteredTransactions();
  }, [transactionFilter]);

  const removeFilters = async () => {
    setTransactionFilter(null)
    const filterdTransactions = await getTransactions(
      1,
      transactionSearch,
      null,
      category ? category : null
    );
    setTransactionPage(1)
    settransactionTotalPages(filterdTransactions?.totalPages)
    setTransactions(filterdTransactions?.transactions);
  }

  return (
    <div className="flex space-x-6">
      <div className="show-expense flex items-center">
        <label htmlFor="show-expenses" className="text-sm mr-2">
          Show Expenses
        </label>
        <input
          id="show-expenses"
          onChange={() => {
            setExpenseChecked(true);
            setIncomeChecked(false);
          }}
          type="checkbox"
          checked={!incomeChecked && expenseChecked}
          className="checkbox"
        />
      </div>
      <div className="show-income flex items-center">
        <label htmlFor="show-income" className="text-sm mr-2">
          Show Income
        </label>
        <input
          id="show-income"
          type="checkbox"
          onChange={() => {
            setIncomeChecked(true);
            setExpenseChecked(false);
          }}
          checked={!expenseChecked && incomeChecked}
          className="checkbox"
        />
      </div>
      {(incomeChecked || expenseChecked) && (
        <span
          onClick={() => {
            setIncomeChecked(false);
            setExpenseChecked(false);
            removeFilters()
          }}
          className="clear link link-hover"
        >
          <svg
            className="w-6 h-6 hover:text-purple-500"
            ariaHidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
            />
          </svg>
        </span>
      )}
    </div>
  );
}
