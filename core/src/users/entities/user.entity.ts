import { Role } from '../../auth/dto/auth.dto';

export class User {
  id: string;
  fullName: string;
  email: string;
  hashedPassword: string;
  role: Role;
  createdAt: string;
  updateAt: string;
}
