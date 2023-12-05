import {CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards} from '@nestjs/common';
import { Role } from '../enum/roles.enum';
import {Reflector} from "@nestjs/core";

const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, ctx.getHandler());

        if (!requiredRoles) {
            return true;
        }
        const { user } = ctx.switchToHttp().getRequest();
        if (!user) {
            return false;
        }
        return requiredRoles.some(role => user.role_id === role);
    }
}