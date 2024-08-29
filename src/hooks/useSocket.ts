// src/hooks/useSocket.ts
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:4000"; // "https://relic-flint-grouse.glitch.me/"; // Replace with your server URL

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connect = useCallback(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);
    setIsConnected(true);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, []);

  const on = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  const emit = useCallback(
    (event: string, data: any) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  return { on, emit, connect, disconnect, isConnected };
};

export default useSocket;
