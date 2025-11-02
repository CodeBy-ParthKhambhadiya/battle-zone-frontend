import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/reducers/auth.reducer";
import privateChatReducer from "@/store/reducers/privateChat.reducer";
import tournamentReducer from "@/store/reducers/tournament.reducer";
import walletReducer from "@/store/reducers/wallet.reducer"; // 🆕 wallet slice

const store = configureStore({
  reducer: {
    user: authReducer,         // authentication & user data
    privateChat: privateChatReducer, // chat state
    tournament: tournamentReducer,   // tournament data
    wallet: walletReducer,     // 🪙 wallet / transactions state
  },
});

export default store;
