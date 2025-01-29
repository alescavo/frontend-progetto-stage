import { useNavigate } from "react-router-dom";
import { Grid2, Card, CardContent, Typography, ButtonBase } from "@mui/material";
import applications from "../images/applications.png";
import users from "../images/users.png";
import certificates from "../images/certificateLogo.png";

const NavigationMenu = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Grid2
      container
      spacing={5} 
      justifyContent="center"
      mt={1}
      alignItems="center"
      style={{ minHeight: "50vh" }}
    >
      <Grid2 item xs={12} sm={4}>
        <ButtonBase
          onClick={() => handleNavigate("/applications")}
          style={{ width: "100%" }}
        >
          <Card
            sx={{
              border: "2px solid #d32f2f",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              height: "250px",
              width: "200px",
              margin: "0 auto",
              transition: "transform 0.3s ease, background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#FBE9E7",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <img
                src={applications}
                alt="Applications"
                style={{
                  width: 140,
                  height: 120,
                  display: "block",
                  margin: "0 auto 8px",
                }}
              />
              <Typography variant="h5">Applications</Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      </Grid2>

      <Grid2 item xs={12} sm={4}>
        <ButtonBase
          onClick={() => handleNavigate("/users")}
          style={{ width: "100%" }}
        >
          <Card
            sx={{
              border: "2px solid #d32f2f",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              height: "250px",
              width: "200px",
              margin: "0 auto",
              transition: "transform 0.3s ease, background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#FBE9E7",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <img
                src={users}
                alt="Users"
                style={{
                  width: 120,
                  height: 120,
                  display: "block",
                  margin: "0 auto 8px",
                }}
              />
              <Typography variant="h5">Users</Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      </Grid2>

      <Grid2 item xs={12} sm={4}>
        <ButtonBase
          onClick={() => handleNavigate("/certificates")}
          style={{ width: "100%" }}
        >
          <Card
            sx={{
              border: "2px solid #d32f2f",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              height: "250px",
              width: "200px",
              margin: "0 auto",
              transition: "transform 0.3s ease, background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#FBE9E7",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <img
                src={certificates}
                alt="Certificates"
                style={{
                  width: 140,
                  height: 120,
                  display: "block",
                  margin: "0 auto 8px",
                }}
              />
              <Typography variant="h5">Certificates</Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      </Grid2>
    </Grid2>
  );
};

export default NavigationMenu;
