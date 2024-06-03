import { UserType } from "./userType";

export interface User {
    id: string;
    username: string;
    type: UserType;
  }