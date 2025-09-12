// src/users/user.entity.ts
export class User {
  constructor(
    public id: number,
    public email: string,
    public password: string, // store hashed password in real app
  ) {}
}
