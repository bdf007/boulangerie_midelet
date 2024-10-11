import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
          <ToastContainer />
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
