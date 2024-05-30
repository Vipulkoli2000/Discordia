import React, { useState } from "react";
import styled from "styled-components";
import Threads from "../images/Threads.svg";
import Settings from "../images/Settings.svg";
import { Draggable } from "react-beautiful-dnd";
import { NavLink, useParams } from "react-router-dom";
import voice from "../images/voice.svg";
import { setconnectSocketvideo } from "@Redux/sessionSlice";
const Textchannel = ({ channel, index }) => {
  const [Threadpresent, setThreadpresent] = useState(false);
  console.log(channel);
  const { id, channelId, threadId } = useParams();
  console.log("ServerID", threadId);
  console.log("ChannelID", channel);
  return (
    <Linkelem
      to={`/channel/${id}/${channel._id}`}
      key={channel._id}
      style={{ textDecoration: "none" }}
      activeClassName="active"
      treadId={threadId}
      exact
    >
      {channel.channelType === "text" ? (
        <Textchannelsmaindiv className="mainwrapper">
          <div className="Threadtxt">
            <img src={Threads} alt="" />
            <p>{channel.channelName}</p>
          </div>
          <div className="Setting">
            <img src={Settings} alt="" />
          </div>
        </Textchannelsmaindiv>
      ) : (
        <Textchannelsmaindiv onClick={() => setconnectSocketvideo(true)}>
          <div className="Threadtxt">
            <img src={voice} alt="" />
            <p>{channel.channelName}</p>
          </div>
          <div className="Setting">
            <img src={Settings} alt="" />
          </div>
        </Textchannelsmaindiv>
      )}
    </Linkelem>
  );
};

export default Textchannel;
const Linkelem = styled(NavLink)`
  &.active {
    .mainwrapper {
      background-color: ${(props) => (props.treadId ? "#2b2d31" : "#3f4248")};

      .Threadtxt {
        p {
          color: ${(props) => (props.treadId ? "#949ba4" : "#fffffff0")};
        }
      }
    }
  }
  &.nonactive {
    .mainwrapper {
      background-color: #143c8b;
      .Threadtxt {
        p {
          color: #9c9c9c;
        }
      }
    }
  }
`;

const Textchannelsmaindiv = styled.div`
  margin-top: 0.5rem;
  width: 92%;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.5rem;
  border-radius: 0.3rem;
  font-family: "uni", sans-serif;
  cursor: pointer;

  &:hover {
    background-color: #404249;
    .Threadtxt {
      p {
        color: #dddddd;
      }
    }
  }
  .Threadtxt {
    display: flex;
    gap: 0.5rem;
    margin-left: 0.5rem;
    p {
      color: #949ba4;
    }
    img {
      width: 1.2rem;
    }
  }

  .Setting {
    margin-right: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: ${(props) => (props.isHovered ? "" : "hidden")};
  }
`;
