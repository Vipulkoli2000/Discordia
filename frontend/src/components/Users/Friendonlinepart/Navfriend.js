import React from "react";
import Friendstab from "@images/Friendsecond.svg";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setaddfriend, setuserlist } from "@Redux/sessionSlice";

const Navfriend = () => {
  const dispatch = useDispatch();
  return (
    <Cover>
      <div className="Iconfriend">
        <img src={Friendstab} alt="" />
        <p>Friends</p>
      </div>
      <div className="Seperator"></div>
      <div className="Filterbutton">
        <button
          onClick={() => {
            dispatch(setaddfriend(false));
            dispatch(setuserlist(true));
          }}
        >
          Online
        </button>
        <button
          onClick={() => {
            dispatch(setaddfriend(false));
            dispatch(setuserlist(true));
          }}
        >
          All
        </button>
        <button>Pending</button>
        <button>Blocked</button>
        <button
          onClick={() => {
            dispatch(setaddfriend(true));
            dispatch(setuserlist(false));
          }}
          className="Addfriend"
        >
          Add Friend
        </button>
      </div>
    </Cover>
  );
};

export default Navfriend;

const Cover = styled.div`
  width: 100%;
  height: 3rem;
  background-color: #313338;
  border-bottom: 2px solid #1f2023;
  display: flex;
  align-items: center;
  .Iconfriend {
    width: 7rem;
    padding: 1rem;
    padding-top: 0.8rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    color: white;
    display: flex;
    align-items: center;
    p {
      font-weight: 800;
    }
    img {
      min-width: 1.5rem;
    }
  }
  .Seperator {
    background-color: #3e4047;
    width: 0.5px;
    height: 1.5rem;
  }
  .Filterbutton {
    margin-left: 1rem;
    display: flex;
    gap: 0.5rem;
    button {
      background-color: #42444a;
      border: none;
      outline: none;
      color: white;
      font-weight: 500;
      letter-spacing: 0.7px;
      font-size: 0.9rem;
      border-radius: 0.2rem;
      padding-inline: 0.5rem;
    }
    .Addfriend {
      background-color: #248046;
      border-radius: 0.2rem;
      padding: 0.2rem;
      padding-inline: 0.5rem;
    }
  }
`;
