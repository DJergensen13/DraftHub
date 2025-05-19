import { useState } from "react";
import players from "./data/intern_project_data.json";
import PlayerCard from "./components/PlayerCard";
import PlayerProfile from "./components/PlayerProfile";
import { Box, Grid } from "@mui/material";

function App() {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);

  const rankingsMap = players.scoutRankings.reduce((acc, ranking) => {
    const values = Object.entries(ranking)
      .filter(([key, val]) => key !== "playerId" && typeof val === "number")
      .map(([, val]) => val);
    const avg =
      values.length > 0
        ? values.reduce((sum, v) => sum + v, 0) / values.length
        : null;

    acc[ranking.playerId] = avg;
    return acc;
  }, {});

  // Create detailed scout rankings map
  const scoutRankingsMap = players.scoutRankings.reduce((acc, ranking) => {
    acc[ranking.playerId] = ranking;
    return acc;
  }, {});

  // Create sorted players list based on average rank
  const sortedPlayers = [...players.bio].sort(
    (a, b) =>
      (rankingsMap[a.playerId] ?? Infinity) -
      (rankingsMap[b.playerId] ?? Infinity)
  );

  // Initialize scouting reports
  const [scoutingReports, setScoutingReports] = useState(
    players.scoutingReports
  );

  // Selected player object from sorted list
  const selectedPlayer =
    selectedPlayerIndex !== null ? sortedPlayers[selectedPlayerIndex] : null;

  // Select player based on sorted order
  const handlePlayerSelect = (player) => {
    const index = sortedPlayers.findIndex(
      (p) => p.playerId === player.playerId
    );
    setSelectedPlayerIndex(index);
  };

  const goToPrevPlayer = () => {
    setSelectedPlayerIndex((prev) =>
      prev > 0 ? prev - 1 : sortedPlayers.length - 1
    );
  };

  const goToNextPlayer = () => {
    setSelectedPlayerIndex((prev) =>
      prev < sortedPlayers.length - 1 ? prev + 1 : 0
    );
  };

  const handleAddScoutingReport = (newReport) => {
    setScoutingReports((prevReports) => [newReport, ...prevReports]);
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#00538C" }}>
      <Grid container spacing={1} justifyContent="center">
        {sortedPlayers.map((player) => (
          <Grid item key={player.playerId}>
            <PlayerCard
              player={player}
              onClick={handlePlayerSelect}
              avgRank={rankingsMap[player.playerId]}
            />
          </Grid>
        ))}
      </Grid>

      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer}
          onClose={() => setSelectedPlayerIndex(null)}
          onPrev={goToPrevPlayer}
          onNext={goToNextPlayer}
          scoutingReports={scoutingReports}
          gameLogs={players.game_logs}
          seasonLogs={players.seasonLogs}
          onAddScoutingReport={handleAddScoutingReport}
          scoutRankings={scoutRankingsMap[selectedPlayer?.playerId]}
        />
      )}
    </Box>
  );
}

export default App;
