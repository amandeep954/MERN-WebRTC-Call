import { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../context/socketProvider";
import peer from "../service/peer"; 

export default function Room() {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [MyStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const handelUserJoined = useCallback(({ email, id }) => {
    console.log(`${email} joined`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
  }, [socket]);

  const sendStreams = useCallback(() => {
    for (const track of MyStream.getTracks()) {
      peer.peer.addTrack(track, MyStream);
    }
  }, [MyStream]);

 
  const handleCallAccepted = useCallback(({ from, ans }) => {
    peer.setRemoteDescription(ans); 
    console.log("Call Accepted!");
    sendStreams();
  }, [sendStreams]);

  
  const handleIncomingIce = useCallback(async ({ candidate }) => {
    if (candidate) {
      await peer.peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans });
  }, [socket]);


  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setRemoteDescription(ans);
  }, []);

  useEffect(() => {
    if (MyStream && myVideoRef.current) myVideoRef.current.srcObject = MyStream;
  }, [MyStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  // UseEffect for Tracks
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    const handleIceCandidate = (ev) => {
      if (ev.candidate && remoteSocketId) {
        socket.emit("ice:candidate", { candidate: ev.candidate, to: remoteSocketId });
      }
    };
    peer.peer.addEventListener("icecandidate", handleIceCandidate);
    return () => {
      peer.peer.removeEventListener("icecandidate", handleIceCandidate);
    };
  }, [socket, remoteSocketId]);

  useEffect(() => {
    socket.on("user:Joined", handelUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("ice:candidate", handleIncomingIce); 

    return () => {
      socket.off("user:Joined", handelUserJoined); 
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("ice:candidate", handleIncomingIce); 
    };
  }, [socket, handelUserJoined, handleIncommingCall, handleCallAccepted, handleNegoNeedIncomming, handleNegoNeedFinal, handleIncomingIce]);

  return (
    <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? `Connected` : "No one in room"}</h4>
      {MyStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}

      {MyStream && (
        <>
          <h4>My Stream</h4>
          <video ref={myVideoRef} autoPlay playsInline muted height="300px" width="300px" style={{ borderRadius: "10px", backgroundColor: "#000" }} />
        </>
      )}
      {remoteStream && (
        <>
          <h4>Remote Stream</h4>
          <video ref={remoteVideoRef} autoPlay playsInline height="300px" width="300px" style={{ borderRadius: "10px", backgroundColor: "#000" }} />
        </>
      )}
    </div>
  );
}