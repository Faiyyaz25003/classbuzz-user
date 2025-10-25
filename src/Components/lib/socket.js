// simple singleton socket client
import { io } from "socket.io-client";

let socket;

export const initSocket = (clientUrl = "http://localhost:5000") => {
  if (!socket) {
    socket = io(clientUrl, { transports: ["websocket"] });
  }
  return socket;
};

export const getSocket = () => socket;
