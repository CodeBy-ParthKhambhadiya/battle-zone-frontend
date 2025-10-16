import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/reducers/auth.reducer"; // your auth reducer
import privateChatReducer from "@/store/reducers/privateChat.reducer"; // private chat reducer
import tournamentReducer from "@/store/reducers/tournament.reducer"; // private chat reducer

const store = configureStore({
  reducer: {
    user: authReducer, // this key must match your 
    privateChat: privateChatReducer, // private chat state
  tournament: tournamentReducer,
  },
});

export default store;
