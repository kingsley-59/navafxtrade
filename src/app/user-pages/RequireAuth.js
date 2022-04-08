import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../context/AuthProvider';

const RequireAuth = () => {
    const { currentUser } = useAuth();
    const location = useLocation();

    return (
        // <Outlet />
        //check if user exists in auth [auth?.user]
        currentUser
            ? <Outlet />
            : <Navigate to={"/login"} state={{from: location}} replace />
        // replace keyword is to replace their login navigation history with the page they're coming from
    );
}

export default RequireAuth;