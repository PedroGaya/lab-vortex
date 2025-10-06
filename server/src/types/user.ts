export type User = {
  id: string;
  name: string;
  email: string;
  refCode: string;
  refCount: number;
};

export type UserParams = {
  name: string;
  email: string;
  pwd: string;
};
