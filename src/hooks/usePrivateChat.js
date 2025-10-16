import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersAction, createPrivateChatAction, sendMessageAction, fetchMessagesAction, fetchUserPrivateChatsAction } from "@/store/actions/privateChat.action";

export default function usePrivateChat() {
  const dispatch = useDispatch();
  const { allUsers, loading, error, chat, chatUserList, messages } = useSelector((state) => state.privateChat);

  const fetchAllUsers = async () => {
    await dispatch(fetchAllUsersAction()).unwrap();
  };

  const createPrivateChat = async (chatData) => {
    const result = await dispatch(createPrivateChatAction(chatData)).unwrap();
    return result;
  };

  const sendMessage = async ({ chatId, message }) => {
    const result = await dispatch(sendMessageAction({ chatId, message })).unwrap();
    return result;
  };

  const fetchMessages = async (chatId) => {
    const result = await dispatch(fetchMessagesAction(chatId)).unwrap();
    return result;
  };


  const fetchUserPrivateChats = async (chatId) => {
    const result = await dispatch(fetchUserPrivateChatsAction()).unwrap();
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
    messages,
    chatUserList,
    fetchAllUsers,
    createPrivateChat,
    sendMessage,
    fetchMessages,
    fetchUserPrivateChats
  };
}
