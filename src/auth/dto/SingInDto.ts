import { User } from 'src/user/entities/user.entity';

export class SignInDto {
  user: User;
  access_token: string;
  refresh_token: string;
}
