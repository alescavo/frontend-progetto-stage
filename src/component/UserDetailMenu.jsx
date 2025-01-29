import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material"; 
import { useNavigate } from "react-router-dom";

const UserDetailsMenu = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/user/user-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (err) {
        setError("Error loading data");
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePasswordClick = () => {
    navigate("/change-password");
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleAvatarClick}>
        <AccountCircle sx={{color: "white", marginRight: 2, width: 40, height: 40 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 250,
          },
        }}
      >
        {error ? (
          <MenuItem>
            <Typography color="error">Error loading data</Typography>
          </MenuItem>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={2}
          >
            <AccountCircle sx={{ width: 70, height: 70, mb: 2 }} />
            <Typography variant="h6">
              {userData?.firstName} {userData?.lastName}
            </Typography>
            <Typography color="textSecondary">
              {userData?.email}
            </Typography>

            <Button
              variant="contained"
              onClick={handleChangePasswordClick}
              sx={{ mt: 2 }}
              style={{
                  backgroundColor: '#d32f2f', 
                  color: '#fff',
                }}
            >
              Change Password
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default UserDetailsMenu;
