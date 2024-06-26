"use client";

import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { Context } from "@/Context/Context";

export default function RecentBudgets() {
  const { user } = useContext(Context);
  const userFunds = user?.funds;
  const totalIncome = user?.earned;
  const totalExpenses = user?.spent;

  const data = {
    labels: ["Total Income", "Total Expenses", "Account Balance"],
    datasets: [
      {
        label: "Financial Overview",
        data: [totalIncome, totalExpenses, userFunds],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const options = {
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="w-full grid place-items-center mt-10 px-3">
      <div className="overflow-y-hidden overflow-x-hidden ">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
