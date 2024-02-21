import { IUser } from '../Interfaces/users/IUser';
import SequelizeUsers from '../database/models/SequelizeUsers';
import { IUserModel } from '../Interfaces/users/IUserModel';

export default class UsersModels implements IUserModel {
  private model = SequelizeUsers;

  async findAll() : Promise<IUser[]> {
    const dbData = await this.model.findAll();
    return dbData.map(({ email, password }) => (
      { email, password }
    ));
  }

  async findById(id: IUser['id']): Promise<IUser | null> {
    const userId = await this.model.findByPk(id);
    if (!userId) return null;
    const { email, password } = userId;
    return { email, password };
  }

  async findByEmail(email: IUser['email']): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email } });
    if (!user) return null;
    const { id, password, role } = user;
    return { id, email, password, role };
  }

  async findByRole(id: IUser['id']): Promise<string | null> {
    const userId = await this.model.findByPk(id);
    if (!userId) return null;
    const { role } = userId;
    return role;
  }
}
