import { useState , useEffect, useRef} from "react";
 import { HMSReactiveStore,selectScreenShareByPeerID, useHMSActions, useHMSStore, selectPeers,useHMSNotifications,selectIsSomeoneScreenSharing } from "@100mslive/react-sdk";
 import Screensharetile from "Screensharetile";
 import { HMSRoomProvider, HMSVideoGrid } from '@100mslive/react-sdk';
import styled from "styled-components";
import io from 'socket.io-client';

const socket = io('http://localhost:3000');  


 const PeerVideo = ({ peer ,videoEnabled,screenshareOn}) => {
  const videoRef = useRef(null);
  const hmsActions = useHMSActions();
  const screenShareTrack = useHMSStore(selectScreenShareByPeerID(peer.id));
 
  useEffect(() => {

    console.log("useEffect triggered for peer: ", screenshareOn);
    let trackToAttach = peer.videoTrack;
     
    if (trackToAttach && videoRef.current) {
      hmsActions.attachVideo(trackToAttach, videoRef.current);
    }
  }, [peer.videoTrack, screenShareTrack, hmsActions, peer.id]);

const Removepeer = async() =>{
      try{
        const reason = 'Good Bye';
      await hmsActions.removePeer(peer.id, reason)
      }catch(error){
        console.error(error)
      }
}

  return (
    <Videodiv>
    {screenshareOn &&(
       <Screensharetile screenShareTrack={screenShareTrack} />

    )}
      <Videoelement ref={videoRef} autoPlay playsInline  />
      <button onClick={Removepeer}>Remove user</button>
   </Videodiv>);

    
    

};

 const Test = () => {
  
    const hmsActions = useHMSActions();
    const peers = useHMSStore(selectPeers);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const notification = useHMSNotifications();
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [messages, Setmessages] = useState([]);
     const screenshareOn = useHMSStore(selectIsSomeoneScreenSharing);

    const joinRoom = async () => {
      // Replace these with actual token and roomId from your server
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NTYwN2FhOWNhNTg0OGYwZTNkNDc0OTkiLCJyb2xlIjoiaG9zdCIsInJvb21faWQiOiI2NTYwN2FlNzZjNGZjM2FhOTI1Y2JiOWQiLCJ1c2VyX2lkIjoiNGM2NzZiMGItZDdkNy00OTEwLWEzNzAtNDZlYzhiMTUxOGViIiwiZXhwIjoxNzAxMzMxNjk5LCJqdGkiOiI1ODEwNjEzZi03MWU1LTQ2YTctYTgzYi03NjY4YjI5MjlkYzgiLCJpYXQiOjE3MDEyNDUyOTksImlzcyI6IjY1NjA3YWE5Y2E1ODQ4ZjBlM2Q0NzQ5NyIsIm5iZiI6MTcwMTI0NTI5OSwic3ViIjoiYXBpIn0.cV9lKG8WWiLpKo0dp1P_f85SPhzyD1uD0RK1lAb7JOQ';
      const roomId = 'nzb-shwy-fev';
  
      await hmsActions.join({
        userName: 'User Name',
        authToken: token,
        roomId,
      });
    };
    
  
    const toggleAudio = () => {
      hmsActions.setLocalAudioEnabled(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    };
  
    const toggleVideo = () => {
      hmsActions.setLocalVideoEnabled(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    };
    const sendmessage = () => {

         const messageData = {
          user: "654748baf47164cb99ec25a5",
        content : "Thiwhy ng",
         channel: "656cceb5da6e60628262c278",
        }
        Setmessages([...messages , messageData.content])
        socket.emit('send_message', messageData);
    
      
    };

    const handleScreenShare = async () => {
      try{
         await hmsActions.setScreenShareEnabled(true);
       }
      catch(error){
        console.log(error)
      }
    };
    
   return (
    <Cover>
      <div>Notification: {notification?.type}</div>      
      <Tracks id="video-container">
        {peers.map(peer => (
          <PeerVideo  screenshareOn={screenshareOn} videoEnabled={videoEnabled} key={peer.id} peer={peer} />
        ))}
      </Tracks>
      <button onClick={handleScreenShare}>
        {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      </button>
      <button onClick={joinRoom}>Join Call</button>
       <button onClick={toggleAudio}>
        {audioEnabled ? 'Mute' : 'Unmute'}
      </button>
      <button onClick={toggleVideo}>
        {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
      </button>
      <button onClick={sendmessage}>
          chat
      </button>
      <p>{messages}</p>
      {messages.map((con, i)=>{
        <p>{con}</p>
      })}
    </Cover>
   )
 }
 
 export default Test

 const Cover = styled.div`
 width: 100vw;
 height: 50vh;
 `
 const Videodiv = styled.div`
  min-width: 15rem;
  height: 15rem;
  display: flex;
 `
  
  const Videoelement = styled.video`
  width: 15rem;
  height: 12rem;
`
const Tracks= styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: antiquewhite;
`