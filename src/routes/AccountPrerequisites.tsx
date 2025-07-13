import { Outlet } from "react-router-dom";
import CreateProfilePage from "./CreateProfilePage";
import useProfileContext from "context/ProfileContext/ProfileContext";

/**
 * This is a protective route that asserts that all the required user information is loaded before we continue.
 */
const AccountPrerequisites = () => {
  const { loading, hasProfile } = useProfileContext();

  if (loading)   return null;
  if (!hasProfile) return <CreateProfilePage />;

  return <Outlet />;
}

export default AccountPrerequisites;