import { ADMIN_NAME } from "./constants";
import { IUser } from "./redux/types";

export const isAdmin = (user: IUser | null) => {
  return user?.name === ADMIN_NAME;
};
