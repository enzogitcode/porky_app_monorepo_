import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/users/common/enums/roles.enums';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validar usuario y PIN
   */
  async validateUser(username: string, pin: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const match = await bcrypt.compare(pin, user.pin);
    if (!match) throw new UnauthorizedException('PIN incorrecto');

    return user;
  }

  /**
   * Generar JWT
   */
  async login(user: { id: string; username: string; role: Role }) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
