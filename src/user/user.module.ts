import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/auth/entities/role.entity';
import { MailModule } from 'src/mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { ProjectModule } from 'src/project/project.module';
import { CertificationModule } from 'src/certification/certification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Profile]),
    MailModule,
    CertificationModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
