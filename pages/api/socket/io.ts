import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    // Disabling bodyParser because we don't need information from the request body (POST, PUT, PATCH content, etc.), and so disabling bodyParser reduces the load and increases performance, as there is no need to process the request body content.
    bodyParser: false,
  },
};

// This handler is used to create a socket.io server instance and attach a http server if it doesn't already exist.
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";

    const httpServer: NetServer = res.socket.server as any;    
    // httpServer is an instance of an HTTP server (or NetServer in the case of Node.js)
    // that Socket.IO will integrate with this HTTP server to perform real-time communication.

    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    // Once the HTTP server receives a request and the io has been created, 
    // Socket.IO will start listening for requests to the specified path

    res.socket.server.io = io;
    
    io.on('connection', socket => {
      socket.on('server-has-changed', msg => {
        io.emit('should-update-server-contents', msg)
      })
    })
  }

  res.end();
  // Finally, the function will end the response without sending any data, accepting that the WebSocket connection has been established.
};

// When you create an instance of ServerIO with httpServer as the first parameter,
// you are telling that Socket.IO should integrate and listen for WebSocket connections on the created HTTP server (httpServer).

export default ioHandler;
