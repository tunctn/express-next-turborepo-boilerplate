import type { Server as HttpServer } from "node:http";
import { CORS_OPTIONS } from "@/config/cors";
import type { SocketEventName, SocketEvents } from "@packages/shared";
import { Server } from "socket.io";

let socketService: Server;

export function setupSocket(httpServer: HttpServer) {
  socketService = new Server(httpServer, {
    cors: CORS_OPTIONS,
  });

  socketService.on("connection", (socket) => {
    socket.on("join_room" as SocketEventName, (data: SocketEvents["join_room"]) => {
      socket.join(data.room_id);
    });

    socket.on("leave_room" as SocketEventName, (data: SocketEvents["leave_room"]) => {
      socket.leave(data.room_id);
    });
  });

  return socketService;
}

const emitToRoom = <EventName extends keyof SocketEvents>(event: EventName, roomId: string, eventData: SocketEvents[EventName]) => {
  if (!socketService) {
    throw new Error("Socket service not initialized");
  }
  socketService.to(roomId).emit<EventName>(event, eventData);
};

const emitGeneral = <EventName extends keyof SocketEvents>(event: EventName, eventData: SocketEvents[EventName]) => {
  if (!socketService) {
    throw new Error("Socket service not initialized");
  }
  socketService.emit<EventName>(event, eventData);
};

const on = <EventName extends keyof SocketEvents>(event: EventName, callback: (data: SocketEvents[EventName]) => void) => {
  if (!socketService) {
    throw new Error("Socket service not initialized");
  }
  socketService.on<EventName>(event, callback as any);
};

export const io = {
  emitToRoom,
  emitGeneral,
  on,
};
