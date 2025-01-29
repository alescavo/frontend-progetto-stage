import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const DeleteApp = ({ open, onClose, apps, removeApp }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setConfirmDelete(true);
  };

  const handleDeleteApp = async () => {
    if (!selectedApp) {
      setSnackbarMessage("No app selected for deletion.");
      setAlertSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.delete(
        `http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/applications/delete/${selectedApp.name}`
      );

      if (response.status === 200) {
        removeApp(selectedApp.name);
        setSnackbarMessage("Application deleted successfully!");
        setAlertSeverity("success");

        window.location.reload();
      } else {
        setSnackbarMessage(
          "Failed to delete application: Unexpected status code " +
            response.status
        );
        setAlertSeverity("error");
      }
    } catch (error) {
      console.error("Error deleting application:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        setSnackbarMessage(
          "Error deleting application: " +
            (error.response.data?.message ||
              error.response.statusText ||
              "Unknown error")
        );
      } else if (error.request) {
        console.error("No response from server:", error.request);
        setSnackbarMessage(
          "Error deleting application: No response from server."
        );
      } else {
        console.error("Error message:", error.message);
        setSnackbarMessage("Error deleting application: " + error.message);
      }
      setAlertSeverity("error");
    }

    setSnackbarOpen(true);
    setConfirmDelete(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Select Application to Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the application you want to delete:
          </DialogContentText>
          <List>
            {apps.length > 0 ? (
              apps.map((app) => (
                <ListItem
                  button
                  key={app.id}
                  onClick={() => handleSelectApp(app)}
                >
                  <ListItemText primary={app.name} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No applications available." />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the application {selectedApp?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteApp} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={alertSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteApp;
