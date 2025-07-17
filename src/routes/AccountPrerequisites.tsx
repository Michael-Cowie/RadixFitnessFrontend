import { Outlet } from "react-router-dom";
import { OnboardProfileSettingsPage } from "./ProfileSettingPage";
import useProfileContext from "context/ProfileContext/ProfileContext";

/**
 * This is a protective route that asserts that all the required user information is loaded before we continue.
 */
const AccountPrerequisites = () => {
  const { loading: profileLoading, hasProfile } = useProfileContext();

  if (profileLoading)   return null;
  if (!hasProfile) return <OnboardProfileSettingsPage />;

  return <Outlet />;
}

export default AccountPrerequisites;