import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "@/lib/axios"; // your axios wrapper
import Toast from "react-hot-toast";

// ✅ Fetch all tournaments
export const fetchTournamentsAction = createAsyncThunk(
  "tournament/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/tournaments");
      return response.data; // array of tournaments
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch tournaments!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

// ✅ Create new tournament
export const createTournamentAction = createAsyncThunk(
  "tournament/create",
  async (tournamentData, thunkAPI) => {
    try {
      const response = await apiRequest.post("/tournaments", tournamentData);
      Toast.success("Tournament created successfully!");
      return response.data; // newly created tournament object
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create tournament!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

// ✅ Fetch single tournament by ID
export const fetchTournamentByIdAction = createAsyncThunk(
  "tournament/fetchById",
  async (tournamentId, thunkAPI) => {
    try {
      const response = await apiRequest.get(`/tournaments/${tournamentId}`);
      return response.data; // single tournament object
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch tournament!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

// ✅ Join a tournament
export const joinTournamentAction = createAsyncThunk(
  "tournament/join",
  async ({ tournamentId, playerId }, thunkAPI) => {
    try {
      const response = await apiRequest.post("/tournament-join/join", {
        tournamentId,
        playerId,
      });
      Toast.success("Successfully joined the tournament!");
      return response.data; // returned data from API
    } catch (error) {
      const message = error.response?.data?.message || "Failed to join tournament!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchTournamentJoinDetails = createAsyncThunk(
  "tournament/fetchJoinDetails",
  async (OTP_ERROR, thunkAPI) => {
    try {
      const response = await apiRequest.get(`/tournament-join/all-joins`);
      return response.data; // API should return joined players or related info
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch tournament join details";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

export const cancelJoinTournamentAction = createAsyncThunk(
  "tournament/cancelJoin",
  async ({ joinId }, thunkAPI) => {
    console.log("🚀 ~ joinId:", joinId);
    try {
      const response = await apiRequest.delete("/tournament-join/cancel", {
        data: { joinId }, // ✅ Axios requires "data" key for DELETE body
      });
      Toast.success("Successfully cancelled the tournament join!");
      return { joinId, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to cancel tournament join!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

