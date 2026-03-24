import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { CertificationModule } from 'src/certification/certification.module';
import { TechnologyModule } from 'src/technology/technology.module';
import { MediaModule } from 'src/media/media.module';
import { UserModule } from 'src/user/user.module';
import { Project } from './entities/project.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Project]),
      MailModule,
      TechnologyModule,
      MediaModule,
      UserModule
    ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
