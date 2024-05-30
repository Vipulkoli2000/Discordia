import React from "react";
import Nikeguy from "../images/nike-just-do-it (2).png";
import styled from "styled-components";
import discordlogo from "../images/Discordlogo.svg";
import { Link } from "react-router-dom";

const Servers = ({ value }) => {
  console.log(value.Serverpic);
  return (
    <>
      <Link to={`/channel/${value._id}`}>
        <Cover>
          {value.Serverpic ? (
            <img
              src={`https://biscord.blr1.cdn.digitaloceanspaces.com/${value.Serverpic}`}
              onError={(e) => {
                e.onerror = null;
                e.target.src =
                  "https://biscord.blr1.cdn.digitaloceanspaces.com/defaultdiscord.jpg";
                console.log(e);
              }}
            />
          ) : (
            <img src="https://biscord.blr1.cdn.digitaloceanspaces.com/defaultdiscord.jpg" />
          )}
        </Cover>
      </Link>
    </>
  );
};

export default Servers;

const Cover = styled.div`
  width: 3rem;
  height: 3rem;

  img {
    width: 100%;
    height: 3rem;

    object-fit: cover;

    border-radius: 2rem;
    cursor: pointer;
  }
`;
