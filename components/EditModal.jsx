"use client";

import { Context } from "@/Context/Context";
import { updateCategory, updateExpense, updateIncome } from "@/api";
import React, { useContext, useEffect, useState } from "react";

export default function EditModal() {
  const {
    openEdit,
    setOpenEdit,
    categories,
    setCategories,
    setRecentTransactions,
    setUser,
    recentTransactions,
  } = useContext(Context);
  const [category, setCategory] = useState({
    name: "",
    limit: "",
  });
  const [categoryName, setCategoryName] = useState("");
  const [income, setIncome] = useState({
    _id: "",
    name: "",
    amount: "",
  });

  const [expense, setExpense] = useState({
    _id: "",
    name: "",
    amount: "",
  });

  useEffect(() => {
    const setInputValues = () => {
      if (!openEdit) {
        return;
      }
      if (openEdit?.edit === "category") {
        setCategory({
          _id: openEdit?.element?._id,
          name: openEdit?.element?.name,
          limit: openEdit?.element?.limit,
        });
      } else if (openEdit?.edit === "income") {
        setIncome({
          _id: openEdit?.element?._id,
          name: openEdit?.element?.name,
          description: openEdit?.element?.description,
          amount: openEdit?.element?.amount,
          category: openEdit?.element?.category?._id,
        });
        setCategoryName(openEdit?.element?.category?.name);
      } else {
        setExpense({
          _id: openEdit?.element?._id,
          name: openEdit?.element?.name,
          description: openEdit?.element?.description,
          amount: openEdit?.element?.amount,
          category: openEdit?.element?.category?._id,
        });
        setCategoryName(openEdit?.element?.category?.name);
      }
    };

    setInputValues();
  }, [openEdit]);

  const handleEditIncome = async (e) => {
    e.preventDefault();
    const response = await updateIncome(income);
    if (response.error) {
      alert(JSON.stringify(response.error));
    } else {
      const updatedRecentTransactions = recentTransactions?.map((t) =>
        t._id == response.newIncome._id ? response.newIncome : t
      );
      setRecentTransactions(updatedRecentTransactions);
      setOpenEdit(null);
      if (response.updatedUser) {
        setUser((prev) => ({
          ...prev,
          funds: response.updatedUser.funds,
          earned: response.updatedUser.earned,
        }));
        setRecentTransactions(() => {
          const newTransactions = recentTransactions?.map((t) =>
            t._id == response.newIncome._id ? response.newIncome : t
          );
          return newTransactions;
        });

        setCategories(() => {
          const newCategories = categories?.map((c) => {
            if (c._id == response.updatedPrevCategory?._id) {
              return response.updatedPrevCategory;
            } else if (c._id == response.updatedNewCategory?._id) {
              return response.updatedNewCategory;
            } else {
              return c;
            }
          });
          return newCategories;
        });
      }
    }
  };

  const editIncomeForm = () => {
    return (
      <>
        <h1 className="font-bold text-xl px-4">
          Edit Income - {openEdit && openEdit.element.name}
        </h1>
        <form
          onSubmit={handleEditIncome}
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
              value={income.name}
              onChange={(e) =>
                setIncome((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input input-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              required
            />
            <div>
              <label
                htmlFor="amount"
                className="block mt-3 text-sm font-medium "
              >
                Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={income.amount}
                onChange={(e) =>
                  setIncome((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="input input-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block mt-3 text-sm font-medium "
              >
                Description
              </label>
              <textarea
                type="text"
                name="description"
                id="description"
                value={income.description}
                onChange={(e) =>
                  setIncome((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="textarea textarea-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block mt-3 text-sm font-medium "
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                value={expense?.category?._id}
                onChange={(e) =>
                  setIncome((prev) => ({ ...prev, category: e.target.value }))
                }
                className="select select-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              >
                <option value={openEdit?.element?.category?._id}>
                  {openEdit?.element?.category?.name}
                </option>
                {categories
                  ?.filter(
                    (c) =>
                      !c.isExpense && c._id != openEdit?.element?.category?._id
                  )
                  ?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category?.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="btn bg-purple-300 text-black hover:bg-purple-400 w-full"
            >
              Edit Income
            </button>
          </div>
        </form>
      </>
    );
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    const response = await updateCategory(category);
    if (response.error) {
      alert(JSON.stringify(response.error));
    } else {
      const updatedCategories = categories?.map((c) =>
        c._id == response.category._id ? response.category : c
      );
      setCategories(updatedCategories);
      setOpenEdit(null);
    }
  };

  const editCategoryForm = () => {
    return (
      <>
        <h1 className="font-bold text-xl px-4">
          Edit Category - {openEdit && openEdit.element.name}
        </h1>
        <form
          onSubmit={handleEditCategory}
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
            {openEdit?.element?.isExpense && (
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
              Edit Category
            </button>
          </div>
        </form>
      </>
    );
  };

  const handleEditExpense = async (e) => {
    e.preventDefault();
    const response = await updateExpense(expense);
    if (response.error) {
      alert(JSON.stringify(response.error));
    } else {
      const updatedRecentTransactions = recentTransactions?.map((t) =>
        t._id == response.newExpense._id ? response.newExpense : t
      );
      setRecentTransactions(updatedRecentTransactions);
      setOpenEdit(null);
      if (response.updatedUser) {
        setUser((prev) => ({
          ...prev,
          funds: response.updatedUser.funds,
          spent: response.updatedUser.spent,
        }));

        setRecentTransactions(() => {
          const newTransactions = recentTransactions?.map((t) =>
            t._id == response.newExpense._id ? response.newExpense : t
          );
          return newTransactions;
        });

        setCategories(() => {
          const newCategories = categories?.map((c) => {
            if (c._id == response.updatedPrevCategory?._id) {
              return response.updatedPrevCategory;
            } else if (c._id == response.updatedNewCategory?._id) {
              return response.updatedNewCategory;
            } else {
              return c;
            }
          });
          return newCategories;
        });
      }
    }
  };

  const editExpenseForm = () => {
    return (
      <>
        <h1 className="font-bold text-xl px-4">
          Edit expense - {openEdit && openEdit.element.name}
        </h1>
        <form
          onSubmit={handleEditExpense}
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
              onChange={(e) =>
                setExpense((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input input-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              required
            />
            <div>
              <label
                htmlFor="amount"
                className="block mt-3 text-sm font-medium "
              >
                Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={expense.amount}
                onChange={(e) =>
                  setExpense((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="input input-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block mt-3 text-sm font-medium "
              >
                Description
              </label>
              <textarea
                type="text"
                name="description"
                id="description"
                value={expense.description}
                onChange={(e) =>
                  setExpense((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="textarea textarea-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block mt-3 text-sm font-medium "
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                value={expense?.category?._id}
                onChange={(e) =>
                  setExpense((prev) => ({ ...prev, category: e.target.value }))
                }
                className="select select-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
              >
                <option value={openEdit?.element?.category?._id}>
                  {openEdit?.element?.category?.name}
                </option>
                {categories
                  ?.filter(
                    (c) =>
                      c.isExpense && c._id != openEdit?.element?.category?._id
                  )
                  ?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category?.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="btn bg-purple-300 text-black hover:bg-purple-400 w-full"
            >
              Edit Expense
            </button>
          </div>
        </form>
      </>
    );
  };

  const renderCorrectForm = () => {
    if (openEdit?.edit === "category") {
      return <>{editCategoryForm()}</>;
    } else if (openEdit?.edit === "income") {
      return <>{editIncomeForm()}</>;
    } else {
      return <>{editExpenseForm()}</>;
    }
  };

  return (
    <dialog
      id="my_modal_3"
      className={`modal px-5 ${openEdit && "modal-open"}`}
    >
      <div className="modal-box">
        <form method="dialog">
          <button
            onClick={() => setOpenEdit(null)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <div className="form-section">{renderCorrectForm()}</div>
      </div>
    </dialog>
  );
}
