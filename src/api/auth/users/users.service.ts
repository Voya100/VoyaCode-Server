import { ServerConfigService } from '@core/server-config/server-config.service';
import { Injectable } from '@nestjs/common';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly config: ServerConfigService) {}

  // There is only 1 user (the admin), so no database is needed
  // Function is kept as async so that possible migration would be easier in the future
  async getUser(name: string): Promise<IUser> {
    const user = this.config.users[name];
    return (
      user && {
        username: user.username,
        role: user.role
      }
    );
  }

  async getUserPassword(name: string) {
    const user = this.config.users[name];
    return user && user.password;
  }
}
