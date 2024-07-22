import React from "react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Provider from "@/Context/Provider";
import Hero from "@/components/Hero";
import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import { getCategories, getUserFromMongo } from "@/api";
import QuickAccess from "@/components/QuickAccess";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";
import Drawer from "@/components/Drawer";
import { Nunito } from "next/font/google";
import "./globals.css";
import InitialFunds from "@/components/InitialFunds";

const inter = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "DollarFlow - Manage Your Expenses with Ease",
  description:
    "DollarFlow is your ultimate tool for managing expenses, tracking income, and planning your budget. Simplify your financial life with our easy-to-use expense tracker.",
  icons: {
    icon: "/logo.png",
  },
  keywords:
    "DollarFlow, dollarFlow, dollarflow, expense tracking, money management, budget, budgeting, personal finance, financial planning, expense manager, income tracking, expense tracker, savings, financial goals, finance app, expense app, money app, track spending, manage finances, budget planner, financial health, spending tracker, finance management, expense reporting, money tracker, financial app, personal budget, financial control, financial insights, spending analysis, budget analysis, expense monitoring, cost tracking, income management, financial overview, financial dashboard, budget app, expense logging, financial recording, money saving, debt management, expenditure tracking, income overview, savings tracker, budget monitoring, expense auditing, money planner, financial scheduling, fiscal management, economic planning",
};

export default async function RootLayout({ children }) {
  let clerkUser = null;
  let user = null;
  let categoriesData = null;

  try {
    clerkUser = await currentUser();
    if (clerkUser) {
      const response = await getUserFromMongo();
      const data = response.user;
      user = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        photo: data?.photo,
        funds: data?.funds,
        history: data?.history,
      };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  try {
    categoriesData = await getCategories(1, null);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <ClerkProvider>
      <Provider>
        <html data-theme="black" lang="en">
          <body className={inter.className}>
            <SignedIn>
              <div className="app grid xl:grid-cols-12 lg:h-screen">
                <Modal />
                <EditModal />
                <DeleteModal />
                <InitialFunds />

                <div className="sidebar hidden xl:block col-span-2 lg:h-screen lg:overflow-y-hidden">
                  <Sidebar
                    serverUser={{
                      firstName: clerkUser?.firstName,
                      lastName: clerkUser?.lastName,
                      email: clerkUser?.emailAddresses[0]?.emailAddress,
                    }}
                    categoriesData={categoriesData?.categories || []}
                  />
                </div>

                <div className="drawer-sidebar block xl:hidden px-5 col-span-12 lg:col-span-2 lg:h-screen lg:overflow-y-hidden">
                  <Drawer
                    serverUser={user}
                    categoriesData={categoriesData?.categories || []}
                  >
                    {children}
                  </Drawer>
                </div>

                <div className="rest-of-page px-5 xl:block hidden col-span-12 xl:col-span-10 lg:h-screen lg:overflow-y-auto">
                  <section className="quick-action-tray mt-3 w-full py-2">
                    <QuickAccess serverUser={user} />
                  </section>
                  {children}
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <Hero />
            </SignedOut>
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
