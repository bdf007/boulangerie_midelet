import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import UserInfo from "../components/userInfo";
// import logo from "../assets/logo.png";

const MyInfo = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="container-fluid ">
      {user && <h1>Bienvenue {user.firstname}</h1>}

      {/* <img className="img-fluid" src={logo} alt="logo" /> */}
      <UserInfo />
    </div>
  );
};
export default MyInfo;
