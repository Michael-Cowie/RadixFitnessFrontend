import styled from "styled-components";
import { useNavigate } from "react-router-dom";


import useAuthContext from "context/AuthContext";


const NavBar = () => {
    const { signOutUser } = useAuthContext();

    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
    }


    return (
        <NavbarContainer>
            <div className="navbar bg-slate-900">
                <div className="flex-1">
                    <a onClick={ goToHome } className="text-white font-bold text-2xl ml-4 cursor-pointer"> Home </a>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                        <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><a> Settings </a></li>
                            <li><a onClick={signOutUser}> Logout </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </NavbarContainer>
    )
}

const NavbarContainer = styled.div`
  position: fixed;
  top: 0px;
  width: 100%;
`

export default NavBar;