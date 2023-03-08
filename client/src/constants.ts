export const ADMIN_NAME = "admin";

export const ROWS_PER_PAGE = 3;

export enum SortOrder {
  DESC = "desc",
  ASC = "asc",
}
export const DEFAULT_SORT_ORDER = SortOrder.ASC;

export enum SortBy {
  USER_NAME = "userName",
  EMAIL = "email",
  TEXT = "text",
  DONE = "done",
}
export const DEFAULT_SORT_BY = SortBy.USER_NAME;
