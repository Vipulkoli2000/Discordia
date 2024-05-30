import React from "react";
import friends from "../../images/Friendtab.svg";
import Nitro from "../../images/Nitro.svg";
import Message from "../../images/Messages.svg";
import Shop from "../../images/Shop.svg";
import styled from "styled-components";
import { toast, Toaster } from "sonner";

const Buttonsection = () => {
  return (
    <Cover>
      <Toaster closeButton richColors position="bottom-right" />

      <Div>
        <img src={friends} alt="" />
        <p>Friends</p>
      </Div>
      <Div
        onClick={() =>
          toast.success("Comming Soon, Stay Tuned!", {
            position: "bottom-right",
            duration: 1000,
          })
        }
      >
        <img src={Nitro} alt="" />
        <p>Nitro</p>
      </Div>
      <Div
        onClick={() =>
          toast.success("Comming Soon, Stay Tuned!", {
            position: "bottom-right",
            duration: 1000,
          })
        }
      >
        <img src={Message} alt="" />
        <p>Message Request</p>
      </Div>
      <Div
        onClick={() =>
          toast.success("Comming Soon, Stay Tuned!", {
            position: "bottom-right",
            duration: 1000,
          })
        }
      >
        <img src={Shop} alt="" />
        <p>Shop</p>
      </Div>
    </Cover>
  );
};

export default Buttonsection;

const Cover = styled.div`
  margin-top: 0.5rem;
  width: 100%;
  height: 13rem;
  background-color: #2b2d31;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.2rem;
`;
const Div = styled.div`
  width: 93%;
  height: 2.6rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  border-radius: 0.2rem;
  &:hover {
    background-color: #313338;
  }
  img {
    margin-left: 0.8rem;
    width: 1.5rem;
  }
  p {
    font-size: 1rem;
    color: #949ba4;
    font-weight: medium;
  }
`;
