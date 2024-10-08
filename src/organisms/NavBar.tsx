import useAuthContext from 'context/AuthContext/AuthContext';
import styles from 'lib/colours.module.css';
import UpdateProfile from 'molecules/UserProfile/UpdateProfile';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavBar = () => {
    const [updatingProfile, setUpdatingProfile] = useState(false);

    const { signOutUser } = useAuthContext();

    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
    }

    return (
        <NavbarContainer>
            { updatingProfile && <UpdateProfile onSuccess={ () => setUpdatingProfile(false) }/> }

            <div className={ `navbar ${ styles.darkBlue }` }>
                <div className="flex-1">
                    <a onClick={ goToHome } className="text-white font-bold text-2xl ml-4 cursor-pointer"> Radix Fitness </a>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt="Tailwind CSS Navbar component" src="./blank_profile.svg" />
                        </div>
                    </div>
                        <ul tabIndex={ 0 } className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><a onClick={ () => setUpdatingProfile(true) }> Settings </a></li>
                            <li><a onClick={ signOutUser }> Logout </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </NavbarContainer>
    )
}

const NavbarContainer = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
`

export default NavBar;
