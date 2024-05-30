import React, { useState } from "react";
import styled from "styled-components";
import Gift from "@components/images/gift.svg";
import upload from "@components/images/uploadsvg.svg";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../Redux/sessionSlice";
import axios from "axios";
import io from "socket.io-client";
import { getSocket } from "../../socket";
import { useParams } from "react-router-dom";

const Searcharea = () => {
  const [currentmessage, setCurrentmessage] = useState("");

  const dispatch = useDispatch();
  const { id, channelId } = useParams();
  const { userinfo } = useSelector((state) => state.counterSlice);
  console.log(userinfo.username);

  const sendmessage = async () => {
    console.log("threadId", threadId);

    const messageData = {
      user: userinfo,
      content: currentmessage,
      channel: channelId,
    };
    console.log(messageData);
    const socket = getSocket();

    socket.emit("send_message", messageData);
    console.log("Firesed");
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
        <Uploaddiv>
          <img src={upload} alt="" />
        </Uploaddiv>
        <Inputfiv>
          <input
            placeholder="Send a message..."
            value={currentmessage}
            onChange={(e) => setCurrentmessage(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
          />
        </Inputfiv>
        <Giftdiv>
          <img src={Gift} alt="" />
          <img src={Gift} alt="" />
          <img src={Gift} alt="" />
          <img src={Gift} alt="" />
        </Giftdiv>
      </Continer>
    </Cover>
  );
};

export default Searcharea;

const Cover = styled.div`
  display: flex;
  height: 7rem;
  align-items: center;
  justify-content: center;
  background-color: #313338;
  position: relative;
  z-index: 312321;

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
