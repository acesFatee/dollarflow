"use client";

import { Context } from "@/Context/Context";
import { getTransactions } from "@/api";
import React, { useContext, useEffect, useState } from "react";

export default function TransactionFilter({ category }) {
  const {
    transactionFilter,
    setTransactionFilter,
    setTransactions,
    transactionSearch,
    settransactionTotalPages,
    setTransactionPage,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
  } = useContext(Context);

  const [incomeChecked, setIncomeChecked] = useState(false);
  const [expenseChecked, setExpenseChecked] = useState(false);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const startYear = 2000;
  const years = [];
  const months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

  useEffect(() => {
    const handleCheckboxChange = () => {
      if (!incomeChecked && !expenseChecked) {
        setTransactionFilter(null);
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
      const filteredTransactions = await getTransactions(
        1,
        transactionSearch,
        transactionFilter,
        category ? category : null,
        selectedYear,
        selectedMonth
      );

      console.log({
        aage: 1,
        transactionSearch,
        transactionFilter,
        category: category ? category : null,
        selectedYear,
        selectedMonth
      })
      setTransactionPage(1);
      settransactionTotalPages(filteredTransactions?.totalPages);
      setTransactions(filteredTransactions?.transactions);
    };

    fetchFilteredTransactions();
  }, [transactionFilter, selectedYear, selectedMonth]);

  const removeFilters = async () => {
    setTransactionFilter(null);
    const filteredTransactions = await getTransactions(
      1,
      transactionSearch,
      null,
      category ? category : null,
      selectedYear,
      selectedMonth
    );
    setTransactionPage(1);
    settransactionTotalPages(filteredTransactions?.totalPages);
    setTransactions(filteredTransactions?.transactions);
  };

  return (
    <div className="flex flex-wrap space-x-6 items-center">
      <div className="show-expense flex items-center">
        <label htmlFor="show-expenses" className="text-sm mr-2">
          Expense
        </label>
        <input
          id="show-expenses"
          onChange={() => {
            setExpenseChecked(true);
            setIncomeChecked(false);
          }}
          type="checkbox"
          checked={!incomeChecked && expenseChecked}
          className="checkbox checkbox-sm"
        />
      </div>
      <div className="show-income flex items-center">
        <label htmlFor="show-income" className="text-sm mr-2">
          Income
        </label>
        <input
          id="show-income"
          type="checkbox"
          onChange={() => {
            setIncomeChecked(true);
            setExpenseChecked(false);
          }}
          checked={!expenseChecked && incomeChecked}
          className="checkbox checkbox-sm"
        />
      </div>

      <div className="flex items-center">
        <select
          id="year-select"
          className="select select-bordered select-sm"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(parseInt(e.target.value));
            setTransactionFilter(() => transactionFilter ? transactionFilter : "null")
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <select
          id="month-select"
          className="select select-bordered select-sm"
          value={selectedMonth}
          onChange={(e) => {
            setTransactionFilter(() => transactionFilter ? transactionFilter : "null")
            setSelectedMonth(parseInt(e.target.value));
          }}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {(incomeChecked || expenseChecked) && (
        <span
          onClick={() => {
            setIncomeChecked(false);
            setExpenseChecked(false);
            removeFilters();
          }}
          className="clear link text-purple-500 link-hover"
        >
          Clear
        </span>
      )}
    </div>
  );
}
