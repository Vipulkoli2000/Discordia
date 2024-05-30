import React, { useState, useEffect, useRef } from "react";
import dropdown from "../images/Down.svg";
import styled from "styled-components";
import Categories from "./Categories";
import { DragDropContext } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../Helpers/Strictmodedropable";
import { useParams, Outlet } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { setDropdownflag, settogglesidebar } from "@Redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import Swipeable from "../Helpers/Swipeable";
import Textchannel from "./Textchannel";
import Dropdownchannelcover from "./Dropdownchannelcover";
import Statusdivbottom from "./Statusdivbottom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast, Toaster } from "sonner";

const ChannelMaincover = () => {
  const [categories, setCategories] = useState();
  const [Currentwidth, setCurrentwidth] = useState(window.innerWidth);

  const { id } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { Categoryflag } = useSelector((state) => state.counterSlice);
  const { togglesidebar } = useSelector((state) => state.counterSlice);
  const { Dropdownflag } = useSelector((state) => state.counterSlice);
  const [isopen, setisopen] = useState(true);
  const [noncategory, setnoncategory] = useState();
  const container = useRef();
  const { contextSafe } = useGSAP({ scope: container });
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

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/Categories/getcategory/${id}`);
      setCategories(response.data.categories);
      setnoncategory(response.data.channelsWithoutCategory);

      return response.data;
    } catch (error) {
      throw new Error("Error fetching server data: " + error.message);
    }
  };

  const { data, status } = useQuery({
    queryKey: ["channeldata", id],
    queryFn: fetchMessages,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error("Error fetching server list:", error);
    },
    // You generally don't need to pass the queryClient in the options. It's used differently in v5.
  });

  const left = () => {
    dispatch(settogglesidebar(false));
  };
  const right = () => {
    dispatch(settogglesidebar(true));
  };

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
          <Swipeable
            styles={{ cursor: "grab" }}
            onSwipeRight={right}
            onSwipeLeft={left}
          >
            <Servername
              onClick={() => dispatch(setDropdownflag(!Dropdownflag))}
            >
              <div>
                <h4>Yash's server</h4>
              </div>
              <div className="drop">
                <img onClick={() => setisopen(!isopen)} src={dropdown} alt="" />
              </div>
              {Dropdownflag && <Dropdownchannelcover />}
            </Servername>
            <div className="Context">
              {noncategory &&
                noncategory.map((channel, index) => (
                  <div style={{ marginTop: "1rem" }}>
                    <Textchannel
                      key={channel._id}
                      channel={channel}
                      index={index}
                    />
                  </div>
                ))}
              {categories &&
                categories.map((category, index) => (
                  <div className="Test" key={category._id}>
                    <div>
                      <Categories
                        key={category._id}
                        category={category}
                        index={index}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </Swipeable>
          <Statusdivbottom />
        </Cover>
      )}
      <Outlet />
    </>
  );
};

export default ChannelMaincover;

const Cover = styled.div`
  min-width: 15rem;
  min-height: 100vh;
  position: relative;
  overflow: auto; /* Changed to auto */
  -webkit-overflow-scrolling: touch; /* Added */
  @media (max-width: 1024px) {
    position: absolute;
    left: 4.5rem;
    cursor: grab;
  }
  @media (max-width: 375px) {
    min-width: 15rem;
  }
  background-color: #2b2d31;
  z-index: 3141234;
  .Dropable {
    min-height: 1rem;
  }
  .Context {
    min-height: 80vh;
  }
`;

const Servername = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1.9px solid #1e1f22;
  div {
    color: #e0e0e0;
    font-family: "Roboto", sans-serif;
    h4 {
      font-family: "Roboto", sans-serif;
      font-weight: 500;
      font-size: 0.92rem;
      margin-left: 0.8rem;
    }
  }
  .drop {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
  }
`;
