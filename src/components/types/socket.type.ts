export enum SocketMessage {
  ORDER_UPDATED = "orderUpdated",
  ORDER_CREATED = "orderCreated",
  ORDER_COMPLETED = "orderCompleted",
}
export enum SocketEmitMessage {
  ORDER_UPDATE = "orderUpdate",
  ORDER_CREATE = "orderCreate",
  ORDER_COMPLETE = "orderComplete",
}

export type SocketHookType = {
  on: (event: string, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  connect: () => void;
  disconnect: () => void;
};
