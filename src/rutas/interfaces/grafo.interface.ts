export interface INodoGrafo {
  id: string;        // ID único (ej: "RP_105" usando el id de RutaPunto)
  lat: number;       // Latitud (viene de Punto)
  lon: number;       // Longitud (viene de Punto)
  rutaId: number;    // ID de la Ruta (para saber en qué bus estamos)
  lineaNombre: string; // Para mostrar al usuario: "Toma el Micro H"
}

export interface IAristaGrafo {
  source: string;    // ID del nodo origen
  target: string;    // ID del nodo destino
  weight: number;    // La distancia_siguiente o penalización de transbordo
}