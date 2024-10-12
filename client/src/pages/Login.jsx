import React, { useState, useContext, useEffect } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Nouveau flag pour éviter le double toast

  const handleLogin = async (e) => {
    e.preventDefault();

    // Empêche l'exécution multiple du toast et de la navigation
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await login({ email, password });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message);

        // Stocker le token et mettre à jour le contexte utilisateur
        localStorage.setItem("token", res.token);
        setUser({
          username: res.user.username,
          role: res.user.role,
          id: res.user._id,
          email: res.user.email,
          firstname: res.user.firstname,
          lastname: res.user.lastname,
        });

        // Redirige après un court délai pour s'assurer que le toast est affiché
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      toast.error("Erreur de connexion");
    } finally {
      setIsProcessing(false); // Réinitialise le flag après l'exécution
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
            label="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            disabled={!email || !password}
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
