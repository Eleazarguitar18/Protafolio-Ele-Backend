import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/auth_public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @Public()
  // @Post('register')
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   try {
  //     return this.authService.create(createAuthDto);
  //   } catch (error) {
  //     // puedes inspeccionar el error y lanzar un HttpException
  //     throw new HttpException(
  //       {
  //         status: error.status || 500,
  //         message: error.message || 'Error al crear la persona',
  //         details: error.detail || null, // opcional, por ejemplo para errores de DB
  //       },
  //       error.status || 500,
  //     );
  //   }
  // }
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
  @Public()
  @Post('refresh_token')
  async refresh_token(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    return this.authService.refresh_token(token);
  }
  @Public()
  @Post('reset/code')
  async requestPasswordChange(@Body() emailDto: { email: string }) {
    return this.authService.requestPasswordChange(emailDto.email);
  }
  @Public()
  @Post('reset-confirm')
  async confirmPasswordChange(
    @Body() resetDto: { email: string; code: string; newPassword: string }
  ) {
    return this.authService.confirmPasswordChange(
      resetDto.email,
      resetDto.code,
      resetDto.newPassword
    );
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
