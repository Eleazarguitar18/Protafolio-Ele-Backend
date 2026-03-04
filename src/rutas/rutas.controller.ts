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
import { BusquedaRutaDto } from './dto/busqueda-ruta-dto';

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
  @Get('debug/grafo')
  obtenerEstructuraGrafo() {
    // return "funciona el endpoint de prueba";
    return this.rutasService.obtenerEstructuraGrafo();
  }
  @Post('ruta-optima')
  async buscarRuta(@Body() busquedaDto: BusquedaRutaDto) {
    const { latOrigen, lonOrigen, latDestino, lonDestino } = busquedaDto;

    // Llamamos al servicio pasando los datos del body
    return await this.rutasService.buscarRutaOptima(
      latOrigen,
      lonOrigen,
      latDestino,
      lonDestino,
    );
  }
  @Post('nodo-cercano')
  async nodoCercano(@Body() busquedaDto: BusquedaRutaDto) {
    const { latOrigen, lonOrigen } = busquedaDto;
    return this.rutasService.encontrarNodoCercano(latOrigen, lonOrigen);
  }
  // rutas.controller.ts}
}
