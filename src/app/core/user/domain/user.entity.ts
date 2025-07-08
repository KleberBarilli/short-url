export abstract class UserEntityProps {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  constructor(private _props: UserEntityProps = {}) {}

  get name(): string | undefined {
    return this._props.name;
  }
  set name(newName: string) {
    this._props.name = newName.trim().replace(/\s+/g, ' ');
  }

  get email(): string | undefined {
    return this._props.email;
  }
  set email(newEmail: string) {
    this._props.email = newEmail.trim().toLowerCase();
  }

  get password(): string | undefined {
    return this._props.password;
  }
  set password(newPassword: string) {
    this._props.password = newPassword;
  }
}
