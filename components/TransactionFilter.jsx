"use client";

import { Context } from "@/Context/Context";
import { getTransactions } from "@/api";
import React, { useContext, useEffect } from "react";

export default function TransactionFilter({ category, forCategory }) {
  const {
    setTransactions,
    transactionSearch,
    settransactionTotalPages,
    setTransactionPage,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
  } = useContext(Context);

  const currentYear = new Date().getFullYear();
  const startYear = 2023;
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

  useEffect(() => {
    setSelectedYear(new Date().getFullYear())
    setSelectedMonth(new Date().getMonth() + 1)
  }, [])
  

  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

  const showPreviousCategories = (year, month) => {
    
  }

  const fetchFilteredTransactions = async (year, month) => {
    const filteredTransactions = await getTransactions(
      1,
      transactionSearch,
      category ? category : null,
      year,
      month
    );

    setTransactionPage(1);
    settransactionTotalPages(filteredTransactions?.totalPages);
    setTransactions(filteredTransactions?.transactions);
  };

  return (
    <div className="flex flex-wrap space-x-6 items-center">
      <div className="flex items-center">
        <select
          id="year-select"
          className="select select-bordered"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            if(forCategory){
              showPreviousCategories(e.target.value, selectedMonth)
            }else{
              fetchFilteredTransactions(e.target.value, selectedMonth);
            }
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
          className="select select-bordered"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            if(forCategory){
              showPreviousCategories(selectedYear, e.target.value)
            }else{
              fetchFilteredTransactions(selectedYear, e.target.value);
            }
          }}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
