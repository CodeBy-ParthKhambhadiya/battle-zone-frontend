import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "@/lib/axios";
import Toast from "@/utils/toast";

// 🟢 Player: Create Transaction (Deposit / Withdrawal)
export const createTransactionAction = createAsyncThunk(
  "wallet/createTransaction",
  async (payload, thunkAPI) => {
    try {
      // 🧩 API call
      const { data } = await apiRequest.post("/transactions/create", payload);

      // ✅ Show toast based on API success
      if (data.success) {
        Toast.success(data.message || "Transaction created successfully!");
      } else {
        Toast.error(data.message || "Transaction creation failed!");
      }

      // ✅ Return result to reducer
      return data;
    } catch (error) {
      // ⚠️ Extract message from backend or fallback
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while creating the transaction.";

      // ❌ Show toast for the error
      Toast.error(message);

      // 🚫 Return structured error
      return thunkAPI.rejectWithValue({
        success: false,
        message,
      });
    }
  }
);


// 🟡 Player: Get My Transactions
export const fetchMyTransactionsAction = createAsyncThunk(
  "wallet/fetchMyTransactions",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/transactions/my-transactions");
      return response.data; // Array of user's transactions
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch transactions!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

// 🔵 Admin: Get Pending Transactions
export const fetchPendingTransactionsAction = createAsyncThunk(
  "wallet/fetchPendingTransactions",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/transactions/pending");
      return response.data; // Array of pending transactions
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch pending transactions!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

// 🟢 Admin: Approve Transaction
export const approveTransactionAction = createAsyncThunk(
  "wallet/approveTransaction",
  async (payload, thunkAPI) => {
    try {
      const response = await apiRequest.post("/transactions/approve", payload);
      Toast.success(response.data?.message || "Transaction approved!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to approve transaction!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

// 🔴 Admin: Reject Transaction
export const rejectTransactionAction = createAsyncThunk(
  "wallet/rejectTransaction",
  async (payload, thunkAPI) => {
    try {
      const response = await apiRequest.post("/transactions/reject", payload);
      Toast.success(response.data?.message || "Transaction rejected!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reject transaction!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);
