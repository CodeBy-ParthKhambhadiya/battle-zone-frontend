import { useDispatch, useSelector } from "react-redux";
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
    updateTournamentAction, // ✅ new
    deleteTournamentAction,
    fetchPendingPlayersByTournament, // ✅ optional
} from "@/store/actions/tournament.action";

const useTournament = () => {
    const dispatch = useDispatch();

    const {
        tournaments,
        joinDetails,
        selectedTournament,
        tournamentChats,
        tournamentChatById,
        pendingPlayers,
        loading,
        error,
        success,
        organizerTournaments,
    } = useSelector((state) => state.tournament);

    // ✅ Fetch all tournaments
    const fetchTournaments = async () => {
        return await dispatch(fetchTournamentsAction());
    };

    // ✅ Fetch single tournament by ID
    const fetchTournamentById = async (id) => {
        return await dispatch(fetchTournamentByIdAction(id));
    };

    // ✅ Fetch all organizer tournaments
    const fetchOrganizerTournamentsList = async () => {
        return await dispatch(fetchOrganizerTournaments());
    };

    const fetchTournamentsPendingPlayerList = async () => {
        return await dispatch(fetchPendingPlayersByTournament());
    };

    // ✅ Create a new tournament
    const createTournament = async (data) => {
        return await dispatch(createTournamentAction(data));
    };

    // ✅ Update a tournament
    const updateTournament = async ({ tournamentId, formData }) => {
        return await dispatch(updateTournamentAction({ tournamentId, formData }));
    };

    // ✅ Delete a tournament (optional)
    const deleteTournament = async (tournamentId) => {
        return await dispatch(deleteTournamentAction({ tournamentId }));
    };

    // ✅ Join a tournament
    const joinTournament = async ({ tournamentId, playerId }) => {
        return await dispatch(joinTournamentAction({ tournamentId, playerId }));
    };

    // ✅ Fetch join details
    const fetchJoinDetails = async () => {
        return await dispatch(fetchTournamentJoinDetails());
    };

    // ✅ Cancel join
    const cancelJoinTournament = async (joinId) => {
        return await dispatch(cancelJoinTournamentAction({ joinId }));
    };

    // ✅ Fetch all chats
    const fetchAllTournamentChats = async () => {
        return await dispatch(fetchAllTournamentChatsAction());
    };

    // ✅ Fetch chat by tournament ID
    const fetchTournamentChatsById = async (tournamentId) => {
        return await dispatch(fetchTournamentChatsByIdAction(tournamentId));
    };

    // ✅ Send chat message
    const sendTournamentMessage = async ({ tournamentId, message }) => {
        return await dispatch(sendTournamentMessageAction({ tournamentId, message }));
    };

    return {
        tournaments,
        joinDetails,
        selectedTournament,
        tournamentChats,
        tournamentChatById,
        organizerTournaments,
        pendingPlayers,
        loading,
        error,
        success,

        // All exposed actions
        fetchAllTournamentChats,
        fetchTournaments,
        fetchTournamentById,
        createTournament,
        updateTournament,
        deleteTournament,
        joinTournament,
        fetchJoinDetails,
        cancelJoinTournament,
        fetchTournamentChatsById,
        sendTournamentMessage,
        fetchOrganizerTournamentsList,
        fetchTournamentsPendingPlayerList,
    };
};

export default useTournament;
