import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/reducers/auth.reducer";
import privateChatReducer from "@/store/reducers/privateChat.reducer";
import tournamentReducer from "@/store/reducers/tournament.reducer";
import walletReducer from "@/store/reducers/wallet.reducer";
import notificationReducer from "@/store/reducers/notification.reducer"; // 🆕 import notification slice

const store = configureStore({
  reducer: {
    user: authReducer,              // authentication & user data
    privateChat: privateChatReducer, // private chat state
    tournament: tournamentReducer,   // tournament state
    wallet: walletReducer,           // wallet & transactions
    notification: notificationReducer, // 🆕 notifications state
  },
});

export default store;
