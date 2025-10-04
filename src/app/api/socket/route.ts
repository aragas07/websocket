import { NextRequest } from "next/server";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

// Prevent multiple instances (hot reload friendly)

declare global {
  var io: IOServer | undefined;
}

export const config = {
  api: {
    bodyParser: false, // disable body parsing
  },
};

export async function GET() {
  if (!global.io) {
    console.log("⚡ Starting Socket.IO server...");

    // Create Socket.IO server and attach it to the underlying Next.js HTTP server
    const io = new IOServer(3001, {
      path: "/api/socket",
      cors: {
        origin: "*",
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
