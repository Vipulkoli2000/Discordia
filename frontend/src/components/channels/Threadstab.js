import React from "react";
import Path from "@components/images/path.svg";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Threadstab = ({ thread }) => {
  console.log(thread);
  const { id, channelId, treadId } = useParams();
  return (
    <Linkelem
      exact
      to={`/channel/${id}/${channelId}/${thread._id}`}
      key={thread._id}
      style={{ textDecoration: "none" }}
      activeClassName="active"
      treadId={treadId}
    >
      <Cover>
        <img src={Path} alt="" />
        <div className="Threaddiv">
          <p>{thread.title}</p>
        </div>
      </Cover>
    </Linkelem>
  );
};

export default Threadstab;
const Linkelem = styled(NavLink)`
  &.active {
    .Threaddiv {
      background-color: ${(props) => (props.treadId ? "#2b2d31" : "#3f4248")};
      p {
        color: ${(props) => (props.treadId ? "#dddddd" : "#fffffff0")};
      }
    }
  }
`;
const Cover = styled.div`
  display: flex;
  margin-left: 0.6rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2rem;
  width: 92%;
  height: 2rem;
  gap: 0.1rem;
  img {
    margin-left: 0.85rem;
    width: 0.7rem;
    margin-bottom: 0.4rem;
  }
  .Threaddiv {
    width: 12.1rem;
    height: 2rem;
    display: flex;
    align-items: center;
    border-radius: 0.2rem;
    cursor: pointer;
    color: #9c9c9c;

    &:hover {
      background-color: #404249;

      p {
        color: #dddddd;
      }
    }
    p {
      margin-left: 0.6rem;
    }
  }
`;
