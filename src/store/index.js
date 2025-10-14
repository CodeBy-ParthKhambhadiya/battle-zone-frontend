import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/reducers/auth.reducer"; // your auth reducer

const store = configureStore({
  reducer: {
    user: authReducer, // this key must match your useSelector
  },
});

export default store;
