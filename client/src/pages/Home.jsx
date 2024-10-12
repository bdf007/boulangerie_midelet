import React from "react";
import UserInfo from "../components/userInfo";
import ListOfUSers from "../components/listOfUser";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <UserInfo />
      <ListOfUSers />
    </div>
  );
};

export default Home;
