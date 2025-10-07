export type User = {
  id: string;
  name: string;
  email: string;
  refCode: string;
  refCount: number;
};

export type RegisterData = {
  name: string;
  email: string;
  pwd: string;
  referred?: boolean;
};

export type LoginData = {
  identifier: string;
  pwd: string;
};

export type ApiError = {
  message: string;
};
