import React, { useEffect, useState, useRef } from "react";
import discordlogo from "../images/Discordlogo.svg";
import Nikeguy from "../images/nike-just-do-it (2).png";
import styled from "styled-components";
import Servers from "./Servers";
import plusicon from "../images/Plus.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessage, setServers } from "../../Redux/sessionSlice";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Createchannels from "@components/popups/Createchannel";
import Animatedsvg from "../chats/svga.svg";
import Profilepage from "../userprofile/profilepage";
import CreateServera from "../popups/CreateServer";
import { setcreateserver } from "@Redux/sessionSlice";
import CreateCategory from "../popups/CreateCategory";
import MobileServer from "../popups/MobileServer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Serverbar = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { createchannelflag } = useSelector((state) => state.counterSlice);
  const { togglesidebar } = useSelector((state) => state.counterSlice);
  const { Directmessagetoggle } = useSelector((state) => state.counterSlice);
  const [currentWidth, setCurrentwidth] = useState(window.innerWidth);
  const container = useRef();
  const fetchServer = async () => {
    try {
      const response = await axios.get("/api/server/servers");
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching server data: " + error.message);
    }
  };

  const queryClient = useQueryClient(); // Get the query client

  const { data, status } = useQuery({
    queryKey: ["Serverlist"],
    queryFn: fetchServer,
    onSuccess: (data) => {
      dispatch(setServers(data));
    },
    onError: (error) => {
      console.error("Error fetching server list:", error);
    },
  });

  // Handle loading and error states

  useEffect(() => {
    setCurrentwidth(window.innerWidth);
  }, [currentWidth, window.innerWidth]);
  useGSAP(
    () => {
      const animation = gsap.fromTo(
        container.current,
        { translateX: 0 },
        { translateX: 4.5, ease: "back.out(1.7)", duration: 1 }
      );
    },

    { scope: container.current, dependencies: [togglesidebar] }
  );

  return (
    <>
      {togglesidebar && (
        <Cover ref={container}>
          <div>
            <Link to={`/@me`}>
              <Logodiv>
                <img src={discordlogo} alt="" />
              </Logodiv>
            </Link>
          </div>
          <div>
            <Linedivider></Linedivider>
          </div>
          <ServerlistContainer>
            {data &&
              data.map((value, id) => (
                <div key={id}>
                  <Link to={`/channel/${value._id}`}>
                    <Servers value={value} />
                  </Link>

                  {/* <Servers /> */}
                </div>
              ))}
          </ServerlistContainer>
          <div>
            <Logodivv onClick={() => dispatch(setcreateserver(true))}>
              <img src={plusicon} alt="" />
            </Logodivv>
          </div>
        </Cover>
      )}

      {!Directmessagetoggle && <Outlet />}

      {createchannelflag && <Createchannels />}
      <Profilepage />
      {currentWidth < 1024 ? <MobileServer /> : <CreateServera />}
      <CreateCategory />
    </>
  );
};

export default Serverbar;

const Cover = styled.div`
  width: 4.5rem;
  min-width: 4.5rem;
  height: 100vh;
  @media (max-width: 768px) {
    position: absolute;
  }
  z-index: 100;
  background-color: #1e1f22;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 1px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1e1f22;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: #1e1f22;
  }
`;
const Logodiv = styled.div`
  margin-top: 0.7rem;
  margin-bottom: 0.5rem;

  width: 3rem;
  height: 3rem;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  background-color: #313338;
  @media (max-width: 768px) {
    display: none;
  }
  img {
    width: 63%;
  }
`;
const Logodivv = styled.div`
  margin-top: 0.7rem;
  margin-bottom: 0.5rem;

  width: 3rem;
  height: 3rem;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  background-color: #313338;
  @media (max-width: 450px) {
    margin-bottom: 10rem;
  }
  img {
    width: 63%;
  }
`;
const ServerlistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const Linedivider = styled.div`
  width: 2rem;
  height: 0.1rem;
  background-color: #313338;
  margin-bottom: 0.5rem;
`;
