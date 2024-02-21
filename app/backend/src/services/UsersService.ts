import * as bcrypt from 'bcryptjs';
import { ServiceResponse, ServiceMessage } from '../utils/ServiceResponse';
import { IUser } from '../Interfaces/users/IUser';
import { IUserModel } from '../Interfaces/users/IUserModel';
import UsersModels from '../models/UsersModels';
import { IToken } from '../Interfaces/IToken';
import JWT from '../utils/JWT';

export default class UsersService {
  constructor(
    private usersModel: IUserModel = new UsersModels(),
    private jwtService = JWT,
  ) {}

  public async findAllUser(): Promise<ServiceResponse<IUser[]>> {
    const allUsers = await this.usersModel.findAll();
    return { status: 'SUCCESSFUL', data: allUsers };
  }

  public async login(data:IUser): Promise<ServiceResponse<ServiceMessage | IToken>> {
    const user = await this.usersModel.findByEmail(data.email);
    if (user) {
      if (!bcrypt.compareSync(data.password, user.password)) {
        return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
      }
      const { email, role } = user;
      console.log(email, role);
      const token = this.jwtService.sign({ email, role });
      return { status: 'SUCCESSFUL', data: { token } };
    }
    return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
  }

  public async findByRole(role: IUser['id']):
  Promise<ServiceResponse<{ role: string } | ServiceMessage>> {
    const users = await this.usersModel.findByRole(role);
    if (!users) {
      return { status: 'INVALID_DATA', data: { message: 'Role not found' } };
    }
    return { status: 'SUCCESSFUL', data: { role: users } };
  }
}
