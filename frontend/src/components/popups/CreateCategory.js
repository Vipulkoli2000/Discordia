import React, { useState, useRef } from "react";
import styled from "styled-components";
import cross from "@images/X.svg";
import keys from "@images/keys.svg";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { setcreateserver } from "@Redux/sessionSlice";
import { setCategoryflag } from "@Redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CreateCategory = () => {
  const queryClient = useQueryClient();
  const [isopen, setisopen] = useState(false);
  const [CategoryName, SetcategoryName] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const { Categoryflag } = useSelector((state) => state.counterSlice);
  const container = useRef();
  const HandleSubmit = () => {
    axios
      .post(`/api/Categories/create/${id}`, {
        categoryName: CategoryName,
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["channeldata"] });
        dispatch(setCategoryflag(false));
      });
  };
  useGSAP(
    () => {
      gsap.fromTo(
        ".Mainas",
        { scale: 0.5, duration: 0.5 },
        {
          scale: 1,
          ease: "back.out(1.7)",
        }
      );
    },
    { scope: container, dependencies: [] }
  );

  return (
    Categoryflag && (
      <Cover ref={container} onClick={() => dispatch(setCategoryflag(false))}>
        <Maincontainer className="Mainas" onClick={(e) => e.stopPropagation()}>
          <div>
            <div className="cross">
              <img
                onClick={() => dispatch(setCategoryflag(false))}
                src={cross}
                alt=""
              />
            </div>
            <div className="title">
              <h1>Create Category</h1>
            </div>
            <div className="Servername">
              <p className="Invite">CATEGORY NAME</p>
              <input
                type="text"
                onChange={(e) => SetcategoryName(e.target.value)}
                placeholder="New Category"
              />
            </div>
          </div>
          <div className="bottomdiv">
            <p onClick={() => dispatch(setCategoryflag(false))}>Cancel</p>
            <button onClick={HandleSubmit}>Create Category</button>
          </div>
        </Maincontainer>
      </Cover>
    )
  );
};

export default CreateCategory;
const Cover = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0e0f10ad;
  position: absolute;
  top: 0;
  z-index: 100000000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Maincontainer = styled.div`
  width: 30rem;
  height: 20rem;
  background-color: #313338;
  border-radius: 0.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: 770px) {
    width: 90%;
    height: 25rem;
  }
  .cross {
    position: absolute;
    top: 1rem;
    right: 1rem;
    img {
      width: 2rem;
    }
  }
  .Dummy {
    padding: 1rem;
  }
  .title {
    width: 90%;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    h1 {
      font-size: 1.55rem;
      margin-bottom: 0.5rem;
      color: white;
      font-weight: bold;
    }
    p {
      color: #b5bac1;
    }
  }
  .Servername {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: #ffffffb1;
    .Invite {
      font-size: 0.8rem;
      font-weight: bold;
      font-family: "cabin" sans-serif;
    }
    p {
      font-size: 1rem;
      font-weight: bold;
      font-family: "cabin" sans-serif;
    }
    input {
      width: 100%;
      height: 2.2rem;
      padding: 0.5rem 0.5rem;
      border: none;
      border-radius: 0.3rem;
      background-color: #1e1f22;
      color: white;
    }
  }
  .bottomdiv {
    width: 100%;
    height: 5rem;
    display: flex;
    justify-content: flex-end;
    gap: 2rem;
    align-items: center;
    padding: 0 1rem;
    background-color: #2b2d31;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    p {
      color: #b5bac1;
      font-weight: bold;
      font-family: "cabin" sans-serif;
      margin-left: 1rem;
      cursor: pointer;
    }
    button {
      height: 2.5rem;
      background-color: #5865f2;
      color: white;
      padding: 0.4rem 1rem;
      border: none;
      padding-inline: 1rem;
      border-radius: 0.2rem;
      font-weight: bold;
      font-family: "cabin" sans-serif;
      cursor: pointer;
      margin-right: 1rem;
    }
  }
`;
