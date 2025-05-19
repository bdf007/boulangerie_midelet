import React from "react";
// import UserInfo from "../components/userInfo";
// import ListOfUSers from "../components/listOfUser";
import logo from "../assets/logo.png";
import ReviewCarousel from "../components/reviewCarousel";

const Home = () => {
  return (
    <div className="container-fluid ">
      <h1>Bienvenue</h1>

      <img className="img-fluid" src={logo} alt="logo" />
      {/* <UserInfo /> */}
      {/* <ListOfUSers /> */}
      <ReviewCarousel />
    </div>
  );
};

export default Home;
