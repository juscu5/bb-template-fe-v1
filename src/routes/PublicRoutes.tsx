import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useStore";

interface PublicRoutesProps {
  element: React.ReactNode;
}

const PublicRoutes: React.FC<PublicRoutesProps> = ({ element }) => {
  const { user } = useAuthStore();
  const userRole = user?.usrlvl;

  if (!userRole) {
    return element;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default PublicRoutes;
