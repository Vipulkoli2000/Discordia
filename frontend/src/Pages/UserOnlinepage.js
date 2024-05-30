import React, { useEffect } from "react";
import Serverbar from "@components/servers/Serverbar";
import Searchtabtop from "@components/Users/friendtab/Searchtabtop";
import styled from "styled-components";
import Navfriend from "@components/Users/Friendonlinepart/Comboonline";
const Useronlinepage = () => {
  return (
    <Cover>
      <Serverbar />
      <Searchtabtop />
      <Navfriend />
    </Cover>
  );
};

export default Useronlinepage;

const Cover = styled.div`
  display: flex;
`;
