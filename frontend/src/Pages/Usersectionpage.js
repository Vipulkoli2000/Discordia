import React, { useEffect, useState } from "react";
import Usernavbar from "@components/Users/Directmessages/Usernavbar";
import Usersection from "@components/Users/Directmessages/Usersection";
import styled from "styled-components";
import Usersearch from "@components/Users/Directmessages/Usersearch";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setDirectmessage } from "@Redux/sessionSlice";
import { useLocation } from "react-router-dom";

const Usersectionpage = () => {
  const { togglesidebar } = useSelector((state) => state.counterSlice);
  const dispatch = useDispatch();
  const { userId } = useParams();

  return (
    <>
      <Cover>
        <Usernavbar />

        <Usersection />
        <Usersearch />
      </Cover>
    </>
  );
};

export default Usersectionpage;
const Cover = styled.div`
  width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    max-width: 100vw;
    max-width: 100vw;
  }
`;
const Spacer = styled.div`
  @media (max-width: 1024px) {
    width: 6.5rem;
  }
  @media (max-width: 768px) {
    width: 7.5rem;
  }

  @media (max-width: 520px) {
    width: 8.5;
  }

  @media (max-width: 425px) {
    width: 15rem;
  }
  @media (max-width: 375px) {
    width: 25rem;
  }
`;
