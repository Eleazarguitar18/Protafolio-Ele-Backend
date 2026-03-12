import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/decorators/auth_public.decorator';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Public()
  @Post('register')
  async create(@Body() createAuthDto: CreateAuthDto) {
      return await this.usuarioService.create(createAuthDto);
  }
  

  @Get()
  async findAll() {
    const respuesta = await this.usuarioService.findAll();
    const data = {
      status: 200,
      message: 'Listado de usuarios registradas!',
      data: respuesta,
    };
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
