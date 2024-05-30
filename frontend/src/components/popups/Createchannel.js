import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import cross from "../images/X.svg";
import hash from "../images/hash.svg";
import voice from "../images/voice.svg";
import { useDispatch, useSelector } from "react-redux";
import { setcreatechannelflag, setCategoryid } from "@/Redux/sessionSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { current } from "@reduxjs/toolkit";

const Createchannel = () => {
  const queryClient = useQueryClient();
  const container = useRef();
  const { contextSafe } = useGSAP({ scope: container });

  const [value, setvalue] = useState("text");
  const [channelname, setchannelname] = useState("");
  const [isopen, setisopen] = useState(false);
  const [Radiobuttonvalue, setRadiobuttonvalue] = useState("text");
  const dispatch = useDispatch();
  const { currentCategoryId } = useSelector((state) => state.counterSlice);
  const { id, channelId, treadId } = useParams();
  const [Currentwidth, setCurrentwidth] = useState(window.innerWidth);

  useEffect(() => {
    console.log(id, channelId, treadId);
  }, [value]);
  const handlesubmit = () => {
    const response = axios
      .post(
        `/api/channel/create/${id}`,
        {
          channelName: channelname,
          channelType: value,
          category: currentCategoryId?._id || null,
        },
        {
          withCredentials: true, // Important for cookies
        }
      )
      .then(function (response) {
        console.log(response);
        queryClient.invalidateQueries({ queryKey: ["channeldata"] });
        dispatch(setcreatechannelflag(false));
        dispatch(setCategoryid(""));
      });
  };
  const handleradiobutton = (value) => {
    if (value === "text") {
      setvalue("text");
      console.log(value);
      console.log(Radiobuttonvalue);
    }
    if (value === "voice") {
      setvalue("voice");
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setCurrentwidth(window.innerWidth);
      console.log(Currentwidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth, Currentwidth]);

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
    <>
      {Currentwidth > 768 ? (
        <Cover
          onClick={() => {
            dispatch(setcreatechannelflag(false));
          }}
          ref={container}
        >
          <MainContinaer
            className="Mainas"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Paddindiv">
              <div className="title">
                <h1>Create Channel</h1>
                <img
                  onClick={() => dispatch(setcreatechannelflag(false))}
                  src={cross}
                  alt=""
                />
              </div>
              <div className="subtitle">
                <p>in</p>
                <p>{currentCategoryId ? currentCategoryId.categoryName : ""}</p>
              </div>
              <div className="Channeltypediv">
                <h3>CHannel type</h3>
                <div>
                  <div className="Channeltype">
                    <Channeltye
                      className={Radiobuttonvalue === "text" ? "Activas" : ""}
                      onClick={() => {
                        setRadiobuttonvalue("text");
                        handleradiobutton("text");
                      }}
                    >
                      <img src={hash} alt="" />
                      <div>
                        <h4>Text</h4>
                        <p>
                          Send messages, images, GIFs, emoji, opinions, and puns{" "}
                        </p>
                      </div>
                      <input
                        type="radio"
                        value="text"
                        name="channels"
                        checked={Radiobuttonvalue === "text"}
                        id=""
                        onClick={(e) => {
                          setvalue("");
                          setvalue(e.target.value);
                        }}
                      />
                    </Channeltye>
                    <Channeltye
                      className={Radiobuttonvalue === "voice" ? "Activas" : ""}
                      onClick={() => {
                        setRadiobuttonvalue("voice");
                        handleradiobutton("voice");
                      }}
                    >
                      <img src={voice} alt="" />
                      <div>
                        <h4>Voice</h4>
                        <p>
                          Send messages, images, GIFs, emoji, opinions, and puns{" "}
                        </p>
                      </div>
                      <input
                        type="radio"
                        value="voice"
                        name="channels"
                        checked={Radiobuttonvalue === "voice"}
                        id=""
                        onClick={(e) => {
                          setvalue("");
                          setvalue(e.target.value);
                        }}
                      />
                    </Channeltye>
                  </div>
                </div>
                <div className="Channelname">
                  <p>Channel Name</p>
                  <input
                    placeholder="new-channel"
                    type="text"
                    value={channelname}
                    onChange={(e) => setchannelname(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="Bottombuttons">
              <button className="Cancel">Cancel</button>
              <button onClick={handlesubmit} className="Create">
                Create Channel
              </button>
            </div>
          </MainContinaer>
        </Cover>
      ) : (
        <Cover>
          <Mobilecontainer onClick={(e) => e.stopPropagation()}>
            <Firstdivmobile>
              <img
                onClick={() => dispatch(setcreatechannelflag(false))}
                src={cross}
                alt=""
              />
              <p>Create Channel</p>
              <button onClick={handlesubmit}>Create</button>
            </Firstdivmobile>

            <Channelnamemobile>
              <p>CHANNEL NAME</p>
              <input
                type="text"
                value={channelname}
                placeholder="new-channel"
                onChange={(e) => setchannelname(e.target.value)}
              />
            </Channelnamemobile>
            <Channeltypemobile>
              <p>CHANNEL TYPE</p>
              <div
                className="Channeltypemobile"
                onClick={() => {
                  setRadiobuttonvalue("text");
                  handleradiobutton("text");
                }}
              >
                <img src={hash} alt="" />
                <div>
                  <h4>Text</h4>
                  <p>Send messages, images, GIFs, emoji, opinions, and puns</p>
                </div>

                <input
                  type="radio"
                  value="voice"
                  name="channels"
                  checked={Radiobuttonvalue === "text"}
                  onClick={(e) => {
                    setvalue("");
                    setvalue(e.target.value);
                  }}
                />
              </div>
              <div
                className="Channeltypemobile"
                onClick={() => {
                  setRadiobuttonvalue("voice");
                  handleradiobutton("voice");
                }}
              >
                <img src={hash} alt="" />
                <div>
                  <h4>Voice</h4>
                  <p>Talk to your friends</p>
                </div>

                <input
                  type="radio"
                  name="channels"
                  checked={Radiobuttonvalue === "voice"}
                  onClick={(e) => {
                    setvalue("");
                    setvalue(e.target.value);
                  }}
                />
              </div>
            </Channeltypemobile>
          </Mobilecontainer>
        </Cover>
      )}
    </>
  );
};

export default Createchannel;

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
  .Activa {
    background-color: #555555ac;
  }
  @media (max-width: 768px) {
    background-color: #2b2d31;
  }
`;
const MainContinaer = styled.div`
  background-color: #313338;
  width: 30rem;
  height: 30rem;
  border-radius: 0.5rem;
  position: relative;
  .Paddindiv {
    padding: 1rem;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    h1 {
      font-size: 1.25rem;
      font-weight: medium;
      color: #d8d8d8;
      word-spacing: 1px;
      letter-spacing: 0.1px;
    }
    img {
      cursor: pointer;
    }
  }
  .subtitle {
    display: flex;
    gap: 0.2rem;
    margin-bottom: 1rem;
    position: absolute;
    top: 2.8rem;
    left: 1.2rem;
    p {
      font-size: 0.8rem;
      color: #d8d8d89b;
      font-family: "Cabin", sans-serif;
      font-weight: normal;
    }
  }
  .Channeltypediv {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    h3 {
      color: #d8d8d8c3;
      text-transform: uppercase;
      font-size: 0.8rem;
      font-weight: bold;
      font-family: "Cabin", sans-serif;
    }
    .Channeltype {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      h3 {
        color: #d8d8d8;
      }
      img {
        width: 1.5rem;
      }
      div {
        display: flex;
      }
    }
  }
  .Channelname {
    margin-top: 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    p {
      color: #d8d8d8;
      font-size: 0.8rem;
      font-family: "Cabin", sans-serif;
      font-weight: bold;
      text-transform: uppercase;
    }
    input {
      margin-top: 1rem;
      padding-inline: 0.5rem;
      width: 100%;
      height: 2rem;
      padding: 0.4rem;
      outline: none;
      border: none;
      background-color: #1e1f22;
      border-radius: 0.2rem;
      color: white;
      font-size: 0.8rem;
      font-family: "Cabin", sans-serif;
      font-weight: bold;
    }
  }
  .Bottombuttons {
    height: 4rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    margin-top: 3.5rem;
    background-color: #2b2d31;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    .Create {
      background-color: #7289da;
      height: 2.5rem;
      padding-inline: 1rem;
      color: white;
      border-radius: 0.2rem;
      border: none;
      font-size: 0.9rem;
      cursor: pointer;
      margin-right: 1rem;
    }
    .Cancel {
      background-color: transparent;
      height: 2.5rem;
      padding-inline: 0.5rem;
      color: white;
      border-radius: 0.2rem;
      border: none;
      font-size: 0.9rem;
    }
  }
`;

const Channeltye = styled.div`
  display: flex;
  cursor: pointer;
  background-color: #2b2d31;
  padding: 0.7rem;
  justify-content: space-around;
  align-items: center;
  border-radius: 0.2rem;

  div {
    min-width: 22rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    h4 {
      color: #d7d7d7;
    }
    p {
      color: #b9bbbec8;
      font-size: 0.9rem;
    }
  }
  input[type="radio"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2.5px solid black;
    border-radius: 100%;
    outline: none;
  }
  input[type="radio"]:hover {
    box-shadow: 0 0 5px 0px orange inset;
  }
  input[type="radio"]:checked {
    background-color: #ffffff;
    border: 2.5px solid white;
    border-radius: 100%;
    box-shadow: 0 0 5px 0px #313338 inset;
    outline: none;
  }
  &.Activas {
    background-color: #41444a;
  }
`;

const Mobilecontainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 1rem;
  padding-inline: 2rem;
  display: flex;
  flex-direction: column;
  @media (max-width: 375px) {
    padding-inline: 1rem;
  }
`;

const Firstdivmobile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  background-color: #2b2d31;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding-inline: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  @media (max-width: 375px) {
    padding-inline: 0rem;
  }
  p {
    color: #d8d8d8;
    font-size: clamp(0.8rem, 0.486rem + 1.071vw, 1rem);
    font-family: "Cabin", sans-serif;
    font-weight: bold;
  }
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #7381ffc9;
  }
`;

const Channelnamemobile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.8rem;
  p {
    color: #d8d8d8;
    font-size: 0.8rem;
    font-family: "Cabin", sans-serif;
    font-weight: bold;
    text-transform: uppercase;
  }
  input {
    margin-top: 1rem;
    padding-inline: 0.5rem;
    width: 100%;
    height: 2rem;
    padding: 0.4rem;
    outline: none;
    border: none;
    background-color: #1e1f22;
    border-radius: 0.2rem;
    color: white;
    font-size: 0.8rem;
    font-family: "Cabin", sans-serif;
    font-weight: bold;
  }
`;

const Channeltypemobile = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  p {
    color: #d8d8d8;
    font-size: 0.8rem;
    font-family: "Cabin", sans-serif;
    font-weight: bold;
    text-transform: uppercase;
  }
  .Channeltypemobile {
    width: 100%;
    height: 4rem;
    background-color: #1b1d205c;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-inline: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.2rem;
    &:hover {
      background-color: #31333a;
    }
    img {
      width: 1.5rem;
    }
    div {
      width: 90%;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      h4 {
        color: #d7d7d7;
        font-size: clamp(0.7rem, 0.486rem + 1.071vw, 1rem);
      }
      p {
        color: #b9bbbec8;
        font-size: clamp(0.4rem, 0.186rem + 1.071vw, 0.7rem);
      }
    }
  }
`;
