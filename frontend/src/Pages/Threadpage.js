import React from "react";
import Threadnavbar from "@/components/chats/threads/Threadnavbar";
import Threadsearch from "@/components/chats/threads/Threadsearch";
import Threadsection from "@/components/chats/threads/Threadsection";
import Threadcreate from "@/components/chats/threads/Threadcreate";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Threadpage = () => {
  const { createThread } = useSelector((state) => state.counterSlice);
  const { togglesidebar } = useSelector((state) => state.counterSlice);
  return (
    <>
      {togglesidebar && <Spacer />}

      <Cover>
        <Threadnavbar />
        <Threadsection />
        <Threadsearch />
      </Cover>
      {createThread && <Threadcreate />}
    </>
  );
};

export default Threadpage;

const Cover = styled.div`
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  @media (max-width: 1024px) {
    max-width: 100vw;
    max-width: 100vw;
    overflow: hidden;
  }
`;
const Spacer = styled.div`
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
