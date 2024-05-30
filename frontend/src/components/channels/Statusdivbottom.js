import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Profilephoto from "../userprofile/profilephoto";
import axios from "axios";

const Statusdivbottom = () => {
  const [user, setuser] = useState();
  useEffect(() => {
    axios.get("/api/users/specificuser/get").then((response) => {
      setuser(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <Cover>
      <div className="profile">
        <Profilephoto />{" "}
      </div>
      <div className="text">
        <h5>{user && user.username}</h5>
        <p>People say its interesting</p>
      </div>
    </Cover>
  );
};

export default Statusdivbottom;

const Cover = styled.div`
  width: 100%;
  height: 3.5rem;
  position: absolute;
  bottom: 0rem;
  display: flex;
  align-items: center;
  padding-inline: 0.5rem;
  gap: 0.5rem;
  background-color: #232428;
  .profile {
    width: 2rem;
    height: 2rem;
  }
  .text {
    display: flex;
    flex-direction: column;

    p {
      color: #dadada;
      font-size: 0.8rem;
      font-family: "Cabin", sans-serif;
    }
    h5 {
      color: white;
      font-size: 0.8rem;
      font-family: "Cabin", sans-serif;
      font-weight: 600;
    }
  }
`;
