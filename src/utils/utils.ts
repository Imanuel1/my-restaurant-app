import { SocketMessage } from "../components/types/socket.type";
import { UserType } from "../interface/userType";

export const isMyBirthday = (birthday: Date): boolean => {
  const today = new Date();

  const todayDay = today.getDate();
  const todayMonth = today.getMonth(); // Months are zero-indexed (January = 0)

  // Get birthday date components (assuming birthday is a Date object)
  const birthdayDay = birthday.getDate();
  const birthdayMonth = birthday.getMonth();

  // Check if day and month match
  return todayDay === birthdayDay && todayMonth === birthdayMonth;
};

export const messageFilter = (
  userType: UserType | undefined,
  userId: string | undefined,
  messageUserId: string | undefined,
  messageTableNumber: string | undefined,
  status: SocketMessage
): boolean => {
  switch (userType) {
    case UserType.Manager:
    case UserType.Worker:
      return true;
    case UserType.Client:
      return status === SocketMessage.ORDER_UPDATED && userId === messageUserId;
    default:
      return (
        status === SocketMessage.ORDER_UPDATED &&
        messageTableNumber == localStorage.getItem("tableNumber")
      );
  }
};
