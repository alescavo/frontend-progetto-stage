import {
  Card,
  CardContent,
  Typography,
  Grid2,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import axios from "axios";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CreateCertificateByAppName from './CreateCertificateByAppName'; 

const AppListAdmin = () => {
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [openCertificateDialog, setOpenCertificateDialog] = useState(false);

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

  const handleNavigate = (appId) => {
    console.log("Navigating to certificates for app ID:", appId);
    navigate(`/certificate/${appId}`);
  };

  const handleOpenDialog = (app) => {
    setSelectedApp(app);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApp(null);
  };

  const handleRemoveApp = async () => {
    if (!selectedApp) return;

    try {
      await axios.delete(`http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/applications/delete/${selectedApp.name}`);
      fetchApps();
    } catch (error) {
      console.error("Error deleting application:", error.message);
      setError("Unable to delete application. Please try again later.");
    }
    handleCloseDialog();
  };

  const handleOpenCertificateDialog = (app) => {
    setSelectedApp(app);
    setOpenCertificateDialog(true);
  };

  const handleCloseCertificateDialog = () => {
    setOpenCertificateDialog(false);
    setSelectedApp(null);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <Grid2
      container
      spacing={2}
      justifyContent="center"
      mt={2}
      alignItems="center"
      style={{ minHeight: "50vh" }}
    >
      {error && (
        <Grid2 item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid2>
      )}
      {apps.map((app) => (
        <Grid2 item xs={12} sm={4} key={app.id}>
          <Card
            onClick={() => handleNavigate(app.id)}
            sx={{
              border: "2px solid #d32f2f",
              borderRadius: "8px",
              height: "250px",
              width: "200px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease, background-color 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#FBE9E7",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <img
                src={logo}
                alt="App logo"
                style={{
                  width: 120,
                  height: 100,
                  display: "block",
                  margin: "0 auto 8px",
                }}
              />
              <Typography variant="h5" component="div" align="center">
                {app.name}
              </Typography>
              <Box display="flex" justifyContent="center" mt={1}>
                <IconButton
                  aria-label="add"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCertificateDialog(app); 
                  }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDialog(app);
                  }}
                  sx={{ marginLeft: 1 }} 
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      ))}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the application {selectedApp ? selectedApp.name : ''}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveApp} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <CreateCertificateByAppName
        open={openCertificateDialog}
        onClose={handleCloseCertificateDialog}
        onCertificateGenerated={() => fetchApps()} 
        selectedApp={selectedApp} 
      />
    </Grid2>
  );
};

export default AppListAdmin;
