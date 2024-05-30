import React, { useState } from "react";
import styled from "styled-components";
import Thread from "@images/Threadupdated.svg";
import plus from "@images/X.svg";
import { Switch } from "@/@components/ui/switch";
import { Label } from "@/@components/ui/label";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { setcreateThread } from "@/Redux/sessionSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
const Threadcreate = () => {
  const { channelId } = useParams();
  const [privateThread, setPrivateThread] = useState(false);
  const [threadName, setThreadName] = useState("");

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle login logic here
    if (e.key === "Enter") {
      queryClient.invalidateQueries({ queryKey: ["channeldata"] });

      if (threadName.length > 0) {
        console.log("Thread Name:", threadName);
        console.log("Private Thread:", privateThread);
      }
      axios
        .post(
          `/api/thread/${channelId}`,
          {
            title: threadName,
            content: threadName,
          },
          {
            withCredentials: true, // Important for cookies
          }
        )
        .then(function (response) {
          console.log(response);
          queryClient.invalidateQueries({ queryKey: ["channeldata"] });
          dispatch(setcreateThread(false));

          if (response.status === 200) {
            setThreadName("");
            setPrivateThread(false);
            queryClient.invalidateQueries({ queryKey: ["channeldata"] });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  //touch code

  return (
    <>
      <Cover>
        <div className="nav">
          <div>
            <img src={Thread} alt="" />
            <p>New Thread</p>
          </div>
          <img
            src={plus}
            onClick={() => dispatch(setcreateThread(false))}
            className="cross"
            alt=""
          />
        </div>
        <div className="Mainsection">
          <div>
            <img src={Thread} alt="" />
          </div>
          <p>Thread name</p>
          <input
            type="text"
            onChange={(e) => setThreadName(e.target.value)}
            required
            placeholder="New Thread"
          />
        </div>
        <div className="Endsection">
          <p>Private Thread</p>
          <div className="checkingdiv">
            <input
              type="checkbox"
              id="private"
              onClick={() => setPrivateThread(!privateThread)}
              className="checkbox"
            />
            <label htmlFor="private">
              Only people you invite and moderators can see
            </label>
          </div>
          <div>
            <input
              className="Inputmain"
              type="text"
              required
              placeholder="Enter a message to start the conversation"
              onKeyUp={handleSubmit}
            />
          </div>
        </div>
      </Cover>
    </>
  );
};

export default Threadcreate;

const Cover = styled.div`
  min-width: 25rem;
  height: 100vh;
  margin-left: 0.5rem;
  background-color: #313338;
  border-radius: 0.5rem;
  @media (max-width: 1263px) {
    position: absolute;
    top: 0;
    right: 0;
    border: 2px solid #26282b;
    z-index: 1000;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    color: white;
    border-bottom: 2px solid #26282b;
    padding: 0.5rem;
    div {
      display: flex;
      gap: 0.5rem;
      padding: 0.2rem;
      img {
        width: 1.5rem;
      }
    }
    .cross {
      width: 2rem;
    }
  }
  .Mainsection {
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0.5rem;
    gap: 0.5rem;
    div {
      width: 4rem;
      height: 4rem;
      border-radius: 100%;
      background-color: #41434a;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 2rem;
      }
      margin-bottom: 0.5rem;
    }
    p {
      color: #b5bac1;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    input {
      width: 100%;
      height: 2rem;
      background-color: #1e1f22;
      outline: none;
      color: #b5bac1;
      border: none;
      padding: 0.5rem;
      border-radius: 0.2rem;
    }
  }
  .Endsection {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    p {
      color: #b5bac1;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      p {
        color: #b5bac1;
        font-size: 0.75rem;
        font-weight: 400;
        text-transform: none;
      }
    }
    .Inputmain {
      height: 2.5rem;
      width: 100%;
      background-color: #383a40;
      outline: none;
      color: #b5bac1;
      border: none;
      padding: 0.5rem;
      border-radius: 0.2rem;
    }
    .checkbox {
      width: 1rem;
      font-size: 2rem;
    }
    .checkingdiv {
      margin-bottom: 0.5rem;
      label {
        color: #b5bac1;
      }
    }
  }
`;
