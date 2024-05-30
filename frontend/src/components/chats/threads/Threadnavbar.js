import React, { useState } from "react";
import Threads from "@images/Threads.svg";
import bell from "@images/bell.svg";
import search from "@images/search.svg";
import pin from "@images/pin.svg";
import member from "@images/members.svg";
import help from "@images/help.svg";
import inbox from "@images/imbox.svg";
import styled from "styled-components";
import Threadelement from "../../clickableComponents/Threads";
import { setThreads } from "../../../Redux/sessionSlice";
import rightarrow from "@images/rightarrow.svg";
import backbutton from "@images/leftarrow.svg";
import { useDispatch, useSelector } from "react-redux";
const Threadnavbar = () => {
  const [Thread, setThread] = useState(false);
  const dispatch = useDispatch();
  const handleThreadclick = () => {
    setThread(!Thread);
    dispatch(setThreads(!Thread));
  };
  return (
    <>
      <Cover>
        <Firstdiv>
          <img
            onClick={() => handleSidebar()}
            className="Backbutton"
            src={backbutton}
            alt=""
          />
          <img className="titlehas" src={Threads} alt="" />
          <p>general</p>
          <img className="hiddenrightarrow" src={rightarrow} alt="" />
        </Firstdiv>
        <Secondiv>
          <p>asdbasbdasbdbsdbasdasdasdasd</p>
        </Secondiv>
        <Thirddiv>
          <div className="Innerdiv">
            <div className="firstdivnoti">
              <img
                onClick={() => handleThreadclick()}
                style={{ cursor: "pointer" }}
                src={Threads}
                alt=""
              />
            </div>
            <div className="seconddivnoti">
              <input type="text" />
              <img src={search} alt="" />
            </div>
            <div className="Thirddivnoti"></div>
          </div>
        </Thirddiv>
      </Cover>
    </>
  );
};

export default Threadnavbar;

const Cover = styled.div`
  width: 100%;
  min-height: 3rem;
  background-color: #313338;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1e1f22;
  .saparator {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }
`;
const Firstdiv = styled.div`
  width: 7rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;

  border-right: 1px solid #3f4147;
  .Backbutton {
    width: 1rem;
    margin-left: 0.8rem;
    cursor: pointer;
    display: none;
    @media (max-width: 1024px) {
      display: block;
    }
  }
  @media (max-width: 1024px) {
    gap: 0.3;
    border: none;
  }
  .titlehas {
    width: 1.5rem;
    margin-left: 0.5rem;
  }
  .hiddenrightarrow {
    width: 0.6rem;
    display: none;
    @media (max-width: 1024px) {
      display: block;
    }
  }
  p {
    font-weight: medium;
    margin-left: 0.2rem;
  }
`;
const Secondiv = styled.div`
  display: flex;
  max-width: 60%;
  color: white;
  font-size: 0.8rem;
  position: absolute;
  left: 8.2rem;
  z-index: 0;
  @media (max-width: 1024px) {
    display: none;
  }
`;
const Thirddiv = styled.div`
  display: flex;
  width: 24rem;
  margin-right: 0.5rem;
  padding-left: 1rem;
  align-items: center;
  position: relative;
  z-index: 1;
  background-color: #313338;
  @media (max-width: 1024px) {
    display: none;
  }
  .Innerdiv {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .firstdivnoti {
      display: flex;
      gap: 1rem;
      margin-right: 0.3rem;
    }
    .seconddivnoti {
      display: flex;
      width: 10.5rem;
      height: 1.5rem;
      justify-content: space-around;
      background-color: #1e1f22;
      border-radius: 0.2rem;
      input {
        width: 7rem;
        outline: none;
        border: none;
        background-color: transparent;
        color: white;
      }
      img {
        width: 1.2rem;
      }
    }
    .Thirddivnoti {
      display: flex;
      gap: 0.7rem;
    }
  }
`;
