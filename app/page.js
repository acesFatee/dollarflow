import { getRecentTransactions } from "@/api";
import Funds from "@/components/Funds";
import History from "@/components/History";
import RecentTransactions from "@/components/RecentTransactions";
import SpendHistory from "@/components/SpendHistory";

export default async function Home() {
  let recentTransactionsData;

  try {
    recentTransactionsData = await getRecentTransactions();
  } catch (error) {
    console.log(null);
  }

  return (
    <>
      <div className="dashboard-top w-full  my-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <section className="recent-transactions col-span-1 lg:col-span-2 border-base-300 rounded-3xl p-4 border-2">
          <h1 className="font-bold py-3 text-lg">Recent Transactions</h1>
          <RecentTransactions
            recentTransactionsServer={
              recentTransactionsData?.recentTransactions || []
            }
          />
        </section>
      </div>

      <div className="dashboard-top w-full grid grid-cols-1 my-3 lg:grid-cols-3 gap-4">
        <section className="recent-budgets h-full col-span-1 border-base-300 rounded-3xl p-4 border-2">
          <h1 className="font-bold pt-3 text-lg">Account Balance</h1>
          <Funds />
        </section>

        <section className="spend-history col-span-1 lg:col-span-2 border-base-300 rounded-3xl p-4 border-2">
          <div className="dashboard-top-heading-and-filters grid grid-cols-1 md:grid-cols-2">
            <h1 className="font-bold pt-3 text-lg">Spend History</h1>
            <History historyFor="user" />
          </div>
          <SpendHistory />
        </section>
      </div>
    </>
  );
}
