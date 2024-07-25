"use client";

import { Context } from "@/Context/Context";
import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import NoData from "./NoData";
import millify from "millify";

export default function Funds() {
  const { user, categories, dashboardTime, setOpenFundsModal } = useContext(Context);
  const [topSpentCategories, setTopSpentCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHistoricalRecord = (history) => {
    const record = history?.find(
      (c) => c.year === dashboardTime.year && c.month === dashboardTime.month
    );
    return record ? record.spent : 0;
  };

  useEffect(() => {
    if (categories) {
      const sortedCategories = categories
        .filter((category) => category.isExpense)
        .sort(
          (a, b) =>
            b.history.find(
              (e) =>
                e.year == dashboardTime.year && e.month == dashboardTime.month
            ).spent -
            a.history.find(
              (e) =>
                e.year == dashboardTime.year && e.month == dashboardTime.month
            ).spent
        )
        .slice(0, 3);

      setTopSpentCategories(sortedCategories);
      setLoading(false);
    }
  }, [categories]);

  const percentSpentOnCategory = (amount, limit) => {
    const progressValue = (amount / limit) * 100;
    if (progressValue >= 0 && progressValue < 50) {
      return "text-green-500";
    } else if (progressValue >= 50 && progressValue < 80) {
      return "text-orange-500";
    } else {
      return "text-red-500";
    }
  };

  const getUserSpentAndEarned = (year, month) => {
    const historyRecord = user?.history?.find(
      (u) => u.year === year && u.month === month
    );
    return {
      spent: historyRecord?.spent || 0,
      earned: historyRecord?.earned || 0,
    };
  };

  return (
    <>
      {loading ? (
        <Loading loadingFor="funds" />
      ) : (
        <div className="user-funds px-6 pb-6 mt-6 grid grid-cols-3 gap-8">
          <div className="current-funds text-center md:text-left">
            <h1 className="font-semibold text-sm md:text-md">Funds</h1>
            <p className="text-md text-blue-500">${user?.funds}</p>
          </div>

          <div className="total-earned text-center md:text-left">
            <h2 className="font-semibold text-sm md:text-md">Earned</h2>
            <p className="text-md text-green-500">
              $
              {
                getUserSpentAndEarned(dashboardTime.year, dashboardTime.month)
                  ?.earned
              }
            </p>
          </div>

          <div className="total-spent text-center md:text-left">
            <h2 className="font-semibold text-sm md:text-md">Spent</h2>
            <p className="text-md text-red-500">
              $
              {
                getUserSpentAndEarned(dashboardTime.year, dashboardTime.month)
                  ?.spent
              }
            </p>
          </div>
        </div>
      )}
      <button onClick={() => setOpenFundsModal(true)} className="btn btn-sm">Edit Funds</button>
      <hr className="my-3 border-base-300" />

      <div className="top-categories pt-3 text-lg">
        <h2 className="font-bold mb-4">Top Spent Categories</h2>
        {loading ? (
          <Loading loadingFor="funds" />
        ) : topSpentCategories?.length === 0 ? (
          <NoData forTopCategories={true} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 text-md gap-6">
            {topSpentCategories.map((category, index) => (
              <div key={index} className="category-item p-4 rounded-lg">
                <h3 className="font-semibold text-sm md:text-md">
                  {category.name}
                </h3>
                <p
                  className={`${percentSpentOnCategory(
                    getHistoricalRecord(category.history),
                    category.limit
                  )}`}
                >
                  {getHistoricalRecord(category.history)}/{category.limit}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
