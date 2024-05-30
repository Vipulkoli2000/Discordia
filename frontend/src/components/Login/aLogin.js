import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserinfo } from "../../Redux/sessionSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    // You can replace the console.log with your actual login logic
    axios
      .post(
        "/api/users/user/login",
        {
          email,
          password: password,
        },
        {
          withCredentials: true, // Important for cookies
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(setUserinfo(response.data.user));

        navigate("/channel");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button style={{ cursor: "pointer" }} type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
