import { IUser } from './IUser';

export interface IUserModel {
  findByEmail(email: IUser['email']): Promise<IUser | null>,
  findAll(): Promise<IUser[]>
  findById(id: IUser['id']): Promise<IUser | null>
  findByRole(role: IUser['id']): Promise<string | null>
}
