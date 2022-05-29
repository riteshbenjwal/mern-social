import React from "react";
import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import {useDispatch} from 'react-redux'
import { loginUser } from "../../Actions/User";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const dispatch =  useDispatch();

  const loginHandler = (e) => {
    e.preventDefault();

    dispatch(loginUser(email,password));




  };
  return (
    <div className="login">
      <form action="" className="loginForm" onSubmit={loginHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Link to="/forget/password">
          <Typography>Forget Password</Typography>
        </Link>

        <Button type="submit">Login</Button>
        <Link to="/register">
          <Typography>New User</Typography>
        </Link>
      </form>
    </div>
  );
};

export default Login;
