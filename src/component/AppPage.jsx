import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom"; 
import HomeIcon from "@mui/icons-material/Home";
import CreateApp from "./CreateApp";
import DeleteApp from "./DeleteApp";
import { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "./BackButton";
import backgroundImage from '../images/pageGeneral.png'; 
import AppListAdmin from "./AppListAdmin";
import logo from "../images/certy-timeter.png"

const AppPage = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchApps = async () => {
    try {
      const response = await axios.get(
        "http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/applications/findAll-name"
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setApps(response.data);
    } catch (error) {
      console.error(
        "Error fetching applications:",
        error.response ? error.response.data : error.message
      );
      setError("Unable to fetch applications. Please try again later.");
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleAddApp = async (newApp) => {
    try {
      await fetchApps();
      setSnackbarMessage("Application created successfully!");
      setSnackbarSeverity("success");
      window.location.reload();
    } catch (error) {
      setSnackbarMessage("Error creating application.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleRemoveApp = async (appName) => {
    try {
      await axios.delete(
        `http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/applications/delete/${appName}`
      );
      await fetchApps();
      setSnackbarMessage("Application deleted successfully!");
      setSnackbarSeverity("success");
      window.location.reload();
    } catch (error) {
      setSnackbarMessage("Error deleting application.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
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
          overflow: 'hidden'
        }}
      />

      <AppBar 
        position="fixed"  
        sx={{
          backgroundColor: '#d32f2f', 
          width: '100%', 
          zIndex: 1000, 
        }}
      >
        <Toolbar>
        <Box
            component="img"
            src={logo} 
            alt="Logo"
            sx={{
              height: 50, 
              marginRight: 2,
            }}
          />
          <Button color="inherit" component={Link} to="/admin-home">
            <HomeIcon sx={{ marginRight: 1 }} />
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Application Management
          </Typography>

          <Button color="inherit" onClick={() => setOpenCreateDialog(true)}>
            Create
          </Button>
          <Button color="inherit" onClick={() => setOpenDeleteDialog(true)}>
            Delete
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: '64px' }} />

      <Container sx={{ position: 'relative', zIndex: 1, overflow: 'hidden'}}>
        <CreateApp
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          addApp={handleAddApp}
        />

        <DeleteApp
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          apps={apps}
          removeApp={handleRemoveApp}
        />

        <AppListAdmin apps={apps} />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ backgroundColor: 'red' }} 
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <BackButton />
      </Container>
    </>
  );
};

export default AppPage;
