"use client";

import { Context } from "@/Context/Context";
import Image from "next/image";
import React, { useContext, useEffect } from "react";

export default function QuickAccess({ serverUser }) {
  const { setOpen, setTheme, theme, setUser } = useContext(Context);

  useEffect(() => {
    setUser(serverUser);
  }, [serverUser]);

  return (
    <>
      <div className="quick-buttons grid grid-cols-4 gap-4">
        <button
        data-tip = {"Create Expense"}
          onClick={() => setOpen("create-expense")}
          className="btn tooltip tooltip-bottom flex items-center justify-center bg-base-200 rounded-md shadow-sm px-4 py-2 space-x-2"
        >
          <Image
            width={20}
            height={20}
            src="/expense.png"
            alt="Create Expense"
          />
          <span className="hidden lg:block">Create Expense</span>
        </button>
        <button
        data-tip = {"Create Income"}
          onClick={() => setOpen("add-income")}
          className="btn flex tooltip tooltip-bottom items-center justify-center bg-base-200 rounded-md shadow-sm px-4 py-2 space-x-2"
        >
          <Image height={20} width={20} src="/income.png" alt="Add Income" />
          <span className="hidden lg:block">Add Income</span>
        </button>

        <button
        data-tip = {"Create Category"}
          onClick={() => setOpen("create-category")}
          className="btn flex tooltip tooltip-bottom items-center justify-center bg-base-200 rounded-md shadow-sm px-4 py-2 space-x-2"
        >
          <Image
            height={20}
            width={20}
            src="/category.png"
            alt="Create Category"
          />
          <span className="hidden lg:block">Create Category</span>
        </button>

        {theme === "dark" && (
          <button
          data-tip = {"Switch Themes"}
            onClick={() => setTheme("light")}
            className="btn tooltip tooltip-bottom flex items-center justify-center bg-base-200 rounded-md shadow-sm px-4 py-2 space-x-2"
          >
            <Image height={20} width={20} src="/sun.png" alt="Light Mode" />
            <span className="hidden lg:block">Light Mode</span>
          </button>
        )}

        {theme === "light" && (
          <button
          data-tip = {"Swtich Themes"}
            onClick={() => setTheme("dark")}
            className="btn tooltip tooltip-bottom flex items-center justify-center bg-base-200 rounded-md shadow-sm px-4 py-2 space-x-2"
          >
            <Image height={20} width={20} src="/moon.png" alt="Dark Mode" />
            <span className="hidden lg:block">Dark Mode</span>
          </button>
        )}
      </div>
    </>
  );
}
