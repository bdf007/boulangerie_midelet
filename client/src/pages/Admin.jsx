import React from "react";
import ListOfUSers from "../components/listOfUser";
import AboutUploader from "../components/aboutUploader";

const Admin = () => {
  return (
    <div className="container-fluid ">
      <h1>Admin</h1>
      <ListOfUSers />
      <h1>Uploader</h1>
      <AboutUploader />
    </div>
  );
};
export default Admin;
