export enum SocketMessage {
  ORDER_UPDATED = "orderUpdated",
  ORDER_CREATED = "orderCreated",
  ORDER_COMPLETED = "orderCompleted",
}

export type SocketHookType = {
  on: (event: string, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  connect: () => void;
  disconnect: () => void;
};
