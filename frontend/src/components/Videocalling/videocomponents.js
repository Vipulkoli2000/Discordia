import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Videocomponents = ({
  track,
  kind,
  serverConsumerId,
  producerId,
  consumerTransports,
  socket,
  Selftrack,
}) => {
  console.log(Selftrack);
  const [isPaused, setIsPaused] = useState(false);
  const [Buttonclicked, setButtonclicked] = useState(false);
  const container = useRef();
  const { contextSafe } = useGSAP({ scope: container });
  const mediaRef = useRef();

  const handleSubmit = (producerId, serverConsumerId, track, kind) => {
    socket.emit("consumer-pause", {
      producerId: producerId,
      serverConsumerId: serverConsumerId,
    });
    console.log(track.muted);
    track.enabled = false;
    unmountanimated();
    Videopactiy();
  };

  const handleresume = (serverConsumerId, producerId) => {
    socket.emit("consumer-resume", {
      serverConsumerId: serverConsumerId,
      producerId: producerId,
    });
    setIsPaused(false);

    track.enabled = true;
    unmountanimated();
    Videoresume();
  };

  useEffect(() => {
    if (mediaRef.current && track) {
      mediaRef.current.srcObject = new MediaStream([track]);
      console.log(track, "MAPING", Selftrack);
    }
  }, [track]);

  const unmountanimated = contextSafe(() => {
    gsap.to(".buttons", {
      yPercent: -100,
      opacity: 0,
      duration: 0.2,
      ease: "back.out(1.7)",
      onComplete: () => {
        setButtonclicked(false);
      },
    }),
      { scope: container.current, dependencies: [Buttonclicked] };
  });
  const Videopactiy = contextSafe(() => {
    gsap.to(".Video", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setIsPaused(true);
      },
    });
  });
  const Videoresume = contextSafe(() => {
    gsap.to(".Video", { opacity: 1, duration: 0.5 });
  });

  useGSAP(
    () => {
      gsap.fromTo(
        ".buttons",
        { yPercent: -100, duration: 0.5 },
        {
          yPercent: 0,
          ease: "back.out(1.7)",
        }
      );
    },
    { scope: container.current, dependencies: [Buttonclicked] }
  );

  return kind === "video" ? (
    <Outermain ref={container} onClick={() => setButtonclicked(true)}>
      <div
        style={{ display: isPaused ? "block" : "none" }}
        className="cova"
      ></div>
      <Cover className="Video" style={{ display: isPaused ? "none" : "block" }}>
        {track && <video ref={mediaRef} autoPlay playsInline muted></video>}
      </Cover>
      {Buttonclicked && (
        <div className="buttons">
          <button
            onClick={() =>
              handleSubmit(producerId, serverConsumerId, track, kind)
            }
          >
            pause
          </button>
          <button onClick={() => handleresume(serverConsumerId, producerId)}>
            resume
          </button>
        </div>
      )}
    </Outermain>
  ) : (
    <audio ref={mediaRef} autoPlay></audio>
  );
};

export default Videocomponents;
const Outermain = styled.div`
  width: 30rem;

  position: relative;
  margin-top: 1rem;
  border-radius: 0.4rem;

  padding-bottom: 17.2rem;
  padding-right: 30rem;
  z-index: 1;
  @media (max-width: 1440px) {
    width: 20rem;
    padding-right: 20rem;
    padding-bottom: 11.4rem;
    .cova {
      width: 20rem;
    }
  }
  @media (max-width: 768px) {
    width: 14rem;
    padding-right: 14rem;
    padding-bottom: 5.4rem;
    .cova {
      width: 14rem;
    }
  }
  .buttons {
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    bottom: -2.5rem;
    right: 0rem;
    z-index: 0;

    background: rgb(0, 0, 0);
    background: linear-gradient(
      355deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(3, 3, 3, 0.9780287114845938) 23%,
      rgba(6, 6, 6, 1) 47%,
      rgba(8, 8, 8, 0.9752275910364145) 79%,
      rgba(3, 3, 3, 1) 100%
    );
    border-radius: 0.4rem;
    button {
      background-color: transparent;
      border: none;
      color: white;
      font-size: 0.8rem;
      cursor: pointer;
      font-family: "Cabin", sans-serif;
      font-weight: bold;
      letter-spacing: 0.1px;
      text-transform: uppercase;
    }
  }
  .cova {
    position: absolute;
    width: 30rem;
    height: 100%;
    border-radius: 0.4rem;
    z-index: 22;
    background-color: #c2c9c4;
  }
`;

const Cover = styled.div`
  width: 30rem;
  position: absolute;
  border-radius: 0.4rem;
  z-index: 22;

  .buttons {
    width: 2rem;
    height: 2rem;
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
  }
  video {
    max-width: 30rem;
    max-height: 17.3rem;
    position: relative;
    z-index: 124124;
    border-radius: 0.4rem;
    border: none;
    outline: none;
    z-index: 22;
    @media (max-width: 1440px) {
      max-width: 20rem;
      max-height: 11.3rem;
    }
    @media (max-width: 768px) {
      width: 14rem;
      max-height: 8.2rem;
    }
  }
  @media (max-width: 1440px) {
    width: 20rem;
  }
  @media (max-width: 768px) {
    width: 14rem;
  }
`;
