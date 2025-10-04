import { Server as IOServer } from 'socket.io';
import { NextRequest } from "next/server";
export const config = {
  api: {
    bodyParser: false, // disable body parsing for socket.io
  },
};

declare global {
  var io: IOServer | undefined;
}

//const globalAny: any = global;
export async function GET(req: NextRequest) {
  if (!global.io) {
    console.log("⚡ Starting Socket.IO server...");

    // Create Socket.IO server and attach it to the underlying Next.js HTTP server
    const io = new IOServer({
      path: "/api/socket",
      cors: {
        origin: "https://websocketpractice-p64q.onrender.com",
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ Client connected");

      socket.on("newData", (data) => {
        io.emit("updateData", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected");
      });
    });

    global.io = io;
  }

  return new Response("Socket.IO server running", { status: 200 });

}
