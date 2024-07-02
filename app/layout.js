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

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DollarFlow - Dashboard",
  description: "Generated by create next app",
  icons: {
    icon: "/logo.png",
  },
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
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        photo: data.photo,
        funds: data.funds,
        spent: data.spent,
        earned: data.earned,
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
        <html data-theme="light" lang="en">
          <body className={inter.className}>
            <SignedIn>
              <div className="app grid xl:grid-cols-12 lg:h-screen">
                <Modal />
                <EditModal />
                <DeleteModal />

                <div className="sidebar hidden xl:block col-span-2 lg:h-screen lg:overflow-y-hidden">
                  <Sidebar
                    serverUser={user}
                    categoriesData={categoriesData?.categories || []}
                  />
                </div>

                <div className="drawer-sidebar block xl:hidden px-5 col-span-12 lg:col-span-2 lg:h-screen lg:overflow-y-hidden">
                  <Drawer
                    serverUser={user}
                    categoriesData={categoriesData?.categories || []}
                    children={children}
                  />
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
