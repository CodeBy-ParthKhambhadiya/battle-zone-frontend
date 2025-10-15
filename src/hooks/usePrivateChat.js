import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersAction, createPrivateChatAction } from "@/store/actions/privateChat.action";

export default function usePrivateChat() {
  const dispatch = useDispatch();
  const { allUsers, loading, error, chat } = useSelector((state) => state.privateChat);

  const fetchAllUsers = async () => {
    await dispatch(fetchAllUsersAction()).unwrap();
  };

  const createPrivateChat = async (chatData) => {
    const result = await dispatch(createPrivateChatAction(chatData)).unwrap();
    return result;
  };

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

  return {
    allUsers,
    loading,
    error,
    chat,
    fetchAllUsers,
    createPrivateChat,
  };
}
