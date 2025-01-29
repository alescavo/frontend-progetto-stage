import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwt_decode(token);
    
    if (decodedToken.role !== role) {
      return <Navigate to="/login" />;
    }
n
    return children;
  } catch (e) {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;

