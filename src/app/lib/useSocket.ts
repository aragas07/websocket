import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function useSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // ensure the server boots
    fetch("/api/socket");

    if (!socket) {
      socket = io("http://localhost:3001", {
        path: "/api/socket",
      });
    }

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return { socket, connected };
}
