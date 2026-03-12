import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
  ) {}
  async create(createPersonaDto: CreatePersonaDto) {
    // const {...personaData}=createPersonaDto;
    const persona = this.personaRepository.create(createPersonaDto);
    const personaData = await this.personaRepository.save(persona);
    return personaData;
  }

  async findAll() {
    const data = await this.personaRepository.find({
      where: { estado: true },
    });
    if (data.length === 0) {
      throw new NotFoundException(`No existen datos de personass`);
    }
    return data;
  }
  async findOne(id: number) {
    const data = await this.personaRepository.findOneBy({ id: id });
    if (!data) {
      throw new NotFoundException(`No existen datos de la persona`);
    }
    return data;
  }
  // async buscar_por_ci(ci: string) {
  //   const data = await this.personaRepository.findOneBy({ ci: ci });
  //   if (!data) {
  //     throw new NotFoundException(`No existen datos de la persona con el seguiente ci: ${ci}`);
  //   }
  //   return data;
  // }

  async update(
    id: number,
    updatePersonaDto: UpdatePersonaDto,
    idUserUpdate: number,
  ) {
    // 1. Verificar existencia
    const persona = await this.personaRepository.findOneBy({ id });

    if (!persona) {
      throw new NotFoundException(`La persona con ID ${id} no existe`);
    }

    // 2. Fusionar cambios
    // Usamos merge para aplicar los cambios del DTO sobre la entidad encontrada
    const personaEditada = this.personaRepository.merge(
      persona,
      updatePersonaDto,
    );

    // 3. Asignar auditoría
    personaEditada.id_user_update = idUserUpdate;

    // 4. Persistencia
    try {
      return await this.personaRepository.save(personaEditada);
    } catch (error) {
      // Manejo de errores de BD (ej. truncado de strings o formato de fecha)
      throw new InternalServerErrorException(
        'Error al actualizar los datos de la persona',
      );
    }
  }

  async remove(id: number) {
    const persona = await this.personaRepository.findOneBy({ id });
    if (!persona) {
      throw new NotFoundException(`La persona con ID ${id} no existe`);
    }
    persona.estado = false;
    try {
      return await this.personaRepository.save(persona);
    } catch (error) {
      // Manejo de errores por si hay nombres duplicados en las personas
      throw new Error('Error al actualizar la persona: ' + error.message);
    }
  }
}
