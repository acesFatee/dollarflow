import Image from "next/image";
import React from "react";

export default function NoData({
  forTransaction,
  forCategory,
  forRecent,
  forTopCategories,
  forSpendHistory,
}) {
  const recentTransactions = () => {
    return (
      <div className="grid place-items-center h-56 border-2 text-sm border-dotted border-base-300 rounded-3xl p-4">
        You have no recent transactions
      </div>
    );
  };

  const topCategories = () => {
    return (
      <div className="grid place-items-center h-56 border-2 text-sm border-dotted border-base-300 rounded-3xl p-4">
        You have no expense categories
      </div>
    );
  };

  const noSpendHistory = () => {
    return (
      <div className="grid w-full h-96 text-sm place-items-center border-2 border-dotted border-base-300 rounded-3xl">
        You have no spend history
      </div>
    );
  };

  const transactions = () => {
    return (
      <div className="grid place-items-center">
        <div className="p-6 w-full text-center">
          <div className="text-lg my-4 grid place-items-center">
            <Image width={100} height={100} src={"/no-data.png"} />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Transactions Found</h2>
        </div>
      </div>
    );
  };

  const categories = () => {
    return (
      <div className="grid place-items-center">
        <div className="p-6 w-full text-center">
          <div className="text-lg my-4 grid place-items-center">
            <Image width={100} height={100} src={"/no-data.png"} />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Categories Found</h2>
        </div>
      </div>
    );
  };

  const renderCorrectMethod = () => {
    if (forTransaction) {
      return transactions();
    }
    if (forCategory) {
      return categories();
    }
    if (forRecent) {
      return recentTransactions();
    }
    if (forTopCategories) {
      return topCategories();
    }
    if (forSpendHistory) {
      return noSpendHistory();
    }
  };

  return <>{renderCorrectMethod()}</>;
}
