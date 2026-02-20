import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { CreateRutaGeneralDto } from './dto/create-ruta-general';
import { ApiBody } from '@nestjs/swagger';
import { PuntoDto } from 'src/puntos/dto/punto-dto';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Post()
  async create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }
  @Post('rutas_general')
  @ApiBody({ type: CreateRutaGeneralDto })
  async create_general(@Body() CreateRutaGeneralDto: CreateRutaGeneralDto) {
    //return CreateRutaGeneralDto;
    //console.log(CreateRutaGeneralDto);
    return this.rutasService.create_general(CreateRutaGeneralDto);
  }
  

  @Get()
  findAllGeneral() {
    return this.rutasService.findAllGeneral();
  }

  @Get(':id')
  findOneGeneral(@Param('id') id: number) {
    return this.rutasService.findOneGeneral(+id);
  }
  // @Get()
  // findAll() {
  //   return this.rutasService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.rutasService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRutaDto: UpdateRutaDto) {
    return this.rutasService.update(+id, updateRutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutasService.remove(+id);
  }

  @Post('grafo') construirGrafo(
    @Body('puntos') puntos: PuntoDto[],
    @Body('rutaPuntos') rutaPuntos: any[],
  ) {
    return this.rutasService.construirGrafo(puntos, rutaPuntos);
  }
  @Post('calcular')
  async calcular(@Body() body: any) {
    // return 'hola';
    // Asegúrate de llamar al service y retornar su promesa
    console.log(
      body.origenLat,
      body.origenLng,
      body.destinoLat,
      body.destinoLng,
    );
    return await this.rutasService.obtenerRutaOptima(
      body.origenLat,
      body.origenLng,
      body.destinoLat,
      body.destinoLng,
    );
  }
  // rutas.controller.ts
}
