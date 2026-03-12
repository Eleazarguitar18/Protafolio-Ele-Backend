import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
// Importamos la llave que define el decorador
import { ROLES_KEY } from "../decorators/roles.decorator"; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Buscamos si el endpoint o el controlador tienen el decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si no hay roles definidos en la ruta, se asume que es pública o solo requiere login
    if (!requiredRoles) return true;

    // Obtenemos el usuario que el JwtAuthGuard inyectó en el request
    const { user } = context.switchToHttp().getRequest();
    
    // Verificamos si el usuario existe y si su rol está en la lista de permitidos
    // El campo 'roleName' debe venir en tu JWT Payload
    return user && user.roleName && requiredRoles.includes(user.roleName); 
  }
}