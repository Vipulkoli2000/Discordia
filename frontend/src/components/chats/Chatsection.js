import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { settogglesidebar } from "@Redux/sessionSlice";
import Swipeable from "../Helpers/Swipeable";
import Chatcomponents from "./Chatcomponents";
import Threadelement from "../clickableComponents/Threads";
import { getSocket } from "../../socket";
import { useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
const Chatsection = () => {
  const { channelId, threadId } = useParams();
  const { Thread } = useSelector((state) => state.counterSlice);
  const { currentwidth } = useSelector((state) => state.counterSlice);
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const messageContainerRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/chats/${channelId}`);
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
    queryKey: ["Messagelist", channelId],
    queryFn: fetchMessages,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (currentwidth > 600) {
      toast(
        "Click on the Hash icon to create your personal threads",
        {
          duration: 2000,
          position: "bottom-right",
        },
        []
      );
    }
    const socket = getSocket();
    const channel = threadId || channelId;
    socket.emit("join_channel", channel);

    const handleNewMessage = (newMessage) => {
      setRealTimeMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [channelId, threadId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [realTimeMessages, initialMessages, channelId]);

  const groupMessages = (messages) => {
    if (!messages || !Array.isArray(messages)) return [];
    return messages.reduce((groups, message, index) => {
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
      return groups;
    }, []);
  };

  const combinedMessages = useMemo(
    () => [...initialMessages, ...realTimeMessages],
    [initialMessages, realTimeMessages]
  );
  const groupedMessages = useMemo(
    () => groupMessages(combinedMessages),
    [combinedMessages]
  );

  const right = () => {
    dispatch(settogglesidebar(true));
  };

  const left = () => {
    dispatch(settogglesidebar(false));
  };

  return (
    <Cover>
      <Toaster richColors closeButton />

      <Messagecontainer ref={messageContainerRef}>
        <Swipeable
          styles={{ overflowY: "scroll", position: "absolute" }}
          onSwipeRight={right}
          onSwipeLeft={left}
        >
          {groupedMessages.map((group, groupIndex) => (
            <div className="group" key={groupIndex}>
              {group.map((msg, msgIndex) => (
                <Chatcomponents
                  key={msgIndex}
                  msgId={msg._id}
                  content={msg.content}
                  showHeader={msgIndex === 0}
                  msgcont={msg}
                  user={msg.user.username}
                  timestamp={msg.createdAt}
                />
              ))}
            </div>
          ))}
        </Swipeable>
      </Messagecontainer>
      {Thread && <Threadelement />}
    </Cover>
  );
};

export default Chatsection;

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
  min-height: 80vh;
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
