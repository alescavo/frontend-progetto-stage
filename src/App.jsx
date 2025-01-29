import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Login";
import UserHome from "./component/UserHome";
import AdminHome from "./component/AdminHome";
import ChangePassword from "./component/ChangePassword";
import UsersList from "./component/UserList";
import AppPage from "./component/AppPage";
import { Logout } from "@mui/icons-material";
import CertificateListUser from "./component/CertificateListUser";
import CertificateListAdmin from "./component/CertificateListAdmin";
import CertificatePageAdmin from "./component/CertificatePageAdmin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/applications" element={<AppPage />} />
        <Route path="/certificate-user/:id" element={<CertificateListUser />} />
        <Route path="/certificate/:id" element={<CertificateListAdmin />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/certificates" element={<CertificatePageAdmin />} />
        <Route path="/logout" element={<Logout/>}/>
      </Routes>
    </Router>
  );
};

export default App;
