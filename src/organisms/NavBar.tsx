import styles from 'lib/colours.module.css';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { HOME_ROUTE, PROFILE_SETTINGS_ROUTE } from 'lib/routing_routes';
import useAuthContext from 'context/AuthContext/hooks';

const NavBar = () => {
  const { logoutUser } = useAuthContext();

  return (
    <NavbarContainer>
      <div className={`navbar ${styles.darkBlue}`}>
        <div className="flex-1">
          <Link
            to={HOME_ROUTE}
            className="text-white font-bold text-2xl ml-4 cursor-pointer select-none"
          >
            Radix Fitness
          </Link>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src="/blank_profile.svg" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={PROFILE_SETTINGS_ROUTE}> Profile Settings </Link>
              </li>
              <li>
                <a onClick={logoutUser}> Logout </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
`;

export default NavBar;
