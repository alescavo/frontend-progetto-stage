import { Typography, AppBar, Toolbar, Box, IconButton } from "@mui/material";

import Logout from "./Logout"; 
import backgroundImage from '../images/home.png'; 
import UserDetailsMenu from "./UserDetailMenu";
import logo from "../images/certy-timeter.png"
import AppListUser from "./AppListUser";
const UserHome = () => {
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
        overflow='hidden'
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
            User Home
          </Typography>
          <IconButton
            sx={{ color: 'white' }} 
            edge="end" 
          >
          <UserDetailsMenu/>
   
         </IconButton>
          <Logout />
        </Toolbar>
      </AppBar>

      <Box sx={{ height: '64px' }} /> 
      <Box 
        sx={{ 
          padding: 2, 
          overflowY: 'hidden', 
          position: 'relative', 
          zIndex: 1, 
        }}
      >
        
        <AppListUser/>
      </Box>
    </>
  );
};

export default UserHome;
