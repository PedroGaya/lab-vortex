export type User = {
  id: string;
  name: string;
  email: string;
  refCode: string;
  refCount: number;
};

export type CreateUserParams = {
  name: string;
  email: string;
  pwd: string;
};
