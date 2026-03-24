import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  name?: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  estado: boolean = true;

  @IsOptional()
  @IsString()
  roleId?: number; // Por si quieres asignarle un rol desde el inicio
  //   @IsOptional()
  //   profile?: Profile;
}
