import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { Repository } from 'typeorm';
import { Certification } from './entities/certification.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private readonly certifications: Repository<Certification>,
  ) {}
  create(createCertificationDto: CreateCertificationDto) {
    const certification = this.certifications.create(createCertificationDto);
    return this.certifications.save(certification);
  }

  findAll() {
    return this.certifications.find();
  }

  async findOne(id: number) {
    const certification = await this.certifications.findOneBy({ id });
    
    if (!certification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
    
    return certification;
  }

  async update(id: number, updateCertificationDto: UpdateCertificationDto) {
    const certification = await this.certifications.findOneBy({ id });
    
    if (!certification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
    
    return this.certifications.update(id, updateCertificationDto);
  }

  async remove(id: number) {
    const certification = await this.certifications.findOneBy({ id });
    
    if (!certification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
    
    return this.certifications.update(id, { estado: false });
  }
}
