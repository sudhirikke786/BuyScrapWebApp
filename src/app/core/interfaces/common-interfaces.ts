export interface Pagination {
  Status: string;
  PageNumber: number;
  RowOfPage: number;
  LocationId: number;
}

export interface Organization {
  orgName: string;
  password: string;
}

export interface User {
  userName: string;
  password: string;
  locID: number;
  macID: string;
  isActive: boolean;
  isConfirm: boolean;
}