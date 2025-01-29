import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import BackButton from "./BackButton";
import backgroundImage from '../images/changePassword.png';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isPasswordValid) {
      setError("Password does not meet the criteria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const email = localStorage.getItem("email");

    if (!email) {
      setError("Email not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/user/change-password",
        {
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }
      );

      if (response.status === 200) {
        setSuccess("Password changed successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("Failed to change password. Please try again.");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'fixed',
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: 10,
          height: '70vh',
          zIndex: 1,
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              padding: 2,
              backdropFilter: 'blur(8px)',
              marginBottom: 5
            }}
          >
            <Typography variant="h5" gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Old Password"
                type={showOldPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        edge="end"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital", "match"]}
                minLength={8}
                value={newPassword}
                valueAgain={confirmPassword}
                onChange={(isValid) => setIsPasswordValid(isValid)}
              />

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="primary" variant="body2">
                  {success}
                </Typography>
              )}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ marginTop: "20px" }}
                style={{
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                }}
              >
                Change Password
              </Button>
            </form>
          </Box>
        </Container>

        <BackButton />
      </Box>
    </>
  );
};

export default ChangePassword;
