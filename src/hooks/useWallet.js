import { useDispatch, useSelector } from "react-redux";
import {
  createTransactionAction,
  fetchMyTransactionsAction,
  fetchPendingTransactionsAction,
  approveTransactionAction,
  rejectTransactionAction,
} from "@/store/actions/wallet.action";

const useWallet = () => {
  const dispatch = useDispatch();

  const {
    transactions,
    pendingTransactions,
    loading,
    error,
    success,
  } = useSelector((state) => state.wallet);

  // 🟢 Player: Create a deposit or withdrawal
  const createTransaction = async (data) => {
    return await dispatch(createTransactionAction(data));
  };

  // 🟢 Player: Fetch my transactions
  const fetchMyTransactions = async () => {
    return await dispatch(fetchMyTransactionsAction());
  };

  // 🟡 Admin: Fetch all pending transactions
  const fetchPendingTransactions = async () => {
    return await dispatch(fetchPendingTransactionsAction());
  };

  // 🟢 Admin: Approve transaction
  const approveTransaction = async ({ transactionId, remark }) => {
    return await dispatch(approveTransactionAction({ transactionId, remark }));
  };

  // 🔴 Admin: Reject transaction
  const rejectTransaction = async ({ transactionId, remark }) => {
    return await dispatch(rejectTransactionAction({ transactionId, remark }));
  };

  return {
    transactions,
    pendingTransactions,
    loading,
    error,
    success,

    // Exposed actions
    createTransaction,
    fetchMyTransactions,
    fetchPendingTransactions,
    approveTransaction,
    rejectTransaction,
  };
};

export default useWallet;
