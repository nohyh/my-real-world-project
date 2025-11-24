import { Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
function ProtectedRoute({children}) {
    const {isLogin} =useAuth();
    if(!isLogin){
        return <Navigate to="/login" replace />;
    }
    else{
        return <Outlet/>;
    }
}
export default ProtectedRoute;