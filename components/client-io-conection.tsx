"use client";

import React, { use, useEffect, useState } from "react";
import { io } from "socket.io-client";

const ClientSocketTestConection = () => {
  const [socket, setSocket] = useState(null);
  const [conectionStatus, setConectionStatus] = useState("Polling.....")
    useEffect(() => {
    const socketInstance = new (io as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    //  socketInstance.on is used to register event listeners on the socket object

    socketInstance.on("connect", () => {
      setConectionStatus("Connected");
        console.log("Connected");
    });
    socketInstance.on("disconnect", () => {
      setConectionStatus("Disconnected");
      console.log("Disconnected");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  },[]);

  return <div className="text-indigo-400 font-bold p-6">{conectionStatus}</div>;
};

export default ClientSocketTestConection;
