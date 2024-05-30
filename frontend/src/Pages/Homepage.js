import React from "react";
import Serverbar from "../components/servers/Serverbar";
import styled from "styled-components";
import Channelmaincover from "../components/channels/ChannelMaincover";
import Chatnavbar from "@Pages/Chatpage";
import { Link, Route, Routes, Outlet } from "react-router-dom";
import LayoutWrapper from "./LayoutWrapper";
const Homepage = () => {
  return (
    <Cover>
      <Serverbar />
      <Channelmaincover />
    </Cover>
  );
};

export default Homepage;

const Cover = styled.div`
  height: 100vh;
  max-height: 100vh;
  display: flex;
`;
