import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Plus from "../../images/PlusDi.svg";
import Friendcomponent from "./Friendcomponent";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setDirectmessage } from "@/Redux/sessionSlice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DirectMessage = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const queryClient = useQueryClient();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/users/messages/getdirectmessage`);
      setUsers(response.data);

      return response.data;
    } catch (error) {
      throw new Error("Error fetching server data: " + error.message);
    }
  };
  const { data, status } = useQuery({
    queryKey: ["directmessages"],
    queryFn: fetchMessages,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error("Error fetching server list:", error);
    },
    // You generally don't need to pass the queryClient in the options. It's used differently in v5.
  });
  console.log(data);

  // useEffect(() => {
  //   axios
  //     .get("/api/users/messages/getdirectmessage", {
  //       withCredentials: true, // Important for cookies
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       setUsers(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [trigger]);
  console.log(users);
  return (
    <Cover>
      <Maindiv>
        <p>DIRECT MESSAGES</p>
        <img src={Plus} alt="" />
      </Maindiv>
      <FriendWrapper>
        {data &&
          data.map((user) => {
            console.log(user.users[0]?._id);
            return (
              <Link
                to={`/@me/${user.users[0]?._id}`}
                style={{ textDecoration: "none", color: "#BDBDBD" }}
              >
                <Friendcomponent key={user._id} user={user} />
              </Link>
            );
          })}
      </FriendWrapper>
    </Cover>
  );
};

export default DirectMessage;

const Cover = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: #2b2d31;
`;

const Maindiv = styled.div`
  width: 88%;
  height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-size: 0.7rem;
    color: #a0a0a0;
    font-family: "UniSans", sans-serif;
    font-weight: bold;
  }
  img {
    width: 1.2rem;
  }
`;

const FriendWrapper = styled.div`
  width: 92%;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;
