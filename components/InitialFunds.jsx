"use client";

import { addFunds } from "@/api";
import { Context } from "@/Context/Context";
import React, { useContext, useEffect, useState } from "react";

export default function InitialFunds() {
  const { openFundsModal, setOpenFundsModal, setUser, user } = useContext(Context);
  const [amount, setAmount] = useState(user?.funds || 0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(amount)) {
      alert("Please enter a valid amount with up to two decimal places.");
      return;
    }

    const response = await addFunds(amount)
    if(!response.updatedUser){
        alert(response.error)
        return;
    }
    setUser(prev => ({
        ...prev,
        funds: response.updatedUser.funds
    }))

    setOpenFundsModal(false);
  };

  useEffect(() => {
    setAmount(user?.funds || 0)
  }, [user])
  

  return (
    <>
      <dialog
        id="my_modal_3"
        className={`modal ${openFundsModal ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <button
            onClick={() => setOpenFundsModal(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <>
            <h1 className="font-bold text-xl px-4">
              Edit your funds
            </h1>
            <p className="px-4 text-sm text-gray-400">It is recommended to add your current funds to start tracking your expenses effectively.</p>
            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto px-4 space-y-4"
            >
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
                  step={0.01}
                  max={9999999999}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  id="amount"
                  className="input input-bordered w-full mt-1 border-purple-300 focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn bg-purple-300 text-black hover:bg-purple-400 w-full"
                >
                  Edit Funds
                </button>
              </div>
            </form>
          </>
        </div>
      </dialog>
    </>
  );
}
