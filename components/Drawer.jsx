'use client'

import { useContext } from "react";
import QuickAccess from "./QuickAccess";
import Sidebar from "./Sidebar";
import { Context } from "@/Context/Context";

export default function Drawer({ serverUser, categoriesData, children }) {
  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content relative">
          <section className="quick-action-tray mt-3 w-full py-2">
            <QuickAccess serverUser={serverUser} />
          </section>
          {children}

          {/* Button to open the drawer */}
          <label
            htmlFor="my-drawer"
            className="drawer-button xl:hidden fixed bottom-4 left-4 p-3 bg-purple-400 hover:bg-purple-500 rounded-3xl cursor-pointer"
          >
            <svg
              className={`w-6 h-6 text-black`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M5 7h14M5 12h14M5 17h14"
              />
            </svg>
          </label>
        </div>

        <div className="drawer-side">
          {/* Overlay to close the drawer */}
          <label
            htmlFor="my-drawer"
            className="drawer-overlay"
            aria-label="Close sidebar"
          ></label>

          <div className="w-80 min-h-full">
            <Sidebar serverUser={serverUser} categoriesData={categoriesData} />
          </div>
        </div>
      </div>
    </>
  );
}
