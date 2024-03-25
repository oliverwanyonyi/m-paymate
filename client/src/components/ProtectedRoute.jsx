import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";


const ProtectedRoute = ({ allowedRoles }) => {
    const  authUser  = localStorage.getItem('auth_user') ?  JSON.parse(localStorage.getItem('auth_user')):null
      const location = useLocation();

    const hasAllowedRole = authUser?.role && allowedRoles?.includes(authUser.role);


    if(!authUser){
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasAllowedRole) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;

    } 
    

    return <Outlet/>
};

export default ProtectedRoute;
