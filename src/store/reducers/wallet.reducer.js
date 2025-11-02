import { createSlice } from "@reduxjs/toolkit";
import {
  createTransactionAction,
  fetchMyTransactionsAction,
  fetchPendingTransactionsAction,
  approveTransactionAction,
  rejectTransactionAction,
} from "../actions/wallet.action";

const initialState = {
  transactions: [],       // All user transactions (player)
  pendingTransactions: [], // Admin-only pending list
  loading: false,         // General loading state
  error: null,            // Error message
  success: null,          // Success message
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletState: (state) => {
      state.transactions = [];
      state.pendingTransactions = [];
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- Create Transaction (Deposit / Withdrawal) ---
    builder
      .addCase(createTransactionAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createTransactionAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || "Transaction created!";
        // add the new transaction to the top of list
        if (action.payload?.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      .addCase(createTransactionAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create transaction";
      });

    // --- Fetch My Transactions ---
    builder
      .addCase(fetchMyTransactionsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTransactionsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload || [];
      })
      .addCase(fetchMyTransactionsAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch transactions";
      });

    // --- Fetch Pending Transactions (Admin) ---
    builder
      .addCase(fetchPendingTransactionsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTransactionsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTransactions = action.payload || [];
      })
      .addCase(fetchPendingTransactionsAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch pending transactions";
      });

    // --- Approve Transaction (Admin) ---
    builder
      .addCase(approveTransactionAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveTransactionAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || "Transaction approved!";
        // remove approved transaction from pending list
        state.pendingTransactions = state.pendingTransactions.filter(
          (txn) => txn.id !== action.payload?.transactionId
        );
      })
      .addCase(approveTransactionAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to approve transaction";
      });

    // --- Reject Transaction (Admin) ---
    builder
      .addCase(rejectTransactionAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectTransactionAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || "Transaction rejected!";
        // remove rejected transaction from pending list
        state.pendingTransactions = state.pendingTransactions.filter(
          (txn) => txn.id !== action.payload?.transactionId
        );
      })
      .addCase(rejectTransactionAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to reject transaction";
      });
  },
});

export const { clearWalletState, clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
