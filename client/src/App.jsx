import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import MyInfo from "./pages/MyInfo";
import Admin from "./pages/Admin";
import About from "./pages/About";

// import Components
import NavBar from "./components/navBar";

// API functions
import { getUser } from "./api/user";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = getUser()
      .then((res) => {
        if (res.error) toast(res.error);
        else
          setUser({
            id: res._id,
            username: res.username,
            role: res.role,
            email: res.email,
            firstname: res.firstname,
            lastname: res.lastname,
          });
      })
      .catch((err) => toast(err));

    return () => unsubscribe;
  }, []);

  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={{ user, setUser }}>
          <ToastContainer />
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {user && <Route path="/myinfo" element={<MyInfo />} />}
            {user && (user.role === "admin" || user.role === "superadmin") && (
              <Route path="/admin" element={<Admin />} />
            )}
            <Route path="/about" element={<About />} />

            {/* Add more routes as needed */}
            <Route path="/" element={<Home />} />
          </Routes>
          <ToastContainer />
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
