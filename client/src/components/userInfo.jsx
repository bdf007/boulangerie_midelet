import React, { useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const UserInfo = () => {
  const { user } = useContext(UserContext);

  const getInfoUser = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/user`, {
        // headers: {
        //   Authorization: `Bearer ${user.accessToken}`,
        // },
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfoUser();
  }, []);

  return (
    user && (
      <div>
        <h1>Mes infos</h1>
        <p>Nom d'utilisateur : {user.username}</p>
        <p>Prénom : {user.firstname}</p>
        <p>Nom de famille : {user.lastname}</p>
        <p>Email : {user.email}</p>
        <p>Role : {user.role}</p>
      </div>
    )
  );
};

export default UserInfo;
