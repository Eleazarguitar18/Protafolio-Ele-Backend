import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './auth/config/constants';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './config/redis.config';
import { JwtConfig } from './config/jwt.config';
import { DatabaseConfig } from './config/database.config';
import { RedisManagerModule } from './redis-manager/redis-manager.module';
import { ProjectModule } from './project/project.module';
import { TechnologyModule } from './technology/technology.module';
import { CertificationModule } from './certification/certification.module';
import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisConfig),
    TypeOrmModule.forRootAsync(DatabaseConfig),
    JwtModule.registerAsync({
      ...JwtConfig,
      global: true, // Lo definimos aquí para evitar errores de tipo en la constante
    }),
    AuthModule,
    MailModule,
    RedisManagerModule,
    ProjectModule,
    TechnologyModule,
    CertificationModule,
    MediaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
