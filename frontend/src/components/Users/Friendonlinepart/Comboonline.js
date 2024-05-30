import React from "react";
import Navfriend from "./Navfriend";
import styled from "styled-components";
import Onlineuserlist from "./Onlineuserlist";
import { useSelector } from "react-redux";
import Addfriendpart from "./addfriendpart";
const Comboonline = () => {
  const { Directmessagetoggle } = useSelector((state) => state.counterSlice);
  const { addfriendflag } = useSelector((state) => state.counterSlice);
  const { userlist } = useSelector((state) => state.counterSlice);
  return (
    !Directmessagetoggle && (
      <Cover>
        <Navfriend />
        {addfriendflag && <Addfriendpart />}
        {userlist && <Onlineuserlist />}
      </Cover>
    )
  );
};

export default Comboonline;

const Cover = styled.div`
  width: 90vw;
  background-color: #313338;
  overflow: hidden;
`;
