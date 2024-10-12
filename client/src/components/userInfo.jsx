import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const UserInfo = () => {
  const { user } = useContext(UserContext);

  const getInfoUser = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user`, {
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
        <h1>User Info</h1>
        <p>Username: {user.username}</p>
        <p>First Name: {user.firstname}</p>
        <p>Last Name: {user.lastname}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    )
  );
};

export default UserInfo;
