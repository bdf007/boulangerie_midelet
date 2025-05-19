import React from "react";
import ListOfUSers from "../components/listOfUser";
import AboutUploader from "../components/aboutUploader";
// import AdminReviewManagement from "../components/adminReviewManagement";

const Admin = () => {
  return (
    <div className="container-fluid ">
      <h1>Admin</h1>
      <ListOfUSers />
      <h1>Uploader</h1>
      <AboutUploader />
      <h1>Admin Review Management</h1>
      {/* <AdminReviewManagement /> */}
    </div>
  );
};
export default Admin;
