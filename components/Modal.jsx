"use client";

import { Context } from "@/Context/Context";
import { addIncome, createCategory, createExpense } from "@/api";
import React, { useContext, useState } from "react";

export default function Modal() {
  const {
    open,
    setOpen,
    setUser,
    transactions,
    setRecentTransactions,
    recentTransactions,
    setCategoriesDropdown,
    setCategories,
    categories,
    setTransactions,
  } = useContext(Context);
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    description: "",
    category: "",
  });

  const [income, setIncome] = useState({
    name: "",
    amount: "",
    description: "",
    category: "",
  });

  const [category, setCategory] = useState({
    name: "",
    isExpense: false,
    limit: "",
  });

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleIncomeChange = (e) => {
    const { name, value } = e.target;
    setIncome((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(categories?.length == 0){
      alert("Seems like you don't have any categories. Try adding some.")
      return;
    }
    if(!categoryInput){
      alert("Please choose a category")
      return;
    }
    const response = await createExpense({
      name: expense.name,
      amount: expense.amount,
      description: expense.amount,
      category: categoryInput,
    });
    if (response.error) {
      setLoading(false);
      alert(response.error);
    } else {
      const newExpense = response.newExpense;
      setCategories((prev) =>
        prev.map((c) =>
          c._id === response.updatedCategory._id
            ? {
                ...c,
                history: c.history.map((entry, index) =>
                  index === c.history.length - 1
                    ? { ...entry, spent: entry.spent + newExpense.amount }
                    : entry
                ),
              }
            : c
        )
      );

      setExpense({
        name: "",
        amount: "",
        description: "",
        category: "",
      });
      setUser((prev) => ({
        ...prev,
        funds: response.updatedUser.funds,
        history: response.updatedUser.history,
      }));

      setRecentTransactions((prev) => {
        if (recentTransactions?.length === 5) {
          const newArray = [newExpense, ...prev.slice(0, 4)];
          return newArray;
        } else {
          return [newExpense, ...prev];
        }
      });

      setTransactions((prev) => {
        if (transactions?.length === 5) {
          const newArray = [newExpense, ...prev.slice(0, 4)];
          return newArray;
        } else {
          return [newExpense, ...prev];
        }
      });

      setCategoryInput("");
      setLoading(false);
      setOpen(null);
    }
  };

  const handleSubmitIncome = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(categories?.length == 0){
      alert("Seems like you don't have any categories. Try adding some.")
      return;
    }
    if(!categoryInput){
      alert("Please choose a category")
      return;
    }
    const response = await addIncome({
      name: income.name,
      amount: income.amount,
      description: income.description,
      category: categoryInput,
    });
    if (response.error) {
      setLoading(false);
      alert(response.error);
    } else {
      const newIncome = response.newIncome;
      setIncome({
        name: "",
        amount: "",
        description: "",
        category: "",
      });

      setCategories((prev) =>
        prev.map((c) =>
          c._id == response.updatedCategory._id
            ? {
                ...c,
                c: c.history[c.history.length - 1].earned + newIncome.amount,
              }
            : c
        )
      );

      setUser((prev) => ({
        ...prev,
        funds: response.updatedUser.funds,
        history: response.updatedUser.history,
      }));

      setRecentTransactions((prev) => {
        if (recentTransactions?.length === 5) {
          const newArray = [newIncome, ...prev.slice(0, 4)];
          return newArray;
        } else {
          return [newIncome, ...prev];
        }
      });

      setTransactions((prev) => {
        if (transactions?.length === 5) {
          const newArray = [newIncome, ...prev.slice(0, 4)];
          return newArray;
        } else {
          return [newIncome, ...prev];
        }
      });
      setCategoryInput("");
      setLoading(false);
      setOpen(null);
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newCategory = await createCategory(category);
    if (newCategory.error) {
      alert(newCategory.error);
      setLoading(false);
    } else {
      setCategory({
        name: "",
      });
      setCategories((prev) => [newCategory.newCategory, ...prev]);
      setCategoriesDropdown((prev) => [newCategory.newCategory, ...prev]);
      setLoading(false);
      setOpen(null);
    }
  };

  const renderCreateExpenseForm = () => {
    return (
      <>
        <h1 className="font-bold text-xl px-4">Create an expense</h1>
        <form
          onSubmit={handleSubmitExpense}
          className="max-w-lg mx-auto p-4 space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium ">
              Expense Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={expense.name}
              onChange={handleExpenseChange}
              className="input input-bordered w-full mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium ">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              min={1}
              value={expense.amount}
              onChange={handleExpenseChange}
              className="input input-bordered w-full mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium ">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={expense.description}
              onChange={handleExpenseChange}
              className="textarea textarea-bordered w-full mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              className="select select-bordered w-full mt-2"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
              }}
            >
              <option value="">Select a category</option>
              {categories
                ?.filter((c) => c.isExpense)
                ?.map((e) => (
                  <option
                    onClick={() =>
                      setExpense((prev) => ({
                        ...prev,
                        category: e._id,
                      }))
                    }
                    key={e._id}
                    value={e._id}
                  >
                    {e.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="btn bg-purple-300 text-black hover:bg-purple-400 w-full"
            >
              {loading ? "Creating Expense..." : "Create Expense"}
            </button>
          </div>
        </form>
      </>
    );
  };

  const renderAddIncomeForm = () => {
    return (
      <>
        <h1 className="font-bold text-xl px-4">Add Income</h1>
        <form
          onSubmit={handleSubmitIncome}
          className="max-w-lg mx-auto p-4 space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium ">
              Income Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              min={1}
              step={0.01}
              value={income.name}
              onChange={handleIncomeChange}
              className="input input-bordered w-full mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium ">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              min={1}
              step={0.01}
              value={income.amount}
              onChange={handleIncomeChange}
              className="input input-bordered w-full mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium ">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={income.description}
              onChange={handleIncomeChange}
              className="textarea textarea-bordered w-full mt-1 "
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              className="select select-bordered w-full mt-2"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
              }}
            >
              <option value="">Select a category</option>
              {categories
                ?.filter((c) => !c.isExpense)
                ?.map((e) => (
                  <option
                    onClick={() =>
                      setIncome((prev) => ({
                        ...prev,
                        category: e._id,
                      }))
                    }
                    key={e._id}
                    value={e._id}
                  >
                    {e.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="btn bg-purple-300 text-black hover:bg-purple-400 w-full"
            >
              {loading ? "Adding Income" : "Add Income"}
            </button>
          </div>
        </form>
      </>
    );
  };

  const renderAddCategoryForm = () => {
    return (
      <>
        <h1 className="font-bold text-xl px-4">Create Category</h1>
        <form
          onSubmit={handleSubmitCategory}
          className="max-w-lg mx-auto p-4 space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium ">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={category.name}
              onChange={(e) =>
                setCategory((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input input-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              required
            />

            <div>
              <div className="form-control mt-3 w-56">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    Expense Category
                  </span>
                  <input
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCategory((prev) => ({
                          ...prev,
                          isExpense: true,
                        }));
                      } else {
                        setCategory((prev) => ({
                          ...prev,
                          isExpense: false,
                        }));
                      }
                    }}
                    type="checkbox"
                    className="toggle bg-purple-300"
                  />
                </label>
              </div>
            </div>

            {category.isExpense && (
              <div>
                <label
                  htmlFor="limit"
                  className="block mt-3 text-sm font-medium "
                >
                  Spend Limit
                </label>
                <input
                  type="number"
                  name="limit"
                  id="limit"
                  min={1}
                  step={0.01}
                  value={category.limit}
                  onChange={(e) =>
                    setCategory((prev) => ({ ...prev, limit: e.target.value }))
                  }
                  className="input input-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
                />
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="btn bg-purple-300 text-black hover:bg-purple-400 w-full"
            >
              Create Category
            </button>
          </div>
        </form>
      </>
    );
  };

  const renderCorrectForm = () => {
    if (open === "create-expense") {
      return <>{renderCreateExpenseForm()}</>;
    } else if (open === "add-income") {
      return <>{renderAddIncomeForm()}</>;
    } else if (open === "create-category") {
      return <>{renderAddCategoryForm()}</>;
    }
  };

  return (
    <>
      <dialog id="my_modal_3" className={`modal px-5 ${open && "modal-open"}`}>
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={() => {
                setCategoryInput("");
                setOpen(null);
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <div className="form-section">{renderCorrectForm()}</div>
        </div>
      </dialog>
    </>
  );
}
