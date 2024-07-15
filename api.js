"use server";

import { auth } from "@clerk/nextjs/server";

export const createExpense = async (expense) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      "http://localhost:5000/api/transactions/create-expense",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addIncome = async (income) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      "http://localhost:5000/api/transactions/add-income",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(income),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createCategory = async (category) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      "http://localhost:5000/api/categories/create-category",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateCategory = async (category) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      `http://localhost:5000/api/categories/update-category/${category._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateIncome = async (income) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      `http://localhost:5000/api/transactions/update-income/${income._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(income),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const searchCategories = async (query) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      `http://localhost:5000/api/categories/search?query=${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getRecentTransactions = async () => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      `http://localhost:5000/api/transactions/recent`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
      {cache: "no-store"}
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getUserFromMongo = async () => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(`http://localhost:5000/api/users/get-user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getCategories = async (page, query) => {
  const { getToken } = auth();
  try {
    const token = await getToken();
    const response = await fetch(`http://localhost:5000/api/categories?page=${page}&search=${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }, {cache: "no-store"});
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getTransactions = async (page, search, category, year, month) => {
  const { getToken } = auth();
  try {
    const token = await getToken();
    const response = await fetch(
      `http://localhost:5000/api/transactions?page=${page}&search=${search}&category=${category}&year=${year}&month=${month}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
      { cache: "no-store" }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else if(response.status == 400){
      const data = await response.json()
      return data
    }
  } catch (error) {
    return error;
  }
};

export const updateExpense = async (expense) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      `http://localhost:5000/api/transactions/update-expense/${expense._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteExpense = async (expense) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      `http://localhost:5000/api/transactions/delete-expense/${expense._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteIncome = async (income) => {
  const { getToken } = auth();

  try {
    const token = await getToken();
    const response = await fetch(
      `http://localhost:5000/api/transactions/delete-income/${income._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(income),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addFunds = async (amount) => {
  const { getToken } = auth();
  try {
    const token = await getToken();
    const response = await fetch(
      "http://localhost:5000/api/users/add-funds",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({amount}),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};