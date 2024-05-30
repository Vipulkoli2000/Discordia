import React, { useState, useEffect, useRef, useMemo } from "react";
import Chatcomponents from "../Chatcomponents";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import { getSocket } from "../../../socket";
import { useParams } from "react-router-dom";
import Threadelement from "../../clickableComponents/Threads";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Threadsection = () => {
  const queryClient = useQueryClient();

  const { id, channelId, threadId } = useParams();
  console.log(id, channelId, threadId);
  const { Thread } = useSelector((state) => state.counterSlice);
  const [realTimeMessages, setRealTimeMessages] = useState([]);

  const dispatch = useDispatch();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/thread/chat/${threadId}`);
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

  const { data: message = [], status } = useQuery({
    queryKey: ["Threadlist", threadId],
    queryFn: fetchMessages,
    onSuccess: (data) => {
      console.log("done");
    },
    onError: (error) => {
      console.error("Error fetching server list:", error);
    },
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    const socket = getSocket();
    console.log("here", threadId);
    // Subscribe to the channel room
    socket.emit("join_channel", threadId);

    // Handle incoming messages
    const handleNewMessage = (newMessage) => {
      setRealTimeMessages((prevMessages) => [...prevMessages, newMessage]);
      // No need to manually invalidate queries here since the update is real-time
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [channelId]);

  useEffect(() => {
    const messageContainer = document.getElementById("messageContainer");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [realTimeMessages, channelId]);

  const groupMessages = (messages) => {
    if (!messages || !Array.isArray(messages)) return [];

    return messages.reduce((groups, message, index, arr) => {
      const lastGroup = groups[groups.length - 1];
      const isNewGroup =
        !lastGroup ||
        message.user._id !== lastGroup[0].user._id ||
        new Date(message.createdAt) -
          new Date(lastGroup[lastGroup.length - 1].createdAt) >
          120000;

      if (isNewGroup) {
        groups.push([message]);
      } else {
        lastGroup.push(message);
      }
      console.log("groups", groups);
      return groups;
    }, []);
  };

  // const groupedMessages = groupMessages(Allmessages);
  // const combinedMessages = [...message, ...realTimeMessages];
  const combinedMessages = useMemo(
    () => [...message, ...realTimeMessages],
    [message, realTimeMessages]
  );
  const groupedMessages = useMemo(
    () => groupMessages(realTimeMessages),
    [realTimeMessages]
  );
  console.log(groupedMessages);
  // const groupedMessages = useMemo(() => groupMessages(message), [message]);

  return (
    <Cover>
      <Messagecontainer id="messageContainer">
        {/* {status === 'loading' && <div>Loading...</div>}
        {status === 'error' && <div>Error fetching messages</div>} */}
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.map((msg, msgIndex) => (
              <Chatcomponents
                key={msgIndex}
                content={msg.content}
                showHeader={msgIndex === 0} // Adjust this condition based on your design
                user={msg.user.username}
                timestamp={msg.createdAt}
              />
            ))}
          </div>
        ))}
      </Messagecontainer>
      {Thread && <Threadelement />}
    </Cover>
  );
};

export default Threadsection;

const Cover = styled.div`
  width: 100%;
  height: 100%;
  background-color: #313338;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow: hidden;
`;

const Messagecontainer = styled.div`
  padding: 1rem;
  overflow-y: auto;
  gap: 0.6rem;
`;
