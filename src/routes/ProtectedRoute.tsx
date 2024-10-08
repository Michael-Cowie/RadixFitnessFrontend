import useAuthContext from 'context/AuthContext/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * The ProtectedRoute component implements logic that only allows the user to access
 * the current page if they're logged in, otherwise it will route them back to the
 * login page.
 * 
 * The ProtectedRoute is essentially a parent element and it's children are the route
 * elements. The Outlet component represents the current child route element, which 
 * would be each loaded page.
 */
const ProtectedRoute = () => {
	const { userIsLoggedIn } = useAuthContext();
	return (
		<>
			{ userIsLoggedIn ? <Outlet /> : <Navigate to="/login"  replace/> }
		</>
	);
};

export default ProtectedRoute;
