"use client";

import { Context } from "@/Context/Context";
import { deleteCategory, deleteExpense, deleteIncome } from "@/api";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

export default function DeleteModal() {
  const { openDelete, setOpenDelete, setCategories, setUser, categories } =
    useContext(Context);
  const router = useRouter();

  const handleDeleteIncome = async () => {
    const response = await deleteIncome(openDelete);
    setCategories(() => {
      const updated = categories?.map((c) =>
        c._id == response.updatedCategory._id ? response.updatedCategory : c
      );
      return updated;
    });
    setUser((prev) => ({
      ...prev,
      funds: response.updatedUser.funds,
      earned: response.updatedUser.earned,
    }));
    setOpenDelete(null);
    router.refresh();
  };

  const handleDeleteExpense = async () => {
    const response = await deleteExpense(openDelete);
    setCategories(() => {
      const updated = categories?.map((c) =>
        c._id == response.updatedCategory._id ? response.updatedCategory : c
      );
      return updated;
    });
    setUser((prev) => ({
      ...prev,
      funds: response.updatedUser.funds,
      spent: response.updatedUser.spent,
    }));
    setOpenDelete(null);
    router.refresh();
  };

  const handleDeleteCategory = async () => {
    const response = await deleteCategory(openDelete);

    setCategories((prevCategories) => {
      const updated = prevCategories?.filter(
        (c) => c._id !== response.deletedCategory._id
      );
      return updated;
    });

    setOpenDelete(null);
    router.refresh();
  };

  return (
    <dialog id="my_modal_3" className={`modal ${openDelete && "modal-open"}`}>
      <div className="modal-box rounded-lg shadow-lg p-6">
        <form method="dialog">
          <button
            onClick={() => setOpenDelete(null)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 transition-colors"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl mb-4">
          Are you sure you want to delete this{" "}
          {openDelete?.transactionCount !== undefined
            ? "category"
            : "transaction"}{" "}
          - {openDelete?.name}?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={
              openDelete?.transactionCount !== undefined
                ? handleDeleteCategory
                : openDelete?.isExpense
                ? handleDeleteExpense
                : handleDeleteIncome
            }
            className="btn btn-error"
          >
            Yes
          </button>
          <button
            onClick={() => setOpenDelete(null)}
            className="btn bg-purple-300 hover:bg-purple-400 text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}
