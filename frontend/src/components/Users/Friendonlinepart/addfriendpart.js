import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setaddfriend } from "@/Redux/sessionSlice";
import styled from "styled-components";
import { toast, Toaster } from "sonner";
const Addfriendpart = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    toast.info("Add your friends here, You do look very popular", {
      position: "bottom-right",
    });
    return () => {
      dispatch(setaddfriend(false));
    };
  }, []);
  return (
    <Cover>
      <Toaster richColors closeButton />
      <h1>Add Friend</h1>
      <p>Enter the username of the user you want to add</p>
      <Friendinputdiv>
        <input
          type="text"
          placeholder="You can add friends with their biscord username"
        />
        <button>Send Friend Request</button>
      </Friendinputdiv>
    </Cover>
  );
};

export default Addfriendpart;

const Cover = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  h1 {
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 800;
    color: #e4e4e4;
  }
  p {
    margin-top: 0.8rem;
    font-size: 0.8rem;
    font-family: "Cabin", sans-serif;
    color: #9b9b9b;
  }
`;

const Friendinputdiv = styled.div`
  width: 60vw;
  height: 3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  background-color: #1e1f22;
  border-radius: 0.5rem;
  margin-top: 1rem;

  input {
    width: 100%;
    height: 2rem;
    padding: 0.5rem;
    border: none;
    background-color: #1e1f22;
    color: white;
    outline: none;
    border: none;
    padding-inline: 1rem;
  }
  button {
    position: absolute;
    right: 0.8rem;
    background-color: #7684ff;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 0.2rem;
    cursor: pointer;
    padding-inline: 1rem;
  }
`;
