import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const CreateCertificateByAppName = ({ open, onClose, onCertificateGenerated, selectedApp }) => {
  const [cn, setCn] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [validityDays, setValidityDays] = useState("");
  const [nameCertificate, setNameCertificate] = useState(""); 
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const handleGenerateCertificate = async () => {
    if (!cn || !organization || !country || !validityDays || !nameCertificate) {
      setError("Please fill all the fields.");
      return;
    }

    const dn = `CN=${cn}, O=${organization}, C=${country}`;
    const newCertificate = {
      dn,
      validityDays: Number(validityDays),
      applicationName: selectedApp.name, 
      nameCertificate,
    };

    try {
      const response = await axios.post(
        "http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/certificates/generate-save-certificate",
        newCertificate
      );
      setResponseMessage("Certificate generated successfully");
      onCertificateGenerated(response.data);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error generating certificate:", error);
      setResponseMessage("Error generating certificate: " + (error.response?.data?.message || error.message));
    }
  };

  const handleClose = () => {
    setCn("");
    setOrganization("");
    setCountry("");
    setValidityDays("");
    setNameCertificate(""); 
    setResponseMessage("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate New Certificate</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Common Name (CN)"
          type="text"
          fullWidth
          variant="outlined"
          value={cn}
          onChange={(e) => setCn(e.target.value)}
          error={!cn && error}
          helperText={!cn && error ? "This field is required" : ""}
        />
        <TextField
          margin="dense"
          label="Organization (O)"
          type="text"
          fullWidth
          variant="outlined"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          error={!organization && error}
          helperText={!organization && error ? "This field is required" : ""}
        />
        <TextField
          margin="dense"
          label="Country (C)"
          type="text"
          fullWidth
          variant="outlined"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          error={!country && error}
          helperText={!country && error ? "This field is required" : ""}
        />
        <TextField
          margin="dense"
          label="Validity (days)"
          type="number"
          fullWidth
          variant="outlined"
          value={validityDays}
          onChange={(e) => setValidityDays(e.target.value)}
          error={!validityDays && error}
          helperText={!validityDays && error ? "This field is required" : ""}
        />
        <TextField
          margin="dense"
          label="Certificate Name"
          type="text"
          fullWidth
          variant="outlined"
          value={nameCertificate}
          onChange={(e) => setNameCertificate(e.target.value)}
          error={!nameCertificate && error}
          helperText={!nameCertificate && error ? "This field is required" : ""}
        />

        {responseMessage && (
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ marginTop: 10 }}
          >
            {responseMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleGenerateCertificate}
          style={{
            backgroundColor: '#d32f2f',
            color: '#fff',
          }}
          variant="contained"
        >
          Generate Certificate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCertificateByAppName;
