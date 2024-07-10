"use client";

import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Context } from "@/Context/Context";

export default function SpendHistory() {
  const { categories, dashboardTime } = useContext(Context);

  const getHistoricalRecord = (history) => {
    const record = history?.find(
      (c) => c.year === dashboardTime.year && c.month === dashboardTime.month
    );
    return record ? record.spent : 0;
  };
  

  const expenseCategories = categories?.filter((e) => e.isExpense) || [];
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

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-center h-[21rem] mt-6">
        {expenseCategories.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <p>No expense data available.</p>
        )}
      </div>
    </div>
  );
}
