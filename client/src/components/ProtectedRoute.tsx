import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

const ProtectedRoute = (): JSX.Element => {

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    if (!currentUser) {
        return null
    }

    return <Outlet />;
};

export default ProtectedRoute;
