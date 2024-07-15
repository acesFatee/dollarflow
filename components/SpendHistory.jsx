"use client";

import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Context } from "@/Context/Context";
import Loading from "./Loading";
import NoData from "./NoData";

export default function SpendHistory() {
  const { categories, dashboardTime } = useContext(Context);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHistoricalRecord = (history) => {
    const record = history?.find(
      (c) => c.year === dashboardTime.year && c.month === dashboardTime.month
    );
    return record ? record.spent : 0;
  };

  useEffect(() => {
    if (categories) {
      const filteredCategories = categories.filter((e) => e.isExpense);
      setExpenseCategories(filteredCategories);
      setLoading(false);
    }
  }, [categories]);

  const data = {
    labels: expenseCategories.map((c) => c.name),
    datasets: [
      {
        label: "Spent",
        data: expenseCategories.map((c) => getHistoricalRecord(c.history)),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) {
    return <Loading loadingFor={'graph'} />;
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-center h-[21rem] mt-6">
        {expenseCategories.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <NoData forSpendHistory={true} />
        )}
      </div>
    </div>
  );
}
