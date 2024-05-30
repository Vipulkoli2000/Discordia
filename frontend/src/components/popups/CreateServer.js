import React, { useEffect, useState } from "react";
import styled from "styled-components";
import cross from "@images/X.svg";
import keys from "@images/keys.svg";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { setcreateserver } from "@Redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import upload from "@images/upload.svg";
import { toast, Toaster } from "sonner";

const CreateServer = () => {
  const queryClient = useQueryClient();
  const [isopen, setisopen] = useState(false);
  const [Joinopen, Setjoinopen] = useState(false);
  const [Servername, setServername] = useState("");
  const [Activeserver, setActiveserver] = useState(false);
  const [Mobileopen, setMobileopen] = useState(false);
  const [file, setFile] = useState("");

  const [currentwindowwidth, SetCurrentwidowwidth] = useState(
    window.innerWidth
  );
  const dispatch = useDispatch();

  const { createserver } = useSelector((state) => state.counterSlice);

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
  useEffect(() => {
    const handleResize = () => {
      SetCurrentwidowwidth(window.innerWidth);
      console.log(currentwindowwidth);
      if (currentwindowwidth < 1024) {
        dispatch(setcreateserver(false));
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth, currentwindowwidth]);

  // const handlefileupload = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await axios.post("/api/upload", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     console.log("File uploaded successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  return (
    createserver &&
    currentwindowwidth > 1024 && (
      <Cover onClick={() => dispatch(setcreateserver(false))}>
        {!isopen && !Joinopen && (
          <Maincontainer onClick={(e) => e.stopPropagation()}>
            <div className="Dummy">
              <div className="cross">
                <img
                  onClick={() => dispatch(setcreateserver(false))}
                  src={cross}
                  alt=""
                />
              </div>
              <div className="title">
                <h1>Create Your Server</h1>
                <p>
                  Your server is where you and your friends hang out. Make yours
                  and start talking
                </p>
              </div>
              <Createserverdiv onClick={() => setisopen(!isopen)}>
                <div>
                  <img src={keys} alt="" />
                  <h4>Create My Own</h4>
                </div>
                <img src={cross} alt="" />
              </Createserverdiv>
            </div>
            <Bottomdiv>
              <h4>Have an invite already?</h4>
              <button
                onClick={() => {
                  setisopen(false);
                  Setjoinopen(!Joinopen);
                  toast("You Should Ask Your Friend For A Invite Link");
                }}
              >
                Join a Server
              </button>
            </Bottomdiv>
          </Maincontainer>
        )}
        {isopen && (
          <Maincontainer onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="cross">
                <img onClick={() => setisopen(!isopen)} src={cross} alt="" />
              </div>
              <div className="title">
                <h1>Customize Your Server</h1>
                <p>
                  Give your new server a personality with a name and an icon.
                  You can always change it later.
                </p>
              </div>
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
                    <img className="uploadalt" src={upload} alt="upload" />
                  )}
                </div>
              </Inputfile>
              <div className="Servername">
                <p>Server Name</p>
                <input
                  id="serverName"
                  onChange={(e) => setServername(e.target.value)}
                  type="text"
                />
              </div>
            </div>
            <div className="bottomdiv">
              <p onClick={() => setisopen(false)}>Back</p>
              <button onClick={Serversubmit}>Create</button>
            </div>
          </Maincontainer>
        )}
        {Joinopen && (
          <Maincontainer onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="cross">
                <img
                  onClick={() => Setjoinopen(!Joinopen)}
                  src={cross}
                  alt=""
                />
              </div>
              <div className="title">
                <h1>Join a Server</h1>
                <p>Enter an invite below to join an existing server.</p>
              </div>
              <div className="Servername">
                <p className="Invite">INVITE LINK</p>
                <input type="text" />
              </div>
            </div>
            <div className="bottomdiv">
              <p
                onClick={() => {
                  setisopen(false);

                  Setjoinopen(!Joinopen);
                }}
              >
                Back
              </p>
              <Toaster closeButton richColors position="top-center" />
              <button>Join Server</button>
            </div>
          </Maincontainer>
        )}
      </Cover>
    )
  );
};

export default CreateServer;
const Inputfile = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .Innercontainer {
    margin-top: 2rem;
    width: 5rem;
    height: 5rem;
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
    gap: 1rem;
    .uploadalt {
      border-radius: 0%;
      pointer-events: none;
    }
    input {
      width: 5rem;
      height: 6rem;
      border-radius: 0.5rem;
      border: none;
      background-color: #1e1f22;
      opacity: 0;
      cursor: pointer;
      position: relative;
    }
    img {
      width: 100%;
      height: 100%;
      pointer-events: none;
      position: absolute;
      border-radius: 100%;
      z-index: 13241;
    }
  }
`;

const Cover = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0e0f10ad;
  position: absolute;
  top: 0;
  z-index: 100000000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Maincontainer = styled.div`
  width: 30rem;
  height: 30rem;
  background-color: #313338;
  border-radius: 0.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .cross {
    position: absolute;
    top: 1rem;
    right: 1rem;
    img {
      width: 2rem;
    }
  }
  .Dummy {
    padding: 1rem;
  }
  .title {
    width: 90%;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-left: 1rem;
    h1 {
      font-size: 1.55rem;
      margin-bottom: 0.5rem;
      color: white;
      font-weight: bold;
    }
    p {
      color: #b5bac1;
    }
  }
  .Servername {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    gap: 0.5rem;
    color: #ffffffb1;
    .Invite {
      font-size: 0.8rem;
      font-weight: bold;
      font-family: "cabin" sans-serif;
    }
    p {
      font-size: 1.1rem;
      font-weight: bold;
      font-family: "cabin" sans-serif;
    }
    input {
      width: 100%;
      height: 2.2rem;
      padding: 0.5rem 0.5rem;
      border: none;
      border-radius: 0.3rem;
      background-color: #1e1f22;
      color: white;
    }
  }
  .bottomdiv {
    width: 100%;
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    background-color: #2b2d31;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    p {
      color: #b5bac1;
      font-weight: bold;
      font-family: "cabin" sans-serif;
      margin-left: 1rem;
      cursor: pointer;
    }
    button {
      height: 2.5rem;
      background-color: #5865f2;
      color: white;
      padding: 0.4rem 1rem;
      border: none;
      padding-inline: 2rem;
      border-radius: 0.2rem;
      font-weight: bold;
      font-family: "cabin" sans-serif;
      cursor: pointer;
      margin-right: 1rem;
    }
  }
`;

const Createserverdiv = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  background-color: aliceblue;
  border-radius: 0.5rem;
  img {
    width: 1.5rem;
    margin-right: 1rem;
  }
  div {
    margin-left: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 3rem;
    }
  }
`;

const Bottomdiv = styled.div`
  width: 100%;
  height: 6.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  background-color: #2b2d31;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  @media (max-width: 450px) {
    padding-bottom: 4rem;
    padding-bottom: calc(env(safe-area-inset-bottom) + 4.5rem);
  }
  h4 {
    color: #b5bac1;
  }
  button {
    height: 2.5rem;
    background-color: #4e5058;
    color: white;
    padding: 0.4rem 1rem;
    border: none;
    border-radius: 0.2rem;
    padding-inline: 11rem;
  }
`;
