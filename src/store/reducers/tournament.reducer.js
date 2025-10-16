import { createSlice } from "@reduxjs/toolkit";
import {
    fetchTournamentsAction,
    createTournamentAction,
    fetchTournamentByIdAction,
    joinTournamentAction,
    fetchTournamentJoinDetails,
    cancelJoinTournamentAction,
} from "@/store/actions/tournament.action";

const initialState = {
    tournaments: [],
    selectedTournament: null,
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
                console.log("🚀 ~ action:", action)
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

                // Optional: remove the cancelled join from joinedTournaments
                state.joinedTournaments = state.joinedTournaments.filter(
                    (t) => t._id !== joinId
                );
            })
            .addCase(cancelJoinTournamentAction.rejected, (state, action) => {
                const joinId = action.meta.arg.joinId;
                state.loading = false;
                state.success = false;
                state.error = action.payload?.message || "Failed to cancel join";
            });
    },
});

export const { resetTournamentState, clearSelectedTournament } =
    tournamentReducer.actions;

export default tournamentReducer.reducer;
