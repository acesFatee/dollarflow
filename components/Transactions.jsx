'use client'

import { Context } from "@/Context/Context";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import NoData from "./NoData";
import Loading from "./Loading";

export default function Transactions({ transactionsServer, totalPages, category }) {
  const { transactions, setTransactions, settransactionTotalPages, setOpenEdit, setOpenDelete } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transactionsServer && totalPages !== undefined) {
      setTransactions(transactionsServer);
      settransactionTotalPages(totalPages);
      setLoading(false);
    }
  }, [transactionsServer, totalPages]);

  if (loading) {
    return <Loading loadingFor = 'transactions' />;
  }

  return (
    <>
    {
      transactions?.length === 0 ? <NoData forTransaction={true} /> :
    
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              {!category && <th>Category</th>}
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              transactions?.map((t) => {
                const date = new Date(t?.createdAt);
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const formattedTime = date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={t?._id} className="hover">
                    <td>{t?.name}</td>
                    <td className={t?.isIncome ? "text-green-500" : "text-red-500"}>
                      {`${t?.isIncome ? "+" : "-"} $${t?.amount}`}
                    </td>
                    {!category && (
                      <td>
                        <Link className="link-hover" href={'/categories/'+t?.category?._id}>
                          {t?.category?.name}
                        </Link>
                      </td>
                    )}
                    <td>{formattedDate}</td>
                    <td>{formattedTime}</td>
                    <td>
                      <div className="icons flex space-x-3">
                        <svg
                          onClick={() =>
                            setOpenEdit({
                              edit: t.isIncome ? "income" : "expense",
                              element: {
                                _id: t._id,
                                name: t.name,
                                description: t.description,
                                amount: t.amount,
                                category: {
                                  _id: t.category._id,
                                  name: t.category.name,
                                },
                              },
                            })
                          }
                          className="w-5 h-5 hover:cursor-pointer hover:text-purple-500"
                          aria-hidden="true"
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

                        <svg
                          onClick={() =>
                            setOpenDelete({
                              name: t.name,
                              isExpense: t.isExpense,
                              _id: t._id,
                              amount: t.amount,
                              category: t.category._id,
                            })
                          }
                          className="w-5 h-5 hover:cursor-pointer hover:text-purple-500"
                          aria-hidden="true"
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
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
}
    </>
  );
}
