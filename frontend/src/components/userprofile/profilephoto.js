import React from "react";
import profile from "../images/nike-just-do-it (2).png";
import styled from "styled-components";
import { setprofilediv } from "@Redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";

const Profilephoto = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Cover onClick={() => dispatch(setprofilediv(true))}>
        <img
          className="Style"
          src="https://cdn.discordapp.com/avatar-decoration-presets/a_629689577fa1da2ef0061a5a8c930de1.png?size=240&passthrough=true"
          alt=""
        />
        {/* <img
        className="Style"
        src="https://cdn.discordapp.com/avatar-decoration-presets/a_0c0eeb351ae2cf48c6e1eee2cae49d40.png?size=240&amp;passthrough=true"
        alt=""
      /> */}
        <div>
          <img src={profile} alt="" />
        </div>
      </Cover>
    </>
  );
};

export default Profilephoto;

const Cover = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-color: #313338;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  div {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      object-fit: cover;
    }
  }
  .Style {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    transform: scale(1.25);
    object-fit: cover;
  }
`;
