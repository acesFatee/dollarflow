import { Context } from "@/Context/Context";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

export default function Category({ category }) {
  const { transactions, categories, setOpenEdit, selectedYear, selectedMonth } = useContext(Context);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const historicalRecord = category.history.find(c => c.year == selectedYear && c.month == selectedMonth)?.spent || 0
    const percent = (historicalRecord / category.limit) * 100;
    setProgressValue(percent);
  }, [transactions, categories, selectedYear, selectedMonth]);

  const changeProgressColor = () => {
    if (progressValue >= 0 && progressValue < 50) {
      return "progress-success";
    } else if (progressValue >= 50 && progressValue < 80) {
      return "progress-warning";
    } else {
      return "progress-error";
    }
  };

  const showAmountSpent = () => {
    const historicalSpentAmount = category.history.find(c => c.year == selectedYear && c.month == selectedMonth)?.spent || 0
    return `Spent: ${historicalSpentAmount}/${category.limit}`;
  };

  const showAmountEarned = () => {
    const historicalEarnedAmount = category.history.find(c => c.year == selectedYear && c.month == selectedMonth)?.earned || 0
    return `${historicalEarnedAmount}`;
  };

  return (
    <>
      <div
        className="card max-w-sm rounded-lg shadow-lg overflow-hidden"
      >
        <div className="card-body p-4">
          <div className="card-heading flex justify-between">
            <h2 className="card-title text-xl font-semibold mb-2">
              {category.name}
            </h2>
            <div className="icons flex space-x-3">
              <svg
                onClick={() =>
                  setOpenEdit({
                    edit: "category",
                    element: {
                      _id: category._id,
                      name: category.name,
                      limit: category.limit,
                      isExpense: category.isExpense,
                    },
                  })
                }
                className="w-6 h-6 hover:text-purple-500"
                aria-hidden="true"
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
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                />
              </svg>
              <Link href={"/categories/" + category._id}>
                <svg
                  className="w-6 h-6 hover:text-purple-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {category.limit && (
            <progress
              className={`progress ${changeProgressColor()}`}
              value={progressValue}
              max="100"
            ></progress>
          )}
          {category.limit && (
            <span className="text-xs">{showAmountSpent()}</span>
          )}

          {!category?.isExpense && (
            <span className="text-green-500">+{showAmountEarned()}</span>
          )}
        </div>
      </div>
    </>
  );
}
