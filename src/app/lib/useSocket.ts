import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;
export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    fetch("/api/socket");
    if (!socket) {
      socket = io({
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
};
