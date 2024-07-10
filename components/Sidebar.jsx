"use client";

import { Context } from "@/Context/Context";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect } from "react";

export default function Sidebar({ serverUser, categoriesData }) {
  const {
    setCategories,
    setCategoriesDropdown,
    categoriesDropdown,
  } = useContext(Context);

  const pathName = usePathname();

  useEffect(() => {
    setCategoriesDropdown(categoriesData);
    setCategories(categoriesData);
  }, [serverUser, categoriesData]);

  return (
    <>
      <div className={`flex h-screen flex-col justify-between border-base-300 border-e-2 bg-base-100 z-50`}>
        <div className="px-4 py-6">
          <section className="logo pl-3 flex items-center space-x-3">
            <img width={25} src="/logo.png" alt="DollarFlow Logo" />
            <Link href={"/"} className="text-lg font-semibold">
              DollarFlow
            </Link>
          </section>

          <ul className="mt-6 space-y-1">
            <li>
              <Link
                href="/"
                className={`block rounded-lg px-4 py-2 text-sm font-medium hover:bg-base-300 ${pathName === '/' && "bg-base-300"}`}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <details
                className="group [&_summary::-webkit-details-marker]:visible"
                open
              >
                <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 hover:bg-base-300">
                  <span className="text-sm font-medium"> Categories </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  {categoriesDropdown?.map((c) => (
                    <li key={c._id}>
                      <Link
                        href={`/categories/${c._id}`}
                        className={`block rounded-lg px-4 py-2 text-sm font-medium  hover:bg-base-300 ${pathName.split('/').pop() === c._id && "bg-base-300"}`}
                      >
                        <span className="name">{c.name}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/categories"
                      className={`block rounded-lg px-4 py-2 text-sm font-medium hover:bg-base-300 ${pathName.split('/').pop() === 'categories' && "bg-base-300"}`}
                    >
                      <span className="font-bold">View all</span>
                    </Link>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <Link
                href="/transactions"
                className={`block rounded-lg px-4 py-2 text-sm font-medium hover:bg-base-300 ${pathName.split('/').pop() === "transactions" && 'bg-base-300'}`}
              >
                Transactions
              </Link>
            </li>
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-base-300">
          <a href="#" className="flex items-center gap-2 p-4">
            <UserButton />

            <div>
              <p className="text-xs">
                <strong className="block font-medium">{serverUser?.firstName}</strong>
                <span>{serverUser?.email}</span>
              </p>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
