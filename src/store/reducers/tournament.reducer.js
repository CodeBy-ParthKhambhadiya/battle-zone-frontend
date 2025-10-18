import { createSlice } from "@reduxjs/toolkit";
import {
    fetchTournamentsAction,
    createTournamentAction,
    fetchTournamentByIdAction,
    joinTournamentAction,
    fetchTournamentJoinDetails,
    cancelJoinTournamentAction,
    fetchAllTournamentChatsAction,
    fetchTournamentChatsByIdAction,
    sendTournamentMessageAction,
} from "@/store/actions/tournament.action";

const initialState = {
    tournaments: [],
    selectedTournament: null,
    tournamentChats: null,
    tournamentChatById: null,
    loading: false,
    error: null,
    success: false,
    requestStatus: null,
    joinDetails: null,
};

const tournamentReducer = createSlice({
    name: "tournament",
    initialState,
    reducers: {
        resetTournamentState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.requestStatus = null;
        },
        clearSelectedTournament: (state) => {
            state.selectedTournament = null;
        },
    },
    extraReducers: (builder) => {
        // 🔹 Fetch all tournaments
        builder
            .addCase(fetchTournamentsAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.requestStatus = "pending";
            })
            .addCase(fetchTournamentsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.tournaments = action.payload.data;
                state.requestStatus = "fulfilled";
            })
            .addCase(fetchTournamentsAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.requestStatus = "rejected";
            });

        // 🔹 Create new tournament
        builder
            .addCase(createTournamentAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createTournamentAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.tournaments.unshift(action.payload); // add new tournament on top
            })
            .addCase(createTournamentAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.success = false;
            });

        // 🔹 Fetch single tournament
        builder
            .addCase(fetchTournamentByIdAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTournamentByIdAction.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTournament = action.payload;
            })
            .addCase(fetchTournamentByIdAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // 🔹 Join tournament (simplified, no extra state)
        builder
            .addCase(joinTournamentAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(joinTournamentAction.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(joinTournamentAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.success = false;
            });

        builder
            .addCase(fetchTournamentJoinDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchTournamentJoinDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.joinDetails = action.payload.data;
            })
            .addCase(fetchTournamentJoinDetails.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload?.message || action.error.message;
            });

        builder
            .addCase(cancelJoinTournamentAction.pending, (state, action) => {
                const joinId = action.meta.arg.joinId;
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(cancelJoinTournamentAction.fulfilled, (state, action) => {
                const joinId = action.payload.joinId;
                state.loading = false;
                state.success = true;
                state.error = null;

                // ✅ Remove the cancelled join from joinDetails
                if (state.joinDetails && Array.isArray(state.joinDetails)) {
                    state.joinDetails = state.joinDetails.filter(
                        (join) => join._id !== joinId
                    );
                }
            })
            .addCase(cancelJoinTournamentAction.rejected, (state, action) => {
                const joinId = action.meta.arg.joinId;
                state.loading = false;
                state.success = false;
                state.error = action.payload?.message || "Failed to cancel join";
            });

        builder
            .addCase(fetchAllTournamentChatsAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.requestStatus = "pending";
            })
            .addCase(fetchAllTournamentChatsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.tournamentChats = action.payload; // store all chats
                state.success = true;
                state.requestStatus = "fulfilled";
            })
            .addCase(fetchAllTournamentChatsAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
                state.success = false;
                state.requestStatus = "rejected";
            });
        builder
            // Pending
            .addCase(fetchTournamentChatsByIdAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.tournamentChatById = null; // reset previous chat
            })

            // Fulfilled
            .addCase(fetchTournamentChatsByIdAction.fulfilled, (state, action) => {
                state.loading = false;
                state.tournamentChatById = action.payload; // store fetched chat
            })

            // Rejected
            .addCase(fetchTournamentChatsByIdAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch tournament chat!";
                state.tournamentChatById = null; // clear chat on error
            });

        builder
            .addCase(sendTournamentMessageAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendTournamentMessageAction.fulfilled, (state, action) => {
                state.loading = false;

                // Ensure the chat object exists
                if (!state.tournamentChatById) {
                    // Initialize the full chat object if it doesn't exist yet
                    state.tournamentChatById = action.payload.chat;
                } else if (action.payload?.newMessage) {
                    // Only push the new message to the messages array
                    state.tournamentChatById.messages.push(action.payload.newMessage);

                    // Optionally update timestamps or other chat info
                    if (action.payload.chat?.updatedAt) {
                        state.tournamentChatById.updatedAt = action.payload.chat.updatedAt;
                    }
                }
            })
            .addCase(sendTournamentMessageAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to send message";
            });

    },
});

export const { resetTournamentState, clearSelectedTournament } =
    tournamentReducer.actions;

export default tournamentReducer.reducer;
