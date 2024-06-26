"use client";

import React, { useEffect, useState } from "react";
import { Context } from "./Context";

const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(null);
  const [openEdit, setOpenEdit] = useState(null)
  const [openDelete, setOpenDelete] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transactions, setTransactions] = useState([])
  const [transactionFilter, setTransactionFilter] = useState(null)
  const [transactionSearch, setTransactionSearch] = useState('')
  const [transactionPage, setTransactionPage] = useState(1)
  const [transactionTotalPages, settransactionTotalPages] = useState(1)
  const [categoriesDropdown, setCategoriesDropdown] = useState([])
  const [categories, setCategories] = useState([])
  const [categorySearch, setCategorySearch] = useState("")
  const [theme, setTheme] = useState("dark")
  
  useEffect(() => {
    if(theme === "dark"){
      document.querySelector('html').setAttribute('data-theme', "dark")
    }else{
      document.querySelector('html').setAttribute('data-theme', "light")
    }
  }, [theme, setTheme])
  

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        open,
        setOpen,
        recentTransactions,
        setRecentTransactions,
        categoriesDropdown, setCategoriesDropdown,
        transactions, setTransactions,
        transactionFilter, setTransactionFilter,
        transactionSearch, setTransactionSearch,
        transactionPage, setTransactionPage,
        transactionTotalPages, settransactionTotalPages,
        categories, setCategories,
        categorySearch, setCategorySearch,
        openEdit, setOpenEdit,
        openDelete, setOpenDelete,
        theme, setTheme
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
