"use client";

import { Context } from "@/Context/Context";
import { useContext } from "react";

export default function History() {
  const {dashboardTime, setDashboardTime} = useContext(Context)
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

  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

  return (
    <div className="flex pt-3 justify-start md:justify-end flex-wrap space-x-6 items-center">
      <div className="flex items-center">
        <select
          id="year-select"
          className="select select-bordered select-sm"
          value={dashboardTime.year}
          onChange={(e) => {
            setDashboardTime(prev => (
              {
                ...prev,
                year: parseInt(e.target.value)
              }
            ))
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
          value={dashboardTime.month}
          onChange={(e) => {
            setDashboardTime(prev => (
              {
                ...prev,
                month: parseInt(e.target.value)
              }
            ))
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
