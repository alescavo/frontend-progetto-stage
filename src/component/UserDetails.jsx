import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Container,
  Avatar,
  Box,
  Alert,
  ButtonGroup,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AlertIcon } from "@chakra-ui/react";

const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
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
      } catch (error) {
        setError("Error loading data");
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  const handleChangePasswordClick = () => {
    navigate("/change-password");
  };

  const fetchUserData = async (token) => {
    try {
      const userResponse = await axios.get(
        "http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/user/user-data",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.data && userResponse.data.email) {
        localStorage.setItem("email", userResponse.data.email);

        console.error("Email not found in user data response");
      }

      navigate("/user-home");
    } catch (error) {
      console.error(
        "Failed to fetch user data:",
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <Container position="relative">
      <Box
        mt={10}
        border={2}
        borderRadius={4}
        borderColor="grey"
        height={120}
        width="auto"
        alignItems="center"
        justifyContent="space-between"
        display="flex"
        gap={2}
        padding={3}
        sx={{
          background:
            "linear-gradient(135deg, rgba(187, 222, 251, 0.7) 0%, rgba(227, 242, 253, 0.7) 100%)",
        }}
      >
        <ButtonGroup>
          <Avatar
            src="/broken-image.jpg"
            sx={{ marginRight: 8, marginLeft: 5, width: 70, height: 70 }}
          />
          <ButtonGroup orientation="vertical" display="flex">
            <Typography variant="h5">
              {userData?.firstName} {userData?.lastName}
            </Typography>

            <Typography fontSize="md" color="black" variant="h5">
              {userData?.email}
            </Typography>
          </ButtonGroup>
        </ButtonGroup>

        <Button
          variant="contained"
          onClick={handleChangePasswordClick}
          sx={{ marginLeft: 8 }}
        >
          Change Password
        </Button>
      </Box>
    </Container>
  );
};

export default UserDetails;
