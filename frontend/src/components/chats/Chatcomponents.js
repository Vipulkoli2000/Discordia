import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { settogglesidebar } from "@Redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import Profilepage from "../userprofile/profilephoto";
import axios from "axios";

const Chatcomponents = ({ content, showHeader, user, timestamp, msgcont }) => {
  const dispatch = useDispatch();
  const { togglesidebar } = useSelector((state) => state.counterSlice);
  const [userinfo, setuserinfo] = useState();

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const sentTime = new Date(timestamp);
    const diffInMs = now - sentTime;
    const diffInMin = Math.floor(diffInMs / (1000 * 60));

    if (diffInMin < 1) {
      return "Just now";
    } else if (diffInMin < 60) {
      return `${diffInMin} min ago`;
    } else if (diffInMin < 1440) {
      const diffInHours = Math.floor(diffInMin / 60); // Corrected calculation
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      // If more than 24 hours, display the date
      return sentTime.toLocaleDateString();
    }
  };
  console.log(user);

  const handleclick = () => {
    if (window.innerWidth < 1024) {
      dispatch(settogglesidebar(false));
    }
  };

  return (
    <Cover onClick={handleclick}>
      <Profilepic>{showHeader && <Profilepage />}</Profilepic>
      <Text>
        {showHeader && (
          <Nametitle>
            <p className="username">{user}</p>
            <p className="Time">{getTimeAgo(timestamp)}</p>
          </Nametitle>
        )}
        <Textcomponent>
          <p>{content}</p>
        </Textcomponent>
      </Text>
    </Cover>
  );
};

export default Chatcomponents;

// Styled-components remain unchanged

const Cover = styled.div`
  width: 100%;
  background-color: #313338;
  display: flex;
  padding: 1rem;
  padding-block: 0rem;
  gap: 0.5rem;
`;

const Profilepic = styled.div`
  width: 2rem;
  height: 2rem;
`;
const Nametitle = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: #e7e7e7;

  .Time {
    font-size: 0.7rem;
    align-self: flex-end;
    color: #adadad;
  }
`;
const Text = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: #bbbbbb;
`;
const Textcomponent = styled.div`
  p {
    margin-block: 0.3rem;
    margin-left: 0.1rem;
  }
`;
