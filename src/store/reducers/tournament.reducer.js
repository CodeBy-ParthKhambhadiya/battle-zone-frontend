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
    fetchOrganizerTournaments,
    updateTournamentAction,
    deleteTournamentAction,
    fetchPendingPlayersByTournament,
    confirmTournamentJoinAction,
    deleteTournamentJoinAction,
} from "@/store/actions/tournament.action";

const initialState = {
    tournaments: [],
    organizerTournaments: [],
    ManagePendingPlayers: [],
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

                // Add to both tournaments and organizerTournaments
                if (action.payload) {
                    state.tournaments.unshift(action.payload);

                    // Ensure organizerTournaments exists
                    if (!state.organizerTournaments) {
                        state.organizerTournaments = [];
                    }

                    // Add the tournament at the top of organizerTournaments too
                    state.organizerTournaments.unshift(action.payload.tournament);
                }
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

        builder
            .addCase(fetchOrganizerTournaments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizerTournaments.fulfilled, (state, action) => {
                state.loading = false;
                state.organizerTournaments = action.payload;
            })
            .addCase(fetchOrganizerTournaments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateTournamentAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateTournamentAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                // ✅ Get updated tournament from payload.data
                const updatedTournament = action.payload.data;

                if (updatedTournament && state.organizerTournaments) {
                    // ✅ Update the specific tournament in the list
                    state.organizerTournaments = state.organizerTournaments.map((t) =>
                        t._id === updatedTournament._id ? updatedTournament : t
                    );
                }
            })
            .addCase(updateTournamentAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update tournament.";
            });

        builder
            .addCase(deleteTournamentAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTournamentAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const deletedId = action.payload; // ✅ this is the tournament ID

                // ✅ Remove from both lists *without* re-fetching
                if (Array.isArray(state.tournaments)) {
                    state.tournaments = state.tournaments.filter((t) => t._id !== deletedId);
                }

                if (Array.isArray(state.organizerTournaments)) {
                    state.organizerTournaments = state.organizerTournaments.filter(
                        (t) => t._id !== deletedId
                    );
                }
            })
            .addCase(deleteTournamentAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to delete tournament";
            });

        builder
            .addCase(fetchPendingPlayersByTournament.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingPlayersByTournament.fulfilled, (state, action) => {
                state.loading = false;
                state.ManagePendingPlayers = action.payload;
            })
            .addCase(fetchPendingPlayersByTournament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            });
        builder
            .addCase(confirmTournamentJoinAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.lastAction = "confirm";
            })
            .addCase(confirmTournamentJoinAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                // ✅ Update ManagePendingPlayers locally
                const joinId = action.meta.arg.joinId;
                state.ManagePendingPlayers = state.ManagePendingPlayers.map((tournament) => {
                    const updatedPending = tournament.pendingPlayers.filter(p => p._id !== joinId);
                    const movedPlayer = tournament.pendingPlayers.find(p => p._id === joinId);

                    return movedPlayer
                        ? {
                            ...tournament,
                            pendingPlayers: updatedPending,
                            confirmedPlayers: [...(tournament.confirmedPlayers || []), { ...movedPlayer, status: "confirmed" }],
                        }
                        : tournament;
                });
            })
            .addCase(confirmTournamentJoinAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to confirm player.";
            })

            // ----- Reject -----
            .addCase(deleteTournamentJoinAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.lastAction = "reject";
            })
            .addCase(deleteTournamentJoinAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const joinId = action.meta.arg.joinId;

                state.ManagePendingPlayers = state.ManagePendingPlayers.map((tournament) => ({
                    ...tournament,
                    pendingPlayers: tournament.pendingPlayers.filter((p) => p._id !== joinId),
                    confirmedPlayers: tournament.confirmedPlayers?.filter((p) => p._id !== joinId) || [],
                }));
            })
            .addCase(deleteTournamentJoinAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to reject player.";
            });
},
});

export const { resetTournamentState, clearSelectedTournament } =
    tournamentReducer.actions;

export default tournamentReducer.reducer;
