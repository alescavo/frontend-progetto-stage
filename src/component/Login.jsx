import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import backgroundImage from '../images/Login-Certy-Timeter.png';  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const requestBody = { email, password };

      const response = await axios.post(
        "http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/auth/login-token",
        requestBody
      );

      console.log("Response data:", response.data);

      const token = response.data.token;
      localStorage.setItem("email", email);
      console.log(email);
      localStorage.setItem("token", token);

      if (response.data.role === "ROLE_ADMIN") {
        navigate("/admin-home");
      } else {
        navigate("/user-home");
      }
    } catch (error) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="row" 
      height="100vh"
    >
      <Box
        flex={1}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'left',
        }}
      />

      <Box
        flex={1}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',  
            opacity: 0.4,  
          }}
        />

        <Container maxWidth="sm" style={{ zIndex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '2rem', borderRadius: '8px' }}>
          <Box mt={5}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: '#d32f2f', 
                  color: '#fff',
                }}
              >
                Login
              </Button>
            </form>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
