import { Typography, AppBar, Toolbar, Box, IconButton } from "@mui/material";
import NavigationMenu from "./NavigationMenu";
import Logout from "./Logout";
import backgroundImage from '../images/home.png';
import UserDetailsMenu from "./UserDetailMenu";
import logo from '../images/certy-timeter.png'; 

const AdminHome = () => {
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
          overflow: 'hidden',
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
              height: 65, 
              marginRight: 2,
            }}
          />

          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Admin Home
          </Typography>
          
          <IconButton
            sx={{ color: 'white' }}
            edge="end"
          >
            <UserDetailsMenu />
          </IconButton>
          <Logout />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          padding: 10,
          overflowY: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <NavigationMenu />
      </Box>
    </>
  );
};

export default AdminHome;
