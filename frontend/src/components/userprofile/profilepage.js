import React, { useState } from "react";
import dots from "../images/3dots.svg";
import styled from "styled-components";
import profile from "../images/nike-just-do-it (2).png";
import Profilephoto from "./profilephoto";
import { useSelector, useDispatch } from "react-redux";
import { setprofilediv } from "@/Redux/sessionSlice";
const Profilepage = () => {
  const profilediv = useSelector((state) => state.counterSlice.profilediv);
  const dispatch = useDispatch();
  const [userinfo, setuserinfo] = useState();

  return (
    profilediv && (
      <Cover onClick={() => dispatch(setprofilediv(false))}>
        <MainContainer onClick={(e) => e.stopPropagation()}>
          <div className="Background">
            <img
              src="https://cdn.discordapp.com/assets/profile_effects/effects/2023-10-5/earthquake/intro.png"
              alt=""
            />
            <img
              className="loop"
              src="https://cdn.discordapp.com/assets/profile_effects/effects/2e46d5d2d9e/earthquake/loop.png"
              alt=""
            />
            ;
          </div>
          <div className="Firstdiv">
            <div className="Profile">
              <Profilephoto />
              <div className="Statusdiv">
                <div className="Innnercolor"></div>
              </div>
            </div>
            <div className="buttondiv">
              <div>
                <button>Send Message</button>
              </div>
              <img
                onClick={() => dispatch(setprofilediv(false))}
                src={dots}
                alt=""
              />
            </div>
          </div>
          <div className="Seconddiv">
            <div className="Name">
              <h1>yash</h1>
              <UserinfoDiv>
                <div>
                  <p>User Info</p>
                </div>
                <div>
                  <p>Mutual Friends </p>
                </div>
                <div>
                  <p>Mutual Server </p>
                </div>
              </UserinfoDiv>
              <div className="Seperator"></div>
              <div>
                {/*<div className="About">
                <p>ABOUT ME</p>
                <p>ASDAs</p>

                <p>Discord member since</p>
                <p>2022-12-10</p>
        </div> */}
                <Friendtab>
                  <div className="Buttondiv">
                    <div className="Profile">
                      <Profilephoto />
                    </div>
                    <p>Kev</p>
                  </div>
                </Friendtab>
              </div>
            </div>
          </div>
        </MainContainer>
      </Cover>
    )
  );
};

export default Profilepage;

const Cover = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 102222200;
`;
const Friendtab = styled.div`
  width: 100%;
  height: 3.5rem;
  display: flex;
  align-items: center;
  background-color: #232428;
  border-radius: 0.3rem;
  p {
    color: #ffffffdb;
  }
  .Profile {
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 100%;
    display: flex;
  }
  .Buttondiv {
    position: relative;
    margin-left: 0.5rem;
    gap: 0.8rem;
    display: flex;
    align-items: center;
    z-index: 23333334;
  }
`;
const MainContainer = styled.div`
  width: 38rem;
  height: 38rem;
  background-color: rgb(43, 45, 49);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: 768px) {
    width: 100%;
    height: 55rem;
  }
  .Background {
    width: 100%;
    height: 10rem;
    background-color: #5d80c6;
    position: relative;
    border-radius: 0.5rem 0.5rem 0 0;

    img {
      width: 38rem; /* Adjust as needed */
      object-fit: cover;
      position: absolute;
      z-index: 1000;

      @media (max-width: 768px) {
        width: 100%;
      }
    }
    .loop {
    }
  }
  .Firstdiv {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 1rem;
    @media (max-width: 425px) {
    }
    .Profile {
      margin-left: 1rem;
      width: 9rem;
      height: 9rem;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      border: 0.5rem solid #2b2d31;
      top: -5.5rem;
      @media (max-width: 425px) {
        left: 20%;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        object-fit: cover;
      }
      .Statusdiv {
        width: 2.5rem;
        height: 2.5rem;
        position: absolute;
        border-radius: 100%;
        border: 0.5rem solid #131316;
        bottom: 0rem;
        right: 0rem;
        .Innnercolor {
          width: 100%;
          height: 100%;
          background-color: #131316;
          border-radius: 100%;
          border: 0.4rem solid #565960;
        }
      }
    }
  }
  .buttondiv {
    margin-left: 27rem;
    display: flex;
    gap: 0.5rem;
    margin-top: 0.2rem;
    position: relative;
    z-index: 1001;
    @media (max-width: 768px) {
      margin-left: 50%;
    }
    @media (max-width: 425px) {
      margin-left: 30%;
      margin-top: 5rem;
    }

    button {
      min-width: 7rem;
      height: 2rem;
      background-color: #248046;
      border: none;
      border-radius: 0.2rem;
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
      padding-inline: 1rem;
      cursor: pointer;
      @media (max-width: 375px) {
        min-width: 5rem;
        padding-inline: 1rem;
      }
    }
  }
  .Seconddiv {
    width: 100%;
    height: 100%;
    padding: 1rem;
    .Name {
      width: 100%;
      height: 100%;
      background-color: #131316;
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      h1 {
        color: #ffffffdb;
        font-size: 1.5rem;
      }
      .Seperator {
        width: 100%;
        height: 1px;
        background-color: #c2c2c237;
        margin-bottom: 0.5rem;
      }
      .About {
        margin-top: 0.6rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: #ffffffdb;
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
  }
`;

const UserinfoDiv = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 2.5rem;
  p {
    color: #ffffffdb;
    font-size: 0.8rem;
    font-weight: 500;
  }
  div {
    padding-bottom: 1rem;
    border-bottom: 2px solid #dddddd;
  }
`;
