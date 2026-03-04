import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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
import { DirectedGraph } from 'graphology';
import { INodoGrafo } from './interfaces/grafo.interface';
import { dijkstra } from 'graphology-shortest-path';
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
export class RutasService implements OnModuleInit {
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
      relations: ['linea', 'rutaPuntos'],
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
  async onModuleInit() {
    console.log('El módulo de rutas se ha iniciado en Debian...');
    try {
      await this.construirGrafo();
    } catch (error) {
      console.error('Error al construir el grafo:', error);
    }
  }
  private grafo = new DirectedGraph<INodoGrafo>();
  private async construirGrafo() {
    this.grafo.clear(); // Limpiamos para evitar duplicados al reiniciar
    const rutas = await this.rutaRepository.find({
      relations: ['rutaPuntos', 'rutaPuntos.punto', 'linea'],
    });

    // Mapa usando las coordenadas como llave para asegurar el transbordo
    const paradasFisicas = new Map<string, string[]>();

    rutas.forEach((ruta) => {
      const puntosOrdenados = ruta.rutaPuntos.sort((a, b) => a.orden - b.orden);

      puntosOrdenados.forEach((rp, index) => {
        const nodoId = rp.id.toString();

        // Aseguramos que lat/lon sean números
        const lat = Number(rp.punto.latitud);
        const lon = Number(rp.punto.longitud);

        this.grafo.mergeNode(nodoId, {
          id: nodoId,
          lat: lat,
          lon: lon,
          rutaId: ruta.id,
          lineaNombre: ruta.linea.numero,
        });

        // Aristas de trayecto (Bus)
        if (index < puntosOrdenados.length - 1) {
          const siguienteId = puntosOrdenados[index + 1].id.toString();
          this.grafo.mergeEdge(nodoId, siguienteId, {
            weight: Number(rp.distancia_siguiente) || 500,
            tipo: 'minibus',
          });
        }

        // IMPORTANTE: Usamos la coordenada como llave de transbordo
        // Esto conecta nodos si están en el mismo lugar exacto, tengan el ID que tengan
        const coordKey = `${lat.toFixed(6)},${lon.toFixed(6)}`;
        const lista = paradasFisicas.get(coordKey) || [];
        lista.push(nodoId);
        paradasFisicas.set(coordKey, lista);
      });
    });

    // Generar transbordos
    let transbordosCreados = 0;
    paradasFisicas.forEach((nodos) => {
      if (nodos.length > 1) {
        for (const idA of nodos) {
          for (const idB of nodos) {
            if (idA !== idB) {
              this.grafo.mergeEdge(idA, idB, {
                weight: 1000,
                tipo: 'TRANSBORDO',
              });
              transbordosCreados++;
            }
          }
        }
      }
    });

    console.log(`--- REPORTE DE GRAFO ---`);
    console.log(`Nodos: ${this.grafo.order}`);
    console.log(`Aristas Bus: ${this.grafo.size - transbordosCreados}`);
    console.log(`Aristas Transbordo: ${transbordosCreados}`);
  }
  // private async construirGrafo() {
  //   const rutas = await this.rutaRepository.find({
  //     relations: ['rutaPuntos', 'rutaPuntos.punto', 'linea'],
  //   });

  //   rutas.forEach((ruta) => {
  //     ruta.rutaPuntos.forEach((rp) => {
  //       // AQUÍ usamos la interfaz INodoGrafo
  //       const atributosNodo: INodoGrafo = {
  //         id: rp.id.toString(),
  //         lat: rp.punto.latitud,
  //         lon: rp.punto.longitud,
  //         rutaId: ruta.id,
  //         lineaNombre: ruta.linea.numero,
  //         // (puedes añadir más si tu interfaz los tiene)
  //       };
  //       // Guardamos en el grafo con la seguridad de la interfaz
  //       this.grafo.mergeNode(atributosNodo.id, atributosNodo);

  //       // Conexión...
  //     });
  //   });
  //   console.log('Grafo construido con éxito. Nodos:', this.grafo.order);
  //   console.log('Grafo construido con éxito. Nodos:', this.grafo);
  // }

  // En RutasService
  obtenerEstructuraGrafo() {
    try {
      // IMPORTANTE: .export() convierte el grafo en un JSON legible
      const data = this.grafo.export();

      // Si el grafo es muy grande, mejor devolver un resumen o solo los primeros 100
      return {
        totalNodos: data.nodes.length,
        totalAristas: data.edges.length,
        nodos: data.nodes, // Aquí van todos los puntos
        aristas: data.edges, // Aquí van todas las conexiones
      };
    } catch (error) {
      // Gracias a tu nuevo AllExceptionsFilter, este error será capturado detalladamente
      throw new Error(`Error al exportar el grafo: ${error.message}`);
    }
  }
  async buscarRutaOptima(
    latOrigen: number,
    lonOrigen: number,
    latDestino: number,
    lonDestino: number,
  ) {
    // 1. Encontrar los nodos más cercanos al origen y destino
    const nodoInicio = this.encontrarNodoCercano(latOrigen, lonOrigen);
    const nodoFin = this.encontrarNodoCercano(latDestino, lonDestino);
    console.log(`Nodo inicio: ${nodoInicio}, Nodo fin: ${nodoFin}`);
    if (!nodoInicio || !nodoFin) {
      throw new Error('No se encontraron paradas cercanas a tu ubicación');
    }

    // 2. Ejecutar Dijkstra (bidireccional es más rápido para grafos grandes)
    const camino = dijkstra.bidirectional(
      this.grafo,
      nodoInicio,
      nodoFin,
      (edge, attr) => {
        return attr.weight; // Usamos el peso que definimos al crear las aristas
      },
    );

    if (!camino)
      return { mensaje: 'No hay ruta disponible entre estos puntos' };

    // 3. Formatear la respuesta para el usuario
    return this.formatearResultado(camino);
  }
  // Método auxiliar para buscar el nodo más cercano (distancia simple)
  public encontrarNodoCercano(lat: number, lon: number): string | null {
    let mejorNodo: string | null = null;
    let distanciaMinima = Infinity;
    console.log(`Buscando nodo cercano a lat: ${lat}, lon: ${lon}`);
    this.grafo.forEachNode((node, attr) => {
      const d = Math.sqrt(
        Math.pow(attr.lat - lat, 2) + Math.pow(attr.lon - lon, 2),
      );
      console.log(
        `Distancia al nodo ${node} (lat: ${attr.lat}, lon: ${attr.lon}): ${d}`,
      );
      if (d < distanciaMinima) {
        distanciaMinima = d;
        mejorNodo = node;
      }
    });

    return mejorNodo;
  }
  private formatearResultado(nodosIds: string[]) {
    // Mapeamos los IDs que devolvió Dijkstra a los atributos que guardamos en el grafo
    const rutaCompleta = nodosIds.map((id) => {
      const atributos = this.grafo.getNodeAttributes(id);
      return {
        id: atributos.id,
        lat: atributos.lat,
        lon: atributos.lon,
        linea: atributos.lineaNombre,
        rutaId: atributos.rutaId,
        // Aquí podrías añadir más si los guardaste en mergeNode
      };
    });

    // Calculamos un resumen rápido
    const origen = rutaCompleta[0];
    const destino = rutaCompleta[rutaCompleta.length - 1];

    return {
      distancia_estimada: `${rutaCompleta.length - 1} tramos entre paradas`,
      origen: {
        nombre: `Punto cercano a inicio`,
        coords: { lat: origen.lat, lon: origen.lon },
      },
      destino: {
        nombre: `Punto cercano a destino`,
        coords: { lat: destino.lat, lon: destino.lon },
      },
      camino: rutaCompleta,
    };
  }
}
