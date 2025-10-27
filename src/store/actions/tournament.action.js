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

export const fetchAllTournamentChatsAction = createAsyncThunk(
    "tournamentChat/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await apiRequest.get("/tournaments-chat/");
            return response.data.data; // assuming API returns { success, data }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to fetch tournament chats!";
            Toast.error(message);
            return thunkAPI.rejectWithValue(error.response?.data || { message });
        }
    }
);

export const fetchTournamentChatsByIdAction = createAsyncThunk(
  "tournamentChat/fetchById",
  async (tournamentId, thunkAPI) => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const response = await apiRequest.get(`/tournaments-chat/${tournamentId}`);

      return response.data.chat; // assuming API returns { success, data }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to fetch tournament chats!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

export const sendTournamentMessageAction = createAsyncThunk(
  "tournamentChat/sendMessage",
  async ({ tournamentId, message }, thunkAPI) => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const response = await apiRequest.post(`/tournaments-chat/message`, {
        tournamentId,
        message,
      });

      // assuming API returns { success, chat }
      return response.data.chat;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to send message!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

export const createTournamentAction = createAsyncThunk(
  "tournaments/createTournament",
  async (tournamentData, thunkAPI) => {
    try {
      const response = await apiRequest.post("/tournaments", tournamentData);

      // ✅ Assuming backend returns: { success: true, tournament: {...} }
      Toast.success("Tournament created successfully!");

      return response.data.tournament || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create tournament!";
      Toast.error(message);

      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// 📋 Fetch tournaments created by the logged-in organizer
export const fetchOrganizerTournaments = createAsyncThunk(
  "tournaments/fetchOrganizer",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/tournaments/organizer");

      // ✅ Expecting backend format: { success: true, count: n, data: [...] }
      const tournaments = response.data.data || [];

      return tournaments;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch organizer tournaments";

      Toast.error(message);

      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const updateTournamentAction = createAsyncThunk(
  "tournaments/update",
  async ({ tournamentId, formData }, thunkAPI) => {
    try {
      const response = await apiRequest.put(`/tournaments/${tournamentId}`, formData);
      const message = response.data.message || "Tournament updated successfully!";
      Toast.success(message);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Update failed" }
      );
    }
  }
);


export const deleteTournamentAction = createAsyncThunk(
  "tournaments/delete",
  async ({ tournamentId }, thunkAPI) => {
    try {
      const response = await apiRequest.delete(`/tournaments/${tournamentId}`);
      console.log("🚀 ~ Delete Tournament Response:", response);

      // ✅ Expecting: { status: "success", message: "...", data: {...} }
      const { status, message, data } = response.data;

      if (status === "success") {
        Toast.success(message || "Tournament deleted successfully!");
        // Return useful data so reducer can remove it from the list
        return data?._id || tournamentId;
      } else {
        Toast.error(message || "Failed to delete tournament");
        return thunkAPI.rejectWithValue({ message });
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete tournament";

      Toast.error(message);
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const fetchPendingPlayersByTournament = createAsyncThunk(
  "tournamentJoin/fetchPendingPlayersByTournament",
  async (tournamentId, thunkAPI) => {
    try {
      const response = await apiRequest.get(
        `/tournament-join/${tournamentId}/pending`
      );

      // ✅ Expecting backend format: { success: true, count, data: [...] }
      const pendingPlayers = response.data.data || [];

      return pendingPlayers;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch pending players";

      Toast.error(message);

      return thunkAPI.rejectWithValue({ message });
    }
  }
);
