import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ children }) => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        if (location.pathname === "/login" || location.pathname === "/signup") {
            return children;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (location.pathname === "/login" || location.pathname === "/signup") {
        return <Navigate to="/" replace />;
    }

    return children;
};

ProtectedRoutes.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoutes;
