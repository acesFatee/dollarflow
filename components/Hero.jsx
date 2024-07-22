"use client";

import { Context } from "@/Context/Context";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import React, { useContext } from "react";

export default function Hero() {
  const { theme, setTheme } = useContext(Context);
  const changeTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <>
      <header className="body-font">
        <div className="container mx-auto">
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <img src="/logo.png" width={30} alt="DollarFlow Logo" />
              <a className="ml-4 text-lg font-bold">DollarFlow</a>
            </div>
            <div className="flex-none">
              <ul className="menu menu-horizontal space-x-3 px-1 flex justify-between">
                <li>
                  <label className="swap swap-rotate">
                    <input onChange={changeTheme} type="checkbox" />

                    {/* sun icon */}
                    <svg
                      className="swap-off h-8 w-8 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>

                    {/* moon icon */}
                    <svg
                      className="swap-on h-8 w-8 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <section className="body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium">
              Welcome to DollarFlow
            </h1>
            <p className="mb-8 leading-relaxed">
              DollarFlow helps you keep track of your transactions, set limits
              on expense categories, get monthly reports, see graphical
              representations of expenditure, and much more. Secure
              authentication ensures your data is always safe.
            </p>
            <div className="flex justify-center">
              <ClerkLoading>
                <button className="btn text-gray-800 bg-purple-300 hover:bg-purple-400">
                  Get Started
                </button>
              </ClerkLoading>
              <ClerkLoaded>
                <button className="btn text-gray-800 bg-purple-300 hover:bg-purple-400">
                  <SignUpButton mode="modal">Get Started</SignUpButton>
                </button>
              </ClerkLoaded>
            </div>
          </div>
          <div className="lg:max-w-lg grid place-items-center lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              width={250}
              src="https://cdn-icons-png.flaticon.com/512/2037/2037061.png"
            />
          </div>
        </div>
      </section>

      <section className="body-font bg-base-200">
        <div className="container px-5 py-12 mx-auto">
          <div className="text-center mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4">
              Comprehensive Expense Tracking
            </h1>
            <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500">
              Track your income and expenses, set financial goals, and gain
              insights into your spending habits with DollarFlow.
            </p>
            <div className="flex mt-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
            </div>
          </div>
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-lg title-font font-bold mb-3">
                  Track Transactions
                </h2>
                <p className="leading-relaxed text-base">
                  Keep a detailed record of your income and expenses,
                  categorized for easy tracking and analysis.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                >
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-lg title-font font-bold mb-3">
                  Set Expense Limits
                </h2>
                <p className="leading-relaxed text-base">
                  Define limits on different expense categories to stay within
                  your budget and achieve financial goals.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-lg title-font font-bold mb-3">
                  Monthly Reports
                </h2>
                <p className="leading-relaxed text-base">
                  Generate detailed monthly reports to analyze your spending
                  patterns and make informed financial decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="text-center mb-20">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4">
              Features You&apos;ll Love
            </h1>

            <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500">
              DollarFlow offers a variety of features designed to help you
              manage your finances effectively and efficiently.
            </p>
            <div className="flex mt-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3">
              <div className="h-full p-8 rounded">
                <h2 className=" text-lg title-font mb-4 font-bold">
                  Secure Authentication
                </h2>
                <p className="leading-relaxed mb-6">
                  With robust security measures, your financial data is
                  protected and accessible only to you.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3">
              <div className="h-full p-8 rounded">
                <h2 className=" text-lg title-font font-bold mb-4">
                  Graphical Insights
                </h2>
                <p className="leading-relaxed mb-6">
                  Visualize your expenses with comprehensive graphs and charts,
                  making it easier to understand your financial status.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3">
              <div className="h-full p-8 rounded">
                <h2 className=" text-lg title-font mb-4 font-bold">
                  Category Management
                </h2>
                <p className="leading-relaxed mb-6 ">
                  Organize your expenses into categories and set budgets for
                  each to better control your spending.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="body-font bg-base-200">
        <div className="container mx-auto py-24 px-5">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4">
              Get Started with DollarFlow
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Join thousands of satisfied users who have taken control of their
              finances with DollarFlow.
            </p>
            <div className="flex mx-auto mt-6">
              <button className="btn mr-4 text-gray-800 bg-purple-300 hover:bg-purple-400">
                <SignUpButton />
              </button>
              <button className="btn text-gray-800 bg-purple-300 hover:bg-purple-400">
                <SignInButton />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
