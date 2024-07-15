import React from "react";

export default function Loading({ loadingFor }) {
  const recentTransactions = () => {
    return (
      <>
        <div className="skeleton h-56"></div>
      </>
    );
  };

  const funds = () => {
    return <div className="skeleton h-24 mb-3"></div>;
  };

  const transactions = () => {
    return <div className="skeleton h-72"></div>;
  };

  const graph = () => {
    return <div className="skeleton my-3 h-72"></div>;
  };

  const categories = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="skeleton h-32"></div>
        <div className="skeleton h-32"></div>
        <div className="skeleton h-32"></div>
        <div className="skeleton h-32"></div>
        <div className="skeleton h-32"></div>
        <div className="skeleton h-32"></div>
      </div>
    );
  };

  const renderCorrectLoading = () => {
    switch (loadingFor) {
      case "recent-transactions":
        return recentTransactions();
      case "funds":
        return funds();
      case "transactions":
        return transactions();
      case "categories":
        return categories();
      case "graph":
        return graph();
    }
  };

  return <div>{renderCorrectLoading()}</div>;
}
