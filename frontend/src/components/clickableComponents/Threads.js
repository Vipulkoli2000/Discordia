import React from "react";
import Threadsimg from "../../components/images/Threads.svg";
import plus from "../../components/images/Plus.svg";
import styled from "styled-components";
import search from "../../components/images/search.svg";
import { setThreads, setcreateThread } from "../../Redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";

const Threads = () => {
  const dispatch = useDispatch();
  const { createThread } = useSelector((state) => state.counterSlice);
  const handlesubmit = () => {
    dispatch(setcreateThread(true));
    dispatch(setThreads(false));
  };
  return (
    <>
      <CoverNav className="Nav">
        <div className="Emogy">
          <img src={Threadsimg} alt="" />
          <p>Threads</p>
        </div>
        <div className="Divider"></div>
        <div className="Search">
          <input type="text" placeholder="Search for thread name" />
          <img src={search} alt="" />
        </div>
        <div className="Create">
          <button onClick={handlesubmit}>Create</button>
          <img src={plus} alt="" />
        </div>
      </CoverNav>
      <div></div>
    </>
  );
};

export default Threads;

const CoverNav = styled.div`
  min-width: 30rem;
  min-height: 3rem;
  position: absolute;
  z-index: 231111111111;
  left: 43rem;
  top: 4rem;
  border-radius: 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  background-color: #1e1f22;
  color: white;
  @media (max-width: 1616px) {
    left: 25rem;
  }
  @media (max-width: 1364px) {
    left: 12rem;
  }
  @media (max-width: 1220px) {
    left: 2rem;
  }
  @media (max-width: 1220px) {
    left: -13rem;
  }
  .Nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .Emogy {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    img {
      width: 1.5rem;
    }
  }
  .Divider {
    width: 0.1px;
    height: 2rem;
    background-color: #313338;
  }
  .Search {
    min-width: 10rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #2b2d31;
    border-radius: 0.25rem;

    input {
      width: 10rem;
      height: 1.5rem;
      background-color: #2b2d31;
      border-radius: 0.25rem;
      outline: none;

      border: none;
      padding: 0 0.5rem;
      color: #c6c6c6;
    }
    img {
      width: 1rem;
      margin-right: 3px;
    }
    margin-right: 1rem;
  }
  .Create {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    button {
      width: 5rem;
      height: 1.5rem;
      background-color: #5865f2;
      border-radius: 0.3rem;
      border: none;
      color: white;
    }
    img {
      width: 1.5rem;
    }
  }
`;
