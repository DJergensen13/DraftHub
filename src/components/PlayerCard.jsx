import { Card, CardContent, Typography, CardActionArea } from "@mui/material";

const PlayerCard = ({ player, onClick, avgRank }) => {
  return (
    <Card
      sx={{
        width: {
          xs: 240,
          sm: 280,
          md: 320,
        },
        margin: 1.5,
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={() => onClick(player)}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {avgRank !== undefined && ` Avg Rank: ${avgRank.toFixed(1)}`}
          </Typography>
          <Typography variant="h5">{player.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {player.currentTeam} | {player.league}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PlayerCard;
