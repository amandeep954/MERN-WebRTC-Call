import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export default function socketProvider(props) {
  // const socket = useMemo(() => io("http://localhost:8000"), []);
  const socket = useMemo(
    () => io("https://webrtc-socket-server-bigp.onrender.com"),
    [],
  );
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
}
