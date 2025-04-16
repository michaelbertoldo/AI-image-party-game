import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  // Check if Socket.IO server is already initialized
  if ((res.socket as any).server.io) {
    console.log('Socket.IO server already running');
    res.end();
    return;
  }

  // Initialize Socket.IO server
  const io = new Server((res.socket as any).server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });
  
  // Store the Socket.IO server instance
  (res.socket as any).server.io = io;

  // Set up Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
    
    // Forward all events to the appropriate handlers in socketServer.ts
    // This is just a bridge between the Next.js API route and our Socket.IO server implementation
  });

  console.log('Socket.IO server initialized');
  res.end();
}
