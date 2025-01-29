import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate(-1)}
      sx={{
        position: "fixed",
        bottom: 20,
        left: 20,
        backgroundColor: "white", 
        color: 'black', 
        "&:hover": {
          backgroundColor: "warning.dark", 
        },
      }}
    >
      <ArrowBackIcon />
      <Typography variant="button" sx={{ marginLeft: 1 }}>
        Back
      </Typography>
    </Button>
  );
};

export default BackButton;
