import React,{useRef, useEffect} from 'react'
import { HMSReactiveStore,selectScreenShareByPeerID, useHMSActions, useHMSStore, selectPeers,useHMSNotifications,selectIsSomeoneScreenSharing } from "@100mslive/react-sdk";
import styled from 'styled-components';
const Screensharetile = ({ screenShareTrack }) => {
    const videoRef = useRef(null);
  const hmsActions = useHMSActions();

  useEffect(() => {
    if (screenShareTrack && videoRef.current) {
      hmsActions.attachVideo(screenShareTrack.id, videoRef.current);
    }
  }, [screenShareTrack, hmsActions]);
  return (
     <Videoelement ref={videoRef} autoPlay playsInline />
 
    )
}

export default Screensharetile

const Videoelement=  styled.video`
    width: 15rem;
    height:12rem;
`