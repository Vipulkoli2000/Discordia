import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { settogglesidebar } from "@Redux/sessionSlice";
import Swipeable from "../../Helpers/Swipeable";
import Chatcomponents from "../../chats/Chatcomponents";
import Threadelement from "@components/clickableComponents/Threads";
import { getSocket } from "../../../socket";
import { useQueryClient } from "@tanstack/react-query";
const Usersection = () => {
  const { userId } = useParams();
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const messageContainerRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      // Check if response.data.channelMessages is undefined
      console.log(response.data);
      const channelMessages = response.data ?? [];
      setRealTimeMessages(channelMessages);

      return channelMessages; // Ensure a value is always returned
    } catch (error) {
      // Optionally, handle the error more gracefully
      console.error("Error fetching server data: ", error.message);
      return []; // Return an empty array in case of an error
    }
  };

  const { data: initialMessages = [] } = useQuery({
    queryKey: ["Messagelist", userId],
    queryFn: fetchMessages,
  });

  useEffect(() => {
    const socket = getSocket();
    const channel = userId;
    socket.emit("join_channel", channel);

    const handleNewMessage = (newMessage) => {
      console.log("New message received: ", newMessage._id);
      // Add logic here to ensure no duplicates are added
      setRealTimeMessages((prevMessages) => {
        const alreadyExists = prevMessages.some(
          (msg) => msg._id === newMessage._id
        );
        if (!alreadyExists) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    };

    socket.on("New-directmessage", handleNewMessage);

    return () => {
      socket.off("New-directmessage", handleNewMessage);
    };
  }, [userId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [realTimeMessages, initialMessages, userId]);

  const groupMessages = (messages) => {
    if (!messages || !Array.isArray(messages)) return [];
    // Sort messages by createdAt to ensure correct order
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return messages.reduce((groups, message) => {
      const lastGroup = groups[groups.length - 1];
      const messageDate = new Date(message.createdAt).getTime();
      const lastMessageDate = lastGroup
        ? new Date(lastGroup[lastGroup.length - 1].createdAt).getTime()
        : null;

      // Determine if a new group is needed
      const isNewGroup =
        !lastGroup ||
        message.sender._id !== lastGroup[0].sender._id ||
        messageDate - lastMessageDate > 120000;

      if (isNewGroup) {
        groups.push([message]);
      } else {
        lastGroup.push(message);
      }
      return groups;
    }, []);
  };

  const combinedMessages = useMemo(() => {
    const initialMessagesIds = new Set(initialMessages.map((msg) => msg._id));
    const uniqueRealTimeMessages = realTimeMessages.filter(
      (msg) => !initialMessagesIds.has(msg._id)
    );
    return [...initialMessages, ...uniqueRealTimeMessages];
  }, [initialMessages, realTimeMessages]);

  const groupedMessages = useMemo(
    () => groupMessages(combinedMessages),
    [combinedMessages]
  );
  console.log("Grouped", groupedMessages);
  return (
    <Cover>
      <Messagecontainer ref={messageContainerRef}>
        {groupedMessages.map((group, groupIndex) => (
          <div className="group" styles={{ height: "100%" }} key={groupIndex}>
            {group.map((msg, msgIndex) => (
              <Chatcomponents
                key={msgIndex}
                content={msg.content}
                showHeader={msgIndex === 0}
                user={msg.sender.username}
                timestamp={msg.createdAt}
              />
            ))}
          </div>
        ))}
      </Messagecontainer>
    </Cover>
  );
};

export default Usersection;

const Cover = styled.div`
  width: 100%;
  height: 100%;
  background-color: #313338;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow: hidden;
  overflow-y: scroll;
`;

const Messagecontainer = styled.div`
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
  gap: 0.6rem;
  position: relative;
  z-index: 321;
  .Spacea {
    width: 100%;
    height: 100%;
  }
`;
