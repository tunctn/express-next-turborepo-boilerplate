export interface SocketEvents {
  join_room: { room_id: string };
  leave_room: { room_id: string };

  my_first_event: {
    room_id: string;

    metadata_1: string;
    metadata_2: string;
  };
}
export type SocketEventName = keyof SocketEvents;

export const getSocketRoomId = (eventName: SocketEventName) => {
  if (eventName === "my_first_event") {
    return (roomId: string) => `my_first_event_${roomId}`;
  }
  throw new Error(`Unknown event name: ${eventName}`);
};

export interface SocketEvent<T extends SocketEventName> {
  name: T;
  data: SocketEvents[T];
}
