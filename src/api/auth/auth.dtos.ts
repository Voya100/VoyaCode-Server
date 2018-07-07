import { IsDefined, IsString } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsString({ message: 'Username must be a string.' })
  username: string;

  @IsDefined()
  @IsString({ message: 'Password must be a string.' })
  password: string;
}
