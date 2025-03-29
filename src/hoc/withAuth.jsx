import { Navigate } from "react-router-dom";

const withAuth = (WrappedComponent, isProtected = true) => {
  return (props) => {
    const token = localStorage.getItem("token");

    if (isProtected && !token) {
      return <Navigate to="/login" replace />;
    }

    if (!isProtected && token) {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
