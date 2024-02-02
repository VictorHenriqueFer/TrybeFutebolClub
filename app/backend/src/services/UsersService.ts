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

  public async login(data:IUser): Promise<ServiceResponse<ServiceMessage | IToken>> {
    const user = await this.usersModel.findByEmail(data.email);
    if (user) {
      if (!bcrypt.compareSync(data.password, user.password)) {
        return { status: 'INVALID_DATA', data: { message: 'Email ou senha inválido' } };
      }
      const { email } = user;
      const token = this.jwtService.sign({ email });
      return { status: 'SUCCESSFUL', data: { token } };
    }
    return { status: 'NOT_FOUND', data: { message: 'User not found' } };
  }
}
