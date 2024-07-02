"use client";

import { Context } from "@/Context/Context";
import React, { useContext, useEffect, useState } from "react";

export default function Funds() {
  const { user, categories } = useContext(Context);
  const [topSpentCategories, setTopSpentCategories] = useState([])

  useEffect(() => {
    const sortedCategories = categories
    .filter((category) => category.isExpense)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

    setTopSpentCategories(sortedCategories)
  }, [categories])
  
  const percentSpentOnCategory = (amount, limit) => {
    const progressValue = amount / limit * 100
    if (progressValue >= 0 && progressValue < 50) {
      return "text-green-500";
    } else if (progressValue >= 50 && progressValue < 80) {
      return "text-orange-500";
    } else {
      return "text-red-500";
    }
  }
  

  return (
    <>
      <div className="user-funds p-6 mt-6 grid grid-cols-3 gap-8">
        <div className="current-funds text-center md:text-left">
          <h1 className="font-semibold text-sm md:text-md">Funds</h1>
          <p className="text-lg  text-green-500">${user?.funds}</p>
        </div>

        <div className="total-earned text-center md:text-left">
          <h2 className="font-semibold text-sm md:text-md">Earned</h2>
          <p className="text-lg text-blue-500">${user?.earned}</p>
        </div>

        <div className="total-spent text-center md:text-left">
          <h2 className="font-semibold text-sm md:text-md">Spent</h2>
          <p className="text-lg text-red-500">${user?.spent}</p>
        </div>
      </div>
      <hr className="my-3 border-base-300" />

      <div className="top-categories pt-3 text-lg">
        <h2 className="font-bold mb-4">Top Spent Categories</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {topSpentCategories.map((category, index) => (
            <div key={index} className="category-item p-4 rounded-lg">
              <h3 className="font-semibold text-sm md:text-md">{category.name}</h3>
              <p className={`text-lg ${percentSpentOnCategory(category.spent, category.limit)}`}>
                {category.spent}/{category.limit}
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
}
