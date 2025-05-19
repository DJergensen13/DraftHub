import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CardMedia,
  Card,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const PlayerProfile = ({
  player,
  onClose,
  onPrev,
  onNext,
  scoutingReports,
  gameLogs,
  seasonLogs,
  onAddScoutingReport,
  scoutRankings,
}) => {
  const [newScoutName, setNewScoutName] = useState("");
  const [newReportText, setNewReportText] = useState("");
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  useEffect(() => {
    if (!player) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [player]);

  if (!player) return null;

  const playerReports = scoutingReports.filter(
    (r) => r.playerId === player.playerId
  );

  const playerGames = gameLogs?.filter((g) => g.playerId === player.playerId);
  const playerSeasonLogs = seasonLogs?.filter(
    (s) => s.playerId === player.playerId
  );

  const scoutRanks = scoutRankings || {};
  const rankValues = Object.entries(scoutRanks)
    .filter(
      ([key, val]) => key !== "playerId" && typeof val === "number" && val > 0
    )
    .map(([, val]) => val);
  const avgRank =
    rankValues.length > 0
      ? rankValues.reduce((sum, val) => sum + val, 0) / rankValues.length
      : null;

  const avg = (field) =>
    playerGames && playerGames.length > 0
      ? (
          playerGames.reduce((sum, g) => sum + (g[field] || 0), 0) /
          playerGames.length
        ).toFixed(1)
      : "N/A";

  const stats = {
    ppg: avg("pts"),
    fg: avg("fg%"),
    reb: avg("reb"),
    blk: avg("blk"),
    stl: avg("stl"),
  };

  const handleAddReport = () => {
    if (!newScoutName.trim() || !newReportText.trim()) return;
    const newReport = {
      playerId: player.playerId,
      scout: newScoutName.trim(),
      report: newReportText.trim(),
    };
    onAddScoutingReport(newReport);
    setNewScoutName("");
    setNewReportText("");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
        p: 2,
      }}
      onClick={onClose}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: { xs: 400, sm: 500, md: 700 },
          minWidth: 320,
          px: { xs: 3, sm: 6 },
          py: 3,
          borderRadius: 3,
          position: "relative",
          boxShadow: 5,
          bgcolor: "#fff",
          overflow: "hidden",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            backgroundColor: "#f0f0f0",
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#555",
            backgroundColor: "#f0f0f0",
            zIndex: 2,
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#555",
            backgroundColor: "#f0f0f0",
            zIndex: 2,
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "90vh",
            pt: 1,
            pr: 2,
            pl: 2,
            pb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {player.name}
          </Typography>

          {player.photoUrl && (
            <CardMedia
              component="img"
              image={player.photoUrl}
              alt={player.name}
              sx={{
                width: { xs: "45%", sm: "50%", md: "55%" },
                height: { xs: 300, sm: 350, md: 450 },
                objectFit: "cover",
                mb: 2,
                borderRadius: 2,
                mx: "auto",
              }}
            />
          )}

          <Typography variant="body1" gutterBottom>
            Height: {player.height}" | Weight: {player.weight} lbs
          </Typography>
          <Typography variant="body1" gutterBottom>
            Team: {player.currentTeam}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Hometown: {player.homeTown}, {player.homeCountry}
          </Typography>

          <Button
            variant="outlined"
            onClick={() => setShowAdvancedStats((prev) => !prev)}
            sx={{ mt: 3, mb: 2 }}
          >
            {showAdvancedStats ? "Show Season Averages" : "Show Game Logs"}
          </Button>

          {!showAdvancedStats ? (
            <>
              <Typography variant="h6" gutterBottom>
                Season Averages
              </Typography>
              {playerSeasonLogs && playerSeasonLogs.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                  <Typography>
                    <strong>Season:</strong>{" "}
                    {playerSeasonLogs[0].Season ||
                      playerSeasonLogs[0].season ||
                      "N/A"}
                  </Typography>
                  <Typography>
                    GP:{" "}
                    {playerSeasonLogs[0].GP || playerSeasonLogs[0].gp || "N/A"}{" "}
                    | PTS:{" "}
                    {playerSeasonLogs[0].PTS ||
                      playerSeasonLogs[0].pts ||
                      stats.ppg}{" "}
                    | AST:{" "}
                    {playerSeasonLogs[0].AST ||
                      playerSeasonLogs[0].ast ||
                      "N/A"}{" "}
                    | REB:{" "}
                    {playerSeasonLogs[0].TRB ||
                      playerSeasonLogs[0].trb ||
                      stats.reb}
                  </Typography>
                  <Typography>
                    FG%:{" "}
                    {playerSeasonLogs[0]["FG%"] ||
                      playerSeasonLogs[0]["fg%"] ||
                      stats.fg}{" "}
                    | STL:{" "}
                    {playerSeasonLogs[0].STL ||
                      playerSeasonLogs[0].stl ||
                      stats.stl}{" "}
                    | BLK:{" "}
                    {playerSeasonLogs[0].BLK ||
                      playerSeasonLogs[0].blk ||
                      stats.blk}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Typography>
                    GP: N/A | PTS: {stats.ppg} | AST: N/A | REB: {stats.reb}
                  </Typography>
                  <Typography>
                    FG%: {stats.fg} | STL: {stats.stl} | BLK: {stats.blk}
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Game Logs
              </Typography>
              {playerGames && playerGames.length > 0 ? (
                playerGames.map((log, i) => (
                  <Box
                    key={i}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Typography>
                      <strong>Date:</strong>{" "}
                      {log.date
                        ? new Date(log.date).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Matchup:</strong> {log.team || "N/A"} vs{" "}
                      {log.opponent || "N/A"}
                    </Typography>
                    <Typography>
                      MP: {log.timePlayed || log.mp || "N/A"} | PTS:{" "}
                      {log.pts || "N/A"} | AST: {log.ast || "N/A"} | REB:{" "}
                      {log.reb || "N/A"}
                    </Typography>
                    <Typography>
                      FG%: {log["fg%"] || "N/A"} | 3P%:{" "}
                      {log["3p%"] || log["tp%"] || "N/A"} | FT%:{" "}
                      {log["ft%"] || "N/A"} | STL: {log.stl || "N/A"} | BLK:{" "}
                      {log.blk || "N/A"}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No game logs available.</Typography>
              )}
            </>
          )}

          {avgRank !== null && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Scout Rankings (Avg: {avgRank.toFixed(1)})
              </Typography>
              {Object.entries(scoutRanks)
                .filter(
                  ([key, val]) => key !== "playerId" && typeof val === "number"
                )
                .map(([scout, rank], idx) => {
                  const diff = rank - avgRank;
                  const color =
                    diff <= -3 ? "green" : diff >= 3 ? "red" : "gray";

                  return (
                    <Typography key={idx} sx={{ color }}>
                      {scout}: {rank}
                      {color === "green" && " (High on player)"}
                      {color === "red" && " (Low on player)"}
                    </Typography>
                  );
                })}
            </Box>
          )}

          {playerReports.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Scout Reports
              </Typography>
              {playerReports.map((r, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {r.scout}
                  </Typography>
                  <Typography variant="body2">{r.report}</Typography>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add New Scouting Report
            </Typography>
            <TextField
              label="Scout Name"
              value={newScoutName}
              onChange={(e) => setNewScoutName(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Report"
              value={newReportText}
              onChange={(e) => setNewReportText(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="dense"
            />
            <Button
              variant="contained"
              onClick={handleAddReport}
              sx={{ mt: 1 }}
              disabled={!newScoutName.trim() || !newReportText.trim()}
            >
              Add Report
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default PlayerProfile;
