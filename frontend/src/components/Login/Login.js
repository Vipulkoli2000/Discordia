import React, { useState, useEffect, useRef } from "react";
import "./login.css";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserinfo } from "../../Redux/sessionSlice";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [Currentwidth, setCurrentwidth] = useState(window.innerWidth);

  useEffect(() => {
    toast.message("You can Sign Up or use this test account ", {
      description: "Email: test@gmail.com, password: test",
      duration: 3500,
    });
    const handleResize = () => {
      setCurrentwidth(window.innerWidth);
      console.log(Currentwidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth, Currentwidth]);

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    const handleSignUpClick = () => {
      container.classList.add("right-panel-active");
      setIsSignUp(true);
    };

    const handleSignInClick = () => {
      container.classList.remove("right-panel-active");
      setIsSignUp(false);
    };

    signUpButton.addEventListener("click", handleSignUpClick);
    signInButton.addEventListener("click", handleSignInClick);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      signUpButton.removeEventListener("click", handleSignUpClick);
      signInButton.removeEventListener("click", handleSignInClick);
    };
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleusernameChange = (event) => {
    setUsername(event.target.value);
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
        toast.success("Login Successful, Welcome Back", {
          duration: 1000,
          position: "bottom-right",
        });
        if (Currentwidth < 768) {
          navigate("/@mobileme");
        } else {
          navigate("/@me");
        }

        setEmail("");
        setPassword("");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Wrong Password or Email");
      });
  };
  const handleregister = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    // You can replace the console.log with your actual login logic
    axios
      .post(
        "/api/users/user/register",
        {
          username,
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
        toast.success("Registration Successful, Welcome", {
          duration: 1000,
          position: "bottom-right",
        });
        navigate("/channel");
        setEmail("");
        setPassword("");
        setUsername("");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("User Already Exists");
      });
  };

  return (
    <Cover>
      <Toaster richColors position="top-center" />

      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              onChange={handleusernameChange}
              value={username}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={handleEmailChange}
              value={email}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handlePasswordChange}
              value={password}
            />
            <button onClick={handleregister} type="submit">
              Sign Up
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              onChange={handleEmailChange}
              value={email}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handlePasswordChange}
              value={password}
            />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" id="signIn">
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </Cover>
  );
};

export default Login;

const Cover = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    @media (max-width: 768px) {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
`;
