import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// design
import {
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// API functions
import { login } from "../api/user";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  // form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.message);
        // store token in local storage
        localStorage.setItem("token", res.token);
        // set user in context
        setUser({
          username: res.user.username,
          role: res.user.role,
          id: res.user._id,
          email: res.user.email,
          firstname: res.user.firstname,
          lastname: res.user.lastname,
        });
        // redirect to home page
        navigate("/");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="home">
      <div className="container mt-5 col-10 col-sm-8 col-md-6 col-lg-5">
        <div className="text-center mb-5 alert alert-primary">
          <label htmlFor="" className="h2">
            Login
          </label>
        </div>
        <div className="form-group mb-3">
          <TextField
            size="small"
            variant="outlined"
            className="form-control"
            label="USername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <FormControl variant="outlined" size="small" className="form-control">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment>
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div className="text-center mt-4">
          <Button
            className="mb-4"
            variant="contained"
            color="primary"
            disabled={!username || !password}
            onClick={handleLogin}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
