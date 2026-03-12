import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { PersonaModule } from 'src/persona/persona.module';
import { Persona } from 'src/persona/entities/persona.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MailModule } from 'src/mail/mail.module';
import { Role } from 'src/auth/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Persona,Role]), PersonaModule, MailModule],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
