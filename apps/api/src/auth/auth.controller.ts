import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login usando cookie HttpOnly
   */
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1️⃣ Validar usuario y PIN
    const user = await this.authService.validateUser(body.username, body.pin);

    // 2️⃣ Crear JWT
    const token = await this.authService.login({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    // 3️⃣ Guardar JWT en cookie HttpOnly
    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    // 4️⃣ Retornar mensaje y datos públicos del usuario
    return {
      message: 'Login exitoso',
      user: { id: user._id.toString(), username: user.username },
    };
  }
}
