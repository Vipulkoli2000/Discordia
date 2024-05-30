import React, { useEffect, useState } from "react";
import styled from "styled-components";
import cross from "@images/X.svg";
import keys from "@images/keys.svg";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setcreateserver } from "@Redux/sessionSlice";
import upload from "@images/upload.svg";

const MobileServer = () => {
  const { createserver } = useSelector((state) => state.counterSlice);
  const dispatch = useDispatch();
  const [isopen, setisopen] = useState(false);
  const [joinServer, setjoinServer] = useState(false);
  const queryClient = useQueryClient();
  const [Servername, setServername] = useState("");
  const [Activeserver, setActiveserver] = useState(true);
  const [Mobileopen, setMobileopen] = useState(false);
  const [joinuser, setjoinuser] = useState("");
  const [file, setFile] = useState("");
  const Serversubmit = async () => {
    const serverdata = {
      serverName: Servername,
    };
    setActiveserver(false);
    console.log({ Servername, file });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("serverName", Servername);

    await axios.post("/api/server/createserver", formData).then(() => {
      queryClient.invalidateQueries({ queryKey: ["Serverlist"] });
      dispatch(setcreateserver(false));
    });
  };

  const Joinserver = async () => {
    console.log(joinuser);
    const serverId = joinuser.split("/")[2];
    await axios
      .post(`/api/server/join/${serverId}`, {
        withCredentials: true,
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["Serverlist"] });
        dispatch(setcreateserver(false));
      });
  };
  return (
    createserver && (
      <Cover onClick={() => dispatch(setcreateserver(false))}>
        {!isopen && !joinServer && (
          <>
            <div className="Paddindiv" onClick={(e) => e.stopPropagation()}>
              <MainContainer onClick={(e) => e.stopPropagation()}>
                <Crossdiv>
                  <img
                    onClick={() => dispatch(setcreateserver(false))}
                    src={cross}
                    alt=""
                  />
                </Crossdiv>
                <Textdiv>
                  <h1>Create Your Server</h1>
                  <p>
                    Your server is where you make your friends hang out Make
                    yours and start talking
                  </p>
                </Textdiv>
                <Createserverdiv onClick={() => setisopen(true)}>
                  <div className="hash">
                    <img src={keys} alt="" />
                    <h4>Create My Own</h4>
                  </div>
                  <img src={cross} alt="" />
                </Createserverdiv>
              </MainContainer>
            </div>
            <Lastdiv onClick={(e) => e.stopPropagation()}>
              <h1>Have an invite already?</h1>
              <button
                onClick={() => {
                  setjoinServer(true);
                }}
              >
                Join a Server
              </button>
            </Lastdiv>
          </>
        )}
        {isopen && !joinServer && (
          <>
            <Containercreate onClick={(e) => e.stopPropagation()}>
              <Crossdiv>
                <img onClick={() => setisopen(false)} src={cross} alt="" />
              </Crossdiv>
              <Textdiv>
                <h1>Create Your Server</h1>
                <p>
                  Your server is where you make your friends hang out Make yours
                  and start talking
                </p>
              </Textdiv>
              <Inputfile>
                <div className="Innercontainer">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    name="s3"
                    accept=".jpg, .jpeg, .png, .svg"
                    id=""
                  />
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Selected"
                      style={{ maxWidth: "100%" }}
                    />
                  ) : (
                    <img src={upload} alt="upload" />
                  )}
                </div>
              </Inputfile>
              <ServerName>
                <p>Server Name</p>
                <input
                  onChange={(e) => setServername(e.target.value)}
                  type="text"
                />
              </ServerName>
              <Buttondiv>
                <button onClick={Serversubmit}>Create Server</button>
              </Buttondiv>
            </Containercreate>
          </>
        )}
        {joinServer && !isopen && (
          <>
            <div className="Paddindiv" onClick={(e) => e.stopPropagation()}>
              <MainContainer onClick={(e) => e.stopPropagation()}>
                <Crossdiv>
                  <img
                    onClick={() => setjoinServer(false)}
                    src={cross}
                    alt=""
                  />
                </Crossdiv>
                <Textdiv>
                  <h1>Join an Existing server</h1>
                  <p>Enter an invite below to join an existing server</p>
                </Textdiv>
                <ServerName>
                  <p>Invite Link</p>
                  <input
                    onChange={(e) => setjoinuser(e.target.value)}
                    type="text"
                  />
                </ServerName>
              </MainContainer>
            </div>
            <Lastdiv onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  Joinserver();
                }}
              >
                Join Server
              </button>
            </Lastdiv>
          </>
        )}
      </Cover>
    )
  );
};

export default MobileServer;
const Inputfile = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .Innercontainer {
    margin-top: 2rem;
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
    gap: 1rem;
    input {
      width: 5rem;
      height: 6rem;
      border-radius: 0.5rem;
      border: none;
      background-color: #1e1f22;
      opacity: 0;
    }
    img {
      width: 20%;
      pointer-events: none;
      position: absolute;
    }
  }
`;

const Cover = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #1e1f22;
  position: absolute;
  top: 0;
  z-index: 100000000;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  .Paddindiv {
    width: 100%;
    min-height: 60%;
  }
`;

const MainContainer = styled.div`
  width: 100vw;
  padding: 1rem;
  padding-inline: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Crossdiv = styled.div`
  width: 100%;
`;

const Textdiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #d8d8d8;
    word-spacing: 1px;
    letter-spacing: 0.1px;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 0.8rem;
    color: #959595d0;
    word-spacing: 1px;
    letter-spacing: 0.1px;
    margin-bottom: 0.5rem;
    text-align: center;
  }
`;

const Createserverdiv = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: aliceblue;
  border-radius: 0.5rem;
  padding-inline: 1rem;
  .hash {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    h4 {
      font-size: 0.8rem;
      font-weight: bold;
      color: #959595d0;
      word-spacing: 1px;
      letter-spacing: 0.1px;
      text-align: center;
    }
  }
`;

const Lastdiv = styled.div`
  width: 100%;
  height: 7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 460px) {
    padding-bottom: 4rem;
    padding-bottom: calc(
      env(safe-area-inset-bottom) + 159.5rem
    ); // Add additional padding on small devices
  }
  h1 {
    font-size: 1.3rem;
    color: #959595d0;
    word-spacing: 1px;
    letter-spacing: 0.1px;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  button {
    width: 90%;
    height: 2.5rem;
    background-color: #5865f2;
    color: white;
    padding: 0.4rem 1rem;
    border: none;
    border-radius: 2rem;
  }
`;

const Containercreate = styled.div`
  width: 100%;
  padding: 1rem;
  padding-inline: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ServerName = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  p {
    font-size: 0.8rem;
    color: #959595d0;
    word-spacing: 1px;
    letter-spacing: 0.1px;
  }
  input {
    width: 100%;
    height: 2rem;
    padding: 0.4rem;
    border: none;
    border-radius: 0.3rem;
    background-color: #17171a;
    color: white;
    font-size: 0.8rem;
    font-family: "Cabin", sans-serif;
    font-weight: bold;
    outline: none;
    margin-top: 1rem;
    padding-inline: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const Buttondiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  button {
    width: 100%;
    height: 2.5rem;
    background-color: #5865f2;
    color: white;
    padding: 0.4rem 1rem;
    border: none;
    padding-inline: 2rem;
    border-radius: 2rem;
    font-weight: bold;
    font-family: "cabin" sans-serif;
    cursor: pointer;
    margin-right: 1rem;
    font-size: 0.8rem;
  }
`;
