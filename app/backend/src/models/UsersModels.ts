import { IUser } from '../Interfaces/users/IUser';
import SequelizeUsers from '../database/models/SequelizeUsers';
import { IUserModel } from '../Interfaces/users/IUserModel';

export default class UsersModels implements IUserModel {
  private model = SequelizeUsers;

  async findByEmail(email: IUser['email']): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email } });
    if (!user) return null;
    const { id, password, role } = user;
    return { id, email, password, role };
  }
}
