import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Box,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import Icon from "@mui/material/Icon";
import CreateCertificate from "./CreateCertificate";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BackButton from "./BackButton";
import backgroundImage from '../images/pageGeneral.png';
import RefreshIcon from '@mui/icons-material/Refresh';
import logo from "../images/certy-timeter.png"

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [applications, setApplications] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [certificateContent, setCertificateContent] = useState("");
  const [openNewCertificateDialog, setOpenNewCertificateDialog] = useState(false);
  const [openRenewDialog, setOpenRenewDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [daysToAdd, setDaysToAdd] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchCertificatesAndApplications = async () => {
      try {
        const certificatesResponse = await axios.get(
          "http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/certificates/all"
        );
        setCertificates(certificatesResponse.data);

        const applicationsResponse = await axios.get(
          "http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/applications/findAll-name"
        );
        const appsMap = {};
        applicationsResponse.data.forEach((app) => {
          appsMap[app.id] = app.name;
        });
        setApplications(appsMap);
      } catch (error) {
        console.error("Error fetching certificates or applications:", error);
      }
    };

    fetchCertificatesAndApplications();
  }, []);

  const isCertificateValid = (validFrom, validUntil) => {
    const now = new Date();
    const validFromDate = new Date(validFrom);
    const validUntilDate = new Date(validUntil);
    return now >= validFromDate && now <= validUntilDate;
  };

  const handleDownload = (certId) => {
    const url = `http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/certificates/${certId}/download`;
    window.open(url, "_blank");
  };

  const handleDownloadPrivateKey = (certId) => {
    const url = `http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/certificates/${certId}/private-key/download`;
    window.open(url, "_blank");
  };



  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCertificateContent("");
  };

  const handleOpenNewCertificateDialog = () => {
    setOpenNewCertificateDialog(true);
  };

  const handleCloseNewCertificateDialog = () => {
    setOpenNewCertificateDialog(false);
  };

  const handleCertificateGenerated = (newCertificate) => {
    setCertificates([...certificates, newCertificate]);
  };

  const handleOpenRenewDialog = (certificate) => {
    setSelectedCertificate(certificate);
    setDaysToAdd(0);
    setOpenRenewDialog(true);
  };

  const handleCloseRenewDialog = () => {
    setOpenRenewDialog(false);
    setSelectedCertificate(null);
    setDaysToAdd(0);
  };

  const handleRenewCertificate = async () => {
    if (daysToAdd <= 0) {
      setSnackbarMessage("Please enter a valid number of days.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const currentValidUntil = new Date(selectedCertificate.validUntil);
      const newValidUntil = new Date(currentValidUntil);
      newValidUntil.setDate(newValidUntil.getDate() + daysToAdd);

      const newCertificate = {
        ...selectedCertificate,
        id: certificates.length + 1,
        validUntil: newValidUntil.toISOString().split('T')[0],
      };

      setCertificates((prev) => [...prev, newCertificate]);
      setSnackbarMessage("Certificate renewed successfully!");
      setSnackbarOpen(true);
      handleCloseRenewDialog();
    } catch (error) {
      console.error("Error renewing certificate:", error);
      setSnackbarMessage("Error renewing certificate.");
      setSnackbarOpen(true);
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
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#d32f2f" }}>

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
              <HomeIcon sx={{ marginRight: 1 }} color="inherit" />
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Certificates Management
            </Typography>

            <IconButton color="inherit" onClick={handleOpenNewCertificateDialog}>
              <Icon
                baseClassName="fas"
                className="fa-plus-circle"
                sx={{ fontSize: 30 }}
              >
                +
              </Icon>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Paper
          sx={{
            margin: 2,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            zIndex: 1
          }}>
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 150px)",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#FBE9E7",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#d32f2f",
                border: "2px solid #FBE9E7",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            <Table
              sx={{
                border: "2px solid #d32f2f",
                "& thead th": {
                  backgroundColor: "#d32f2f",
                  color: "white",
                  fontWeight: "bold",
                },
                "& tbody tr": {
                  background: "rgba(255, 255, 255, 0.9)",
                },
              }}
              stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ color: "white", fontWeight: "bold" }}>
                    <Typography variant="h6">Name</Typography>
                  </TableCell>
                  <TableCell align="center" style={{ color: "white", fontWeight: "bold" }}>
                    <Typography variant="h6">Subject</Typography>
                  </TableCell>
                  <TableCell align="center" style={{ color: "white", fontWeight: "bold" }}>
                    <Typography variant="h6" align="center">App Name</Typography>
                  </TableCell>
                  <TableCell align="center" style={{ color: "white", fontWeight: "bold" }}>
                    <Typography variant="h6">Valid From</Typography>
                  </TableCell>
                  <TableCell align="center" style={{ color: "white", fontWeight: "bold" }}>
                    <Typography variant="h6">Valid Until</Typography>
                  </TableCell>
                  <TableCell align="center" style={{ color: "white", fontWeight: "bold" }}>
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                  <TableCell align="center" style={{ color: "white", fontWeight: "bold" }}>
                    <Typography variant="h6">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No certificates available
                    </TableCell>
                  </TableRow>
                ) : (
                  certificates.map((certificate) => {
                    return (
                      <TableRow key={certificate.id}>

                        <TableCell>{certificate.certificateName}</TableCell>
                        <TableCell>{certificate.subject}</TableCell>
                        <TableCell>
                          {certificate.applicationId
                            ? applications[certificate.applicationId] || "Unknown"
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {new Date(certificate.validFrom).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(certificate.validUntil).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {isCertificateValid(
                            certificate.validFrom,
                            certificate.validUntil
                          ) ? (
                            <CheckCircleIcon sx={{ color: "green" }} />
                          ) : (
                            <CancelIcon sx={{ color: "red" }} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownload(certificate.id)}
                            sx={{ ml: 1 }}
                          >
                            <DownloadIcon sx={{ marginRight: 0.5 }} />
                            Crt
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownloadPrivateKey(certificate.id)}
                            sx={{ ml: 1 }}
                          >
                            <DownloadIcon sx={{ marginRight: 0.5 }} />
                            PrivateKey
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenRenewDialog(certificate)}
                            sx={{ ml: 1 }}
                          >
                            <RefreshIcon sx={{ marginRight: 1 }} />
                            Renew
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Digital Certificate</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {certificateContent || "No certificate content available"}
              </pre>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openRenewDialog} onClose={handleCloseRenewDialog} maxWidth="md" >
          <DialogTitle >Renew Certificate</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Days"
                type="string"
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(Number(e.target.value))}
                fullWidth
                sx={{ ml: 1 }}
                inputProps={{ min: 1 }}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRenewDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRenewCertificate} variant="contained" à
              sx={{
                ml: 1,
                backgroundColor: '#00e676',
                '&:hover': { backgroundColor: 'darkgreen' }
              }}>
              Renew
            </Button>
          </DialogActions>
        </Dialog>

        <CreateCertificate
          open={openNewCertificateDialog}
          onClose={handleCloseNewCertificateDialog}
          onCertificateGenerated={handleCertificateGenerated}
        />
        <BackButton />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default CertificatesPage;
