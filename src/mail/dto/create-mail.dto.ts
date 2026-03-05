import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMailDto {
  @ApiProperty()
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
export class UpdateMailDto extends PartialType(CreateMailDto) {}
