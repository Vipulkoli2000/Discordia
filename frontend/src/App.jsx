import React, { useState, useEffect } from "react";
import Homepage from "@Pages/Homepage";
import Serverbar from "@components/servers/Serverbar";
import Channelmaincover from "@components/channels/ChannelMaincover";
import GlobalStyle from "./Globalstyles";
import Useronlinepage from "@Pages/UserOnlinepage";
import Chatpage from "@Pages/Chatpage";
import { Route, Routes, Outlet, useLocation, Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { connectSocket } from "./socket";
import Login from "@components/Login/Login";
import Chatnavbar from "@components/chats/chatnavbar";
import styled from "styled-components";
import Threadpage from "@Pages/Threadpage";
import Createchannels from "@components/popups/Createchannel";
import Directsectionpage from "@Pages/Directsectionpage";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setDirectmessage, settogglesidebar } from "@/Redux/sessionSlice";
import Messages from "@components/Mobilemessages/Messages";
import Usersection from "./Pages/Usersectionpage";
import messagea from "./components/images/messageas.svg";
import discordlogo from "./components/images/Discordlogo.svg";
import Swipeable from "./components/Helpers/Swipeable";
import { Toaster, toast } from "sonner";

import "./globals.css";
const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location.pathname);
  const path = location.pathname;

  if (path.startsWith("/@me/") && path.split("/").length === 3) {
    dispatch(setDirectmessage(true));
  } else {
    dispatch(setDirectmessage(false));
  }
  useEffect(() => {
    connectSocket();
    toast(
      "You can swipe or click on server button to toggle between servers and messages",
      {
        duration: 600,
      }
    );
  }, []);
  const { createchannelflag } = useSelector((state) => state.counterSlice);
  const { togglesidebar } = useSelector((state) => state.counterSlice);
  console.log(createchannelflag);
  const left = () => {
    dispatch(settogglesidebar(false));
  };
  const right = () => {
    dispatch(settogglesidebar(true));
  };

  return (
    <Swipeable
      styles={{ cursor: "grab" }}
      onSwipeRight={right}
      onSwipeLeft={left}
    >
      <Cover>
        <Toaster closeButton richColors position="top-center" />
        <GlobalStyle />

        <Routes>
          {/* <Route path="/" element={<Homepage />} /> */}
          <Route path="/" element={<Login />} />
          <Route exact path="/channel/" element={<Serverbar />}>
            <Route exact path=":id/" element={<Channelmaincover />}>
              <Route exact path=":channelId" element={<Chatpage />} />
              <Route
                exact
                path=":channelId/:threadId"
                element={<Threadpage />}
              />
            </Route>
          </Route>
          <Route path="/@me" element={<Useronlinepage />}>
            <Route path=":userId" element={<Directsectionpage />} />
          </Route>
          <Route path="/@mobileme" element={<Messages />} />
          <Route path="/@mobileme/:userId" element={<Usersection />} />
        </Routes>

        <Outlet />
        {/* <Test/> */}
      </Cover>
      <BottomDiv>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          to="/channel"
          onClick={() => {
            dispatch(settogglesidebar(!togglesidebar));
          }}
        >
          <div className="message">
            <img src={discordlogo} alt="" />
            <p>Servers</p>
          </div>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/@mobileme">
          <div className="message">
            <img src={messagea} alt="" />
            <p>Messages</p>
          </div>
        </Link>
      </BottomDiv>
    </Swipeable>
  );
};

export default App;

const Cover = styled.div`
  min-height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  min-width: 100vw;
  overflow-y: hidden;
  display: flex;
  background-color: #1e1f22;
`;
const BottomDiv = styled.div`
  width: 100vw;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #3f4248;
  position: sticky;
  bottom: 0rem;
  z-index: 123333333333333;
  display: none;
  .message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    p {
      font-size: 0.8rem;
      font-weight: 600;
      color: #f6f6f6;
      font-family: "Cabin", sans-serif;
    }
  }
  @media (max-width: 758px) {
    display: flex;
  }
`;
