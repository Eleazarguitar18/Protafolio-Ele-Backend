import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'node_modules/bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    // No necesitamos el repositorio de Profile si usamos cascade: true
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, firstName, lastName, roleId } =
      createUserDto;

    // 1. Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // 2. Encriptar contraseña (¡Seguridad ante todo!)
    const hashedPassword = await await this.encriptar_password(password);

    const nameUser = firstName + ' ' + lastName;
    // 3. Crear el objeto Usuario y su Perfil asociado
    const newUser = this.userRepository.create({
      name: nameUser,
      email,
      password: hashedPassword,
      role: { id: roleId || 2 }, // Asignamos un rol por defecto si no viene
      profile: {
        firstName,
        lastName,
        // Aquí podrías inicializar otros campos vacíos si quisieras
      },
    });

    // 4. Guardar (TypeORM insertará en 'profiles' y luego en 'users' automáticamente)
    const savedUser = await this.userRepository.save(newUser);

    // 5. Limpiar el password antes de devolver la respuesta
    // delete savedUser.password;
    return savedUser;
  }

  async encriptar_password(password: string): Promise<string> {
    const saltRounds = parseInt(
      this.configService.get<string>('SALT_ROUNDS') ?? '10',
      10,
    );
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
