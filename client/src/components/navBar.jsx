import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo.png";

// API functions
import { logout, getUser } from "../api/user";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  // Check if user is logged in
  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user]);

  // get the info of the user logged in
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser();
        if (res.error) toast(res.error);
        else setUser(res); // Set the entire 'res' object, which includes 'firstname' and 'role'
      } catch (err) {
        toast(err);
      }
    };

    // Fetch user data only when logged in
    if (loggedIn) {
      fetchData();
    }
  }, [setUser, loggedIn]);

  const handleLogout = async (e) => {
    e.preventDefault();
    logout()
      .then((res) => {
        setLogoutMessage(res.message);
        // set user to null
        setUser(null);
        // redirect to login page
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (logoutMessage) {
      toast.error(logoutMessage); // Affiche le toast si un message est présent
      setLogoutMessage(""); // Réinitialise le message après l'affichage
    }
  }, [logoutMessage]);

  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="logo" width="100px" height="100px" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/About">
                A Propos
              </Link>
            </li>
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/AboutPublic">
                    A propos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    S'inscrire
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/review">
                    Avis
                  </Link>
                </li>
              </>
            ) : (
              <>
                {(user.role === "admin" || user.role === "superadmin") && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/Admin">
                        Admin
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/AdminInfo">
                        Gestion de mes informations
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contact">
                        Gestion des Contact
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/chatAdmin">
                        Gestion des messages de chat
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/review">
                        Gestion des Avis
                      </Link>
                    </li>
                  </>
                )}
                {user.role === "user" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyInfo">
                        Mes infos
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contact">
                        Contact Mon Boulanger
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/review">
                        Avis
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
