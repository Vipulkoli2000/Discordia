import React, { useState } from "react";
import down from "../images/Down.svg";
import Smallplus from "../images/Smallplus.svg";
import Threads from "../images/Threads.svg";
import Settings from "../images/Settings.svg";
import styled from "styled-components";
import Textchannel from "./Textchannel";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../Helpers/Strictmodedropable";
import { NavLink, useParams } from "react-router-dom";
import Threadstab from "@components/channels/Threadstab";
import Createchannel from "../popups/Createchannel";
import { useDispatch, useSelector } from "react-redux";
import { setcreatechannelflag, setCategoryid } from "@/Redux/sessionSlice";
import { setCategoryflag } from "@/Redux/sessionSlice";

const Categories = ({ category, index }) => {
  const { id } = useParams();
  console.log(category);
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const { Categoryflag } = useSelector((state) => state.counterSlice);

  return (
    <>
      <Cover>
        <Catagorysection>
          <div onClick={() => setOpen(!open)} className="Firstdiv">
            <img src={down} alt="" />
            <p>{category.categoryName}</p>
          </div>
          <img
            className="Plusbut"
            onClick={() => {
              dispatch(setcreatechannelflag(true));

              dispatch(setCategoryid(category));
            }}
            src={Smallplus}
            alt=""
          />
        </Catagorysection>
        {open && (
          <div className="secondiv">
            {category.channels.map((channel, index) => (
              <>
                <Textchannel
                  key={channel._id}
                  channel={channel}
                  index={index}
                />
                {channel.threads.map(
                  (thread, index) => (
                    console.log(channel),
                    (
                      <Threadscover
                        key={thread._id}
                        thread={thread}
                        index={index}
                      />
                    )
                  )
                )}
              </>
            ))}
          </div>
        )}
      </Cover>
    </>
  );
};

export default Categories;
const Threadscover = styled(Threadstab)``;
const Linkelem = styled(NavLink)``;

const Cover = styled.div`
  width: 100%;
  min-height: 2rem;
  margin-top: 1rem;
  position: relative;
  font-family: "UniSans", sans-serif;

  .selected {
    background-color: #2b2d31;
  }
  .active {
    background-color: #384358;
  }
`;
const Catagorysection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .Firstdiv {
    display: flex;
    align-items: center;

    gap: 0.2rem;
    margin-left: 0.2rem;
    cursor: pointer;
    p {
      text-transform: uppercase;
      color: #949ba4;
      font-size: 0.7rem;
      font-family: "arial", sans-serif;
      letter-spacing: 0.1px;
    }
    img {
      width: 1rem;
    }
  }
  .secondiv {
  }
  .Plusbut {
    margin-right: 1rem;
  }
`;
const Textchannelsmaindiv = styled.div`
  margin-top: 0.5rem;
  width: 92%;
  height: 2.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.5rem;
  border-radius: 0.2rem;
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
  }
`;
