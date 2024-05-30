import React, { useState, useEffect } from "react";
import messageimg from "@images/messagefriendsection.svg";
import settings from "@images/3dots.svg";
import solo from "@images/solo.jfif";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";

const Onlineuserlist = () => {
  const [users, setusers] = useState([]);
  const [query, setquery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users/users/getusers");
        setusers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Cover>
      <div>
        <Searchbar>
          <input
            onChange={(e) => setquery(e.target.value)}
            type="text"
            placeholder="Search"
          />
          <img src={settings} alt="" />
        </Searchbar>
      </div>
      <Textonline>
        <p>online</p>
        <p>-</p>
        <p>{users.length}</p>
      </Textonline>
      <Onlineuserswrapper>
        {users
          .filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
          )
          .map((user) => (
            <>
              <div className="Seperator"></div>

              <Link
                to={`/@me/${user._id}`}
                key={user._id}
                style={{ textDecoration: "none" }}
              >
                <Container key={user._id}>
                  <div className="Firstdivwrapper">
                    <div className="image">
                      <img src={solo} alt="" />
                    </div>
                    <div className="Statusdiv">
                      <p className="name">{user.username}</p>
                      <p className="status">online</p>
                    </div>
                  </div>
                  <div className="Seconddivwrapper">
                    <div className="Message">
                      <img src={messageimg} alt="" />
                    </div>
                    <div className="settings">
                      <img src={settings} alt="" />
                    </div>
                  </div>
                </Container>
              </Link>
            </>
          ))}
      </Onlineuserswrapper>
    </Cover>
  );
};

export default Onlineuserlist;

const Cover = styled.div`
  width: 65vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  padding-left: 1.5rem;
  gap: 1rem;
  .Seperator {
    width: 95%;
    height: 0.5px;
    background-color: #b8b8b81e;
  }
`;

const Searchbar = styled.div`
  width: 60vw;
  background-color: #1e1f22;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 0.25rem;
  margin-top: 1rem;
  input {
    width: 100%;
    height: 2rem;
    padding: 0.4rem;
    outline: none;
    border: none;
    background-color: transparent;
    border-radius: 0.2rem;
    color: white;
  }
  img {
    pointer-events: none;
    position: absolute;
    right: 0.5rem;
    width: 1.5rem;
  }
`;

const Textonline = styled.div`
  display: flex;
  gap: 0.2rem;
  padding: 0.2rem;
  margin-top: 0.5rem;
  p {
    font-size: 0.8rem;
    text-transform: uppercase;
    font-family: "Cabin", sans-serif;
    font-weight: bold;
    color: #9b9b9b;
  }
`;

const Onlineuserswrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5;
`;

const Container = styled.div`
  width: 95%;
  height: 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem;
  border-radius: 0.5rem;
  p {
    margin: 0;
    color: #ffffffa0;
    letter-spacing: 0.5px;
  }
  .name {
    color: white;
    letter-spacing: 0.5px;
  }
  .Firstdivwrapper {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    .image {
      width: 2.2rem;
      height: 2.2rem;
      display: flex;
      align-items: center;
      margin-left: 0.5rem;
      border-radius: 100%;
      img {
        width: 100%;
        object-fit: cover;
        height: 100%;
        border-radius: 100%;
        border: 1px solid #4c4f55;
      }
    }
    .Statusdiv {
      display: flex;
      flex-direction: column;
      .name {
        font-size: 1rem;
        font-weight: bold;
      }
      .status {
        font-size: 0.8rem;
      }
    }
  }
  .Seconddivwrapper {
    display: flex;
    gap: 0.5rem;
    padding-right: 0.5rem;
    .Message {
      width: 2.2rem;
      height: 2.2rem;
      background-color: #2b2d31;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      img {
        width: 1.2rem;
      }
    }
    .settings {
      background-color: #2b2d31;
      justify-content: center;

      width: 2.2rem;
      height: 2.2rem;
      display: flex;
      align-items: center;
      border-radius: 100%;

      img {
        width: 1.2rem;
      }
    }
  }
`;
