import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const CreateCertificate = ({ open, onClose, onCertificateGenerated }) => {
  const [cn, setCn] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [validityDays, setValidityDays] = useState("");
  const [nameCertificate, setNameCertificate] = useState(""); // Added state for certificate name
  const [applications, setApplications] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/applications/findAll-name");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Error fetching applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleGenerateCertificate = async () => {
    if (!cn || !organization || !country || !validityDays || selectedApplications.length === 0 || !nameCertificate) {
      setError("Please fill all the fields and select at least one application.");
      return;
    }

    const dn = `CN=${cn}, O=${organization}, C=${country}`;
    const newCertificate = {
      dn,
      validityDays: Number(validityDays),
      applicationName: selectedApplications[0], 
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
    setNameCertificate(""); // Reset certificate name
    setSelectedApplications([]);
    setResponseMessage("");
    setError("");
    onClose();
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedApplications(value);
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

        <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
          <InputLabel id="select-applications-label">Select Applications</InputLabel>
          <Select
            labelId="select-applications-label"
            multiple
            value={selectedApplications}
            onChange={handleSelectChange}
            renderValue={(selected) => selected.join(", ")}
            label="Select Applications"
          >
            {applications.map((app) => (
              <MenuItem key={app.name} value={app.name}>
                <Checkbox checked={selectedApplications.indexOf(app.name) > -1} />
                <ListItemText primary={app.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

export default CreateCertificate;
