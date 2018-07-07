import { IUser } from '@api/auth/users/user.interface';
import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (_data, req): IUser => {
    return req.user;
  }
);
