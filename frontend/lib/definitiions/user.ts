export type User = {
  id: number;
  fullname: string;
  email: string;
  avatar?: string;
}

export type UserCredential = Pick<User, 'email'> & {
  password: string;
  confirm_password?: string;
  new_password?: string;
}
