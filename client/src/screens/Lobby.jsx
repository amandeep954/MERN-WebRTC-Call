import { useState, useCallback, useEffect } from "react";
import { useSocket } from "../context/socketProvider";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handelSumitform = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:Join", { email, room });
    },
    [email, room, socket],
  );

  const handelJoinRoom = useCallback((data) => {
    const { email, room } = data;
    console.log(`${email} joined room ${room}`);
    navigate(`/rooms/${room}`);
  }, [navigate]);

  useEffect(() => {
    socket.on("room:Join", handelJoinRoom);
    return () => socket.off("room:Join", handelJoinRoom);
  }, [socket, handelJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handelSumitform}>
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="room">Room Number: </label>
        <input
          type="text"
          id="room"
          name="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
        <br />
        <button type="submit">Join</button>
      </form>
    </div>
  );
}
