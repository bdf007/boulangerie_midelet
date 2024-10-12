import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const ListOfUSers = () => {
  const { user } = useContext(UserContext);
  const [usersInfos, setUsersInfos] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users`,
        {
          //   headers: {
          //     Authorization: `Bearer ${user.accessToken}`,
          //   },
          withCredentials: true,
        }
      );
      setUsersInfos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    user && (
      <div>
        <h1>List of Users</h1>
        {usersInfos.map((usersInfo) => (
          <div key={usersInfo._id}>
            <p>Username: {usersInfo.username}</p>
            <p>First Name: {usersInfo.firstname}</p>
            <p>Last Name: {usersInfo.lastname}</p>
            <p>Email: {usersInfo.email}</p>
            <p>Role: {usersInfo.role}</p>
          </div>
        ))}
      </div>
    )
  );
};

export default ListOfUSers;
