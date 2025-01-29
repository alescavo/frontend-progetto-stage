import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select, 
  Box
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import Icon from "@mui/material/Icon";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BackButton from "./BackButton";
import pageBackground from "../images/pageGeneral.png";
import PasswordChecklist from "react-password-checklist";
import logo from "../images/certy-timeter.png";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/user/find-All");
      setUsers(response.data);
    } catch (error) {
      setError("Unable to fetch users.");
    }
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
    setPassword(""); 
    setPasswordValid(false); 
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleSaveUser = async (user) => {
    try {
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        password: password 
      };

      if (user.id) {
        await axios.put(`http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/user/edit/${user.id}`, userData);
        setSnackbarMessage("User updated successfully!");
      } else {
        await axios.post("http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/user/save-update", userData);
        setSnackbarMessage("User added successfully!");
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      setSnackbarMessage("Error saving user.");
    }
    setSnackbarOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://k8s-appgroup-60553c07aa-648483830.us-east-1.elb.amazonaws.com/user/delete/${selectedUser.id}`);
      fetchUsers();
      setSnackbarMessage("User deleted successfully!");
    } catch (error) {
      setSnackbarMessage("Error deleting user.");
    }
    setSnackbarOpen(true);
    handleCloseDeleteDialog();
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedUser(null);
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${pageBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "fixed",
        height: "100vh",
        width: "100%",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: "#d32f2f" }}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Users Management
          </Typography>
          <IconButton color="inherit" onClick={() => handleOpenDialog(null)}>
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
          mt: 7,
          padding: 4,
          backgroundColor: "rgba(255, 255, 255, 0)",
          height: "calc(100vh - 80px)",
          overflow: "hidden",
          backdropFilter: "none",
        }}
      >
        {error && <Alert severity="error">{error}</Alert>}
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
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  Last Name
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  Role
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(user)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              value={selectedUser ? selectedUser.firstName : ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstName: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
              value={selectedUser ? selectedUser.lastName : ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastName: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={selectedUser ? selectedUser.role : ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
              >
                <MenuItem value="ROLE_USER">ROLE_USER</MenuItem>
                <MenuItem value="ROLE_ADMIN">ROLE_ADMIN</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={selectedUser ? selectedUser.email : ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital"]}
              minLength={8}
              value={password}
              onChange={(isValid) => setPasswordValid(isValid)} // Track password validity
              messages={{
                minLength: "Password must be at least 8 characters.",
                specialChar: "Password must contain at least one special character.",
                number: "Password must contain at least one number.",
                capital: "Password must contain at least one uppercase letter.",
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: "primary" }}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveUser(selectedUser)}
              sx={{ backgroundColor: "green", color: "white" }}
              disabled={!passwordValid} // Disable button if password is not valid
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the user {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} sx={{ color: "primary" }}>
              Cancel
            </Button>
            <Button color="white" onClick={handleDeleteUser} sx={{backgroundColor: "#d32f2f", color:"white"}}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <BackButton />
      </Paper>
    </div>
  );
};

export default UsersList;
