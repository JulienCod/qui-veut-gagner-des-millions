import React, { useEffect, useState } from "react";
import AuthApi from "../../services/authApi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";

export default function Header({ isGameActive }) {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const { admin, setAdmin } = useAppContext();
  const navigate = useNavigate();
  const [account, setAccount] = useState(false);
  const cssLink = "block py-2 pl-3 pr-4 text-white rounded md:bg-transparent hover:bg-gradient-to-b from-purple-900 to-indigo-900 md:p-0"
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };
  useEffect(() => {
    const local = localStorage.getItem("currentAccount");
    if (local) {
      setAccount(true);
    } else {
      setAccount(false);
    }
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    await AuthApi.logout();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "déconnexion réussi",
      heightAuto: false,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setAdmin(false);
      setIsAuthenticated(false);
      toggleMenu();
      navigate("/");
    });
  };
  const handleMessage = () => {
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Veuillez sélectionner un compte pour accédez au jeu",
      heightAuto: false,
      showConfirmButton: false,
      timer: 3000,
    });
    toggleMenu();
    navigate("/compte");
  };
  return isGameActive ? null : (
   
    <header className="bg-gradient-to-b  from-[#10053e] to-[#020009]  text-gray-200 ">
      <nav className=" border-gray-200 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo/logo.webp"
              className="h-8 mr-3"
              alt="Qui veut gagner des millions Logo"
            />
            <span className="self-center text-base s:text-lg font-semibold whitespace-nowrap ">
              Qui veut gagner des Millions
            </span>
          </Link>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-gradient-to-b from-purple-900 to-indigo-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded="false"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={
              isMenuOpen
                ? "w-full md:block md:w-auto"
                : "hidden w-full md:block md:w-auto"
            }
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col text-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gradient-to-b  from-[#10053e] to-[#020009] md:flex-row md:space-x-8 md:mt-0 md:border-0  ">
              <li>
                <Link
                className={cssLink}
                onClick={toggleMenu}
                   to="/">Accueil</Link>
              </li>
              {admin && (
                <li>
                  <Link
                  className={cssLink}
                  onClick={toggleMenu}
                  to="/admin">Administration</Link>
                </li>
              )}
              <li>
                <Link
                className={cssLink}
                onClick={toggleMenu}
                  
                  to="#"
                  >
                  Contact
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    {account ? (
                      <Link
                      className={cssLink}
                      onClick={toggleMenu}
                   to="/jeu">Jeu</Link>
                    ) : (
                      <Link
                      className={cssLink}
                  onClick={handleMessage}>Jeu</Link>
                    )}
                  </li>
                  <li>
                    <Link
                    className={cssLink}
                    onClick={toggleMenu}
                  to="/compte">Compte</Link>
                  </li>
                  <li>
                    <Link className={cssLink}
                     onClick={logout}>Déconnexion</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link className={cssLink}
                  onClick={toggleMenu} to="/connexion-inscription">Connexion/inscription</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
