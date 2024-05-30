import React from "react";
import styled from "styled-components";
import Plus from "../../images/uploadsvg.svg";
import X from "../../images/X.svg";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setTrigger } from "@/Redux/sessionSlice";
import { useQueryClient } from "@tanstack/react-query";

const Friendcomponent = ({ user }) => {
  const dispatch = useDispatch();
  const usera = user?.users[0]?._id;
  const queryClient = useQueryClient();
  const deletetab = () => {
    axios
      .post(
        `/api/users/deleteuser/delete`,
        { userid: usera }, // Include the userid in the request body
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        queryClient.invalidateQueries({ queryKey: ["directmessages"] });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Cover>
      <div className="Profile">
        <img
          src="https://biscord.blr1.cdn.digitaloceanspaces.com/MV5BOTEwYWFjYmItZWJmNi00MGExLWI1MjktYzRiYjJkNzhiMWIxXkEyXkFqcGdeQXNuZXNodQ@@._V1_.jpg"
          alt=""
        />
        <p>{user?.users[0]?.username}</p>
      </div>
      <div className="Buttondiv">
        <img onClick={deletetab} src={X} alt="" />
      </div>
    </Cover>
  );
};

export default Friendcomponent;

const Cover = styled.div`
  width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  justify-content: space-between;
  gap: 4rem;
  .Profile {
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
    gap: 0.5rem;
    img {
      width: 2rem;
      height: 2rem;
      border-radius: 100%;
      object-fit: cover;
    }
  }
  .Buttondiv {
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 1.5rem;
    }
  }
`;
