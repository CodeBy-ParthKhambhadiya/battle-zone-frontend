import { useDispatch, useSelector } from "react-redux";
import {
  fetchTournamentsAction,
  createTournamentAction,
  fetchTournamentByIdAction,
  joinTournamentAction,
  fetchTournamentJoinDetails,
  cancelJoinTournamentAction, // ✅ still imported
} from "@/store/actions/tournament.action";

const useTournament = () => {
  const dispatch = useDispatch();

  // Access tournament state
  const { tournaments,joinDetails, selectedTournament, loading, error, success } =
    useSelector((state) => state.tournament);

  // Fetch all tournaments
  const fetchTournaments = async () => {
    return await dispatch(fetchTournamentsAction());
  };

  // Fetch single tournament by ID
  const fetchTournamentById = async (id) => {
    return await dispatch(fetchTournamentByIdAction(id));
  };

  // Create new tournament
  const createTournament = async (data) => {
    return await dispatch(createTournamentAction(data));
  };

  // Join a tournament
  const joinTournament = async ({ tournamentId, playerId }) => {
    return await dispatch(joinTournamentAction({ tournamentId, playerId }));
  };

  const fetchJoinDetails = async () => {
    return await dispatch(fetchTournamentJoinDetails());
  };

  const cancelJoinTournament = async (joinId) => {
    return await dispatch(cancelJoinTournamentAction({ joinId }));
  };

  return {
    tournaments,
    joinDetails,
    selectedTournament,
    loading,
    error,
    success,
    fetchTournaments,
    fetchTournamentById,
    createTournament,
    joinTournament,
    fetchJoinDetails,
    cancelJoinTournament
  };
};

export default useTournament;
