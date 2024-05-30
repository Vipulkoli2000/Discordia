import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../Redux/sessionSlice";

import { getSocket } from "../../../socket";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Usersearch = () => {
  const [currentmessage, setCurrentmessage] = useState("");

  const dispatch = useDispatch();
  const { userId } = useParams();
  const queryClient = useQueryClient();

  const sendmessage = async () => {
    let messageData;
    messageData = {
      content: currentmessage,
      reciever: userId,
    };

    console.log(messageData);
    const socket = getSocket();

    socket.emit("send_message", messageData);
    setCurrentmessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (currentmessage) {
        event.preventDefault();
        sendmessage(currentmessage);
        setCurrentmessage("");
      }
      console.log("Enter key pressed!");
      // You can access the input value here
    }
  };

  console.log(currentmessage);
  return (
    <Cover>
      <Continer>
        <Uploaddiv></Uploaddiv>
        <Inputfiv>
          <input
            placeholder="Send a message..."
            value={currentmessage}
            onChange={(e) => setCurrentmessage(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
          />
        </Inputfiv>
        <Giftdiv></Giftdiv>
      </Continer>
    </Cover>
  );
};

export default Usersearch;

const Cover = styled.div`
  display: flex;
  height: 7rem;
  align-items: center;
  justify-content: center;
  background-color: #313338;
  @media (max-width: 768px) {
    padding-bottom: 4rem;
    padding-bottom: calc(
      env(safe-area-inset-bottom) + 9.5rem
    ); // Add additional padding on small devices
  }
`;
const Continer = styled.div`
  display: flex;
  width: 98%;
  height: 2.8rem;
  background-color: #383a40;
  align-items: center;
  padding-inline: 1rem;
  gap: 0.8rem;
  border-radius: 0.5rem;
`;

const Inputfiv = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  color: white;

  input {
    color: white;
    width: 100%;
    outline: none;
    border: none;
    background-color: transparent;
    &::placeholder {
      color: white;
      opacity: 0.5;
    }
  }
`;
const Uploaddiv = styled.div`
  display: flex;
  align-items: center;
`;
const Giftdiv = styled.div`
  width: 10rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;
