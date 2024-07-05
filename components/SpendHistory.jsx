"use client";

import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Context } from "@/Context/Context";

export default function SpendHistory() {
  const { categories } = useContext(Context);
  const data = {
    labels: categories?.filter(e => e.isExpense)?.map(c => c.name),
    datasets: [
      {
        label: "Spent",
        data: categories?.filter(e => e.isExpense)?.map(c => c.history[c.history.length - 1].spent),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-center h-[21rem] mt-6">
        {categories?.filter(c => c.isExpense)?.length > 0 && <Bar data={data} options={options} />}
      </div>
    </div>
  );
}
