import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ruta } from './entities/ruta.entity';
import { Repository } from 'typeorm';
import { LineasService } from 'src/lineas/lineas.service';
import { CreateLineaDto } from 'src/lineas/dto/create-linea.dto';
import { CreateRutaGeneralDto } from './dto/create-ruta-general';
import { Linea } from 'src/lineas/entities/linea.entity';
import { CreatePuntoDto } from 'src/puntos/dto/create-punto.dto';
import { PuntosService } from 'src/puntos/puntos.service';
import { Punto } from 'src/puntos/entities/punto.entity';
import { CreateRutaPuntosDto } from './dto/create-ruta-puntos-dto';
import { RutaPunto } from './entities/ruta_puntos.entity';
import { PuntoDto } from 'src/puntos/dto/punto-dto';
import { GrafoDto } from './dto/grafo-dto';
import { NodoDto } from './dto/nodo-dto';
import { AristaDto } from './dto/arista-dto';
export interface TramoItinerario {
  modo: string;
  lineaId: number;
  desde: string;
  hasta: string;
  distancia: number;
  coords: { lat: number; lng: number };
}
export interface RespuestaRuta {
  distanciaTotalMetros: number;
  cantidadTramos: number;
  tramos: TramoItinerario[];
  mensaje: string;
}
@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private rutaRepository: Repository<Ruta>,
    @InjectRepository(RutaPunto)
    private rutaPuntoRepository: Repository<RutaPunto>,
    private readonly lineaService: LineasService,
    private readonly puntosService: PuntosService,
  ) {}
  async create(createRutaDto: CreateRutaDto) {
    const ruta: Ruta = this.rutaRepository.create(createRutaDto);
    return this.rutaRepository.save(ruta);
    // return 'This action adds a new ruta';
  }
  async create_ruta_puntos(createRutaPuntosDto: CreateRutaPuntosDto) {
    const rutaPuntos: RutaPunto =
      this.rutaPuntoRepository.create(createRutaPuntosDto);
    return this.rutaPuntoRepository.save(rutaPuntos);
  }
  async create_general(createRutaGeneralDto: CreateRutaGeneralDto) {
    const lineaDto: CreateLineaDto = createRutaGeneralDto.linea;
    const linea: Linea = await this.lineaService.create(lineaDto);
    const rutaDto: CreateRutaDto = createRutaGeneralDto.ruta;
    rutaDto.linea = linea;
    const ruta: Ruta = await this.create(rutaDto);
    const puntosDto: CreatePuntoDto[] = createRutaGeneralDto.puntos;
    let orden = 1;
    const puntos: Punto[] = [];
    for (const puntoDto of puntosDto) {
      const punto: Punto = await this.puntosService.create(puntoDto);
      puntos.push(punto);
      const rutaPuntosDto: CreateRutaPuntosDto = {
        ruta: ruta,
        punto: punto,
        orden: orden++,
        distancia_siguiente:
          puntoDto.distancia_al_siguiente === null
            ? 0
            : puntoDto.distancia_al_siguiente,
      };
      await this.create_ruta_puntos(rutaPuntosDto);
    }
    return {
      status: 201,
      success: true,
      message: 'Se creo la ruta con exito!',
      data: {
        linea: linea,
        ruta: ruta,
        puntos: puntos,
      },
    };
  }

  async findAllGeneral() {
    const rutas = await this.rutaRepository.find({
      relations: ['linea','rutaPuntos'],
    });
    return {
      status: 200,
      success: true,
      message: 'Rutas obtenidas correctamente',
      data: rutas,
    };
  }

  async findOneGeneral(id: number) {
    const ruta = await this.rutaRepository.findOne({
      where: { id },
      relations: ['linea', 'rutaPuntos'],
    });
    if (!ruta) {
      throw new NotFoundException(`Ruta con id ${id} no encontrada`);
    }
    return {
      status: 200,
      success: true,
      message: 'Ruta obtenida correctamente',
      data: ruta,
    };
  }

  findAll() {
    return `This action returns all rutas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ruta`;
  }

  update(id: number, updateRutaDto: UpdateRutaDto) {
    return `This action updates a #${id} ruta`;
  }

  remove(id: number) {
    return `This action removes a #${id} ruta`;
  }
  construirGrafo(puntos: PuntoDto[], rutaPuntos: any[]): GrafoDto {
    // DIAGNÓSTICO:
    console.log('--- DEBUG GRAFO ---');
    console.log('Cantidad de puntos:', puntos.length);
    console.log('Cantidad de rutas:', rutaPuntos.length);
    if (rutaPuntos.length > 0) {
      console.log('Muestra de la primera ruta:', rutaPuntos[0]);
    }
    console.log('-------------------');
    const nodos: Record<number, NodoDto> = {};
    const aristas: Record<number, AristaDto[]> = {};

    puntos.forEach((p) => {
      nodos[p.id] = {
        id: p.id,
        nombre: p.nombre,
        latitud: p.latitud,
        longitud: p.longitud,
      };
    });

    rutaPuntos.forEach((rp) => {
      // DIAGNÓSTICO:

      // REVISIÓN CRÍTICA: Asegúrate de usar el nombre exacto de la columna en la DB
      // Si en tu DB es 'origen_id', cámbialo aquí.
      const origenId = rp.origenId || rp.origen_id;
      const destinoId = rp.destinoId || rp.destino_id;
      const peso = rp.distancia_al_siguiente || rp.distancia || 0;

      if (origenId === undefined || destinoId === undefined) {
        console.error('Fila de ruta_punto con IDs nulos:', rp);
        return; // Saltamos esta fila dañada
      }

      const arista: AristaDto = {
        origen: Number(origenId),
        destino: Number(destinoId),
        peso: Number(peso),
        lineaId: rp.lineaId || rp.linea_id,
        modo: 'minibus',
      };

      if (!aristas[arista.origen]) {
        aristas[arista.origen] = [];
      }
      aristas[arista.origen].push(arista);
    });

    return { nodos, aristas };
  }

  private ejecutarDijkstra(
    grafo: GrafoDto,
    idOrigen: number,
    idDestino: number,
  ) {
    const distancias = new Map<number, number>();
    const previos = new Map<
      number,
      { nodoId: number; lineaId: number; peso: number } | null
    >();
    const visitados = new Set<number>();

    // 1. Inicializar
    Object.keys(grafo.nodos).forEach((idStr) => {
      const id = Number(idStr);
      distancias.set(id, Infinity);
      previos.set(id, null);
    });

    distancias.set(idOrigen, 0);

    while (true) {
      let nodoActual: number | null = null;
      let distanciaMinima = Infinity;

      // 2. Seleccionar nodo con distancia mínima
      for (const [id, dist] of distancias.entries()) {
        if (!visitados.has(id) && dist < distanciaMinima) {
          distanciaMinima = dist;
          nodoActual = id;
        }
      }

      if (nodoActual === null || nodoActual === idDestino) break;
      visitados.add(nodoActual);

      // 3. Explorar aristas
      const aristasVecinas = grafo.aristas[nodoActual] || [];
      for (const arista of aristasVecinas) {
        if (visitados.has(arista.destino)) continue;

        const nuevaDistancia =
          distancias.get(nodoActual)! + Number(arista.peso);

        if (nuevaDistancia < distancias.get(arista.destino)!) {
          distancias.set(arista.destino, nuevaDistancia);
          previos.set(arista.destino, {
            nodoId: nodoActual,
            lineaId: arista.lineaId,
            peso: Number(arista.peso),
          });
        }
      }
    }

    // --- LÓGICA DE ACERCAMIENTO ---
    let destinoFinalReal = idDestino;
    let esRutaParcial = false;

    if (distancias.get(idDestino) === Infinity) {
      esRutaParcial = true;
      let minDiff = Infinity;
      const nodoDestinoInfo = grafo.nodos[idDestino];

      // Buscamos cuál de los nodos que SÍ alcanzamos está más cerca del destino final
      visitados.forEach((idVisitado) => {
        const nodoV = grafo.nodos[idVisitado];
        // Distancia euclidiana simple para encontrar cercanía geográfica
        const diff = Math.sqrt(
          Math.pow(nodoV.latitud - nodoDestinoInfo.latitud, 2) +
            Math.pow(nodoV.longitud - nodoDestinoInfo.longitud, 2),
        );
        if (diff < minDiff) {
          minDiff = diff;
          destinoFinalReal = idVisitado;
        }
      });
    }

    return {
      previos,
      distanciaTotal: distancias.get(destinoFinalReal),
      destinoAlcanzado: destinoFinalReal,
      esRutaParcial,
    };
  }

  private reconstruirCamino(
    grafo: GrafoDto,
    previos: Map<number, any>,
    idDestino: number,
  ) {
    const itinerario: TramoItinerario[] = [];
    let actualId = idDestino;

    // Los Map (previos) siguen usando .has() y .get()
    if (!previos.has(actualId) || previos.get(actualId) === null) {
      return [];
    }

    while (previos.get(actualId) !== null) {
      const info = previos.get(actualId);

      // CORRECCIÓN: Acceso por corchetes para Record/Object
      const nodoActual = grafo.nodos[actualId];
      const nodoAnterior = grafo.nodos[info.nodoId];

      if (nodoActual && nodoAnterior) {
        itinerario.unshift({
          modo: 'minibus',
          lineaId: info.lineaId,
          desde: nodoAnterior.nombre,
          hasta: nodoActual.nombre,
          distancia: info.peso,
          coords: { lat: nodoActual.latitud, lng: nodoActual.longitud },
        });
      }

      actualId = info.nodoId;
    }

    return itinerario;
  }
  async obtenerRutaOptima(
    origenLat: number,
    origenLng: number,
    destinoLat: number,
    destinoLng: number,
  ): Promise<RespuestaRuta> {
    // A. Buscar paradas cercanas en la DB
    const pInicio = await this.puntosService.buscarCercano(
      origenLat,
      origenLng,
    );
    const pFin = await this.puntosService.buscarCercano(destinoLat, destinoLng);

    if (!pInicio || !pFin) {
      throw new NotFoundException('No se encontraron paradas cercanas.');
    }

    // B. Construir Grafo
    const puntos = await this.puntosService.findAll();
    const rutasPuntos = await this.rutaPuntoRepository.find();
    const grafo = this.construirGrafo(puntos, rutasPuntos);

    // C. Ejecutar Dijkstra
    const { previos, distanciaTotal, destinoAlcanzado, esRutaParcial } =
      this.ejecutarDijkstra(grafo, pInicio.id, pFin.id);

    // D. Reconstruir Camino
    const tramos = this.reconstruirCamino(grafo, previos, destinoAlcanzado);

    if (tramos.length === 0 && pInicio.id !== pFin.id) {
      throw new NotFoundException(
        'No se pudo encontrar ninguna ruta transitable.',
      );
    }

    return {
      distanciaTotalMetros: Math.round(distanciaTotal || 0),
      cantidadTramos: tramos.length,
      tramos: tramos,
      mensaje: esRutaParcial
        ? 'Ruta parcial: No hay minibús directo hasta el final, te acercamos lo más posible.'
        : 'Ruta óptima encontrada.',
    };
  }
}
