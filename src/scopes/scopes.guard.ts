import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ScopesGuard implements CanActivate {
    private logger = new Logger();
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const scope = this.reflector.get<string>('scope', context.getHandler());
        if (!scope) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const tokenArray = request.headers.authorization.split(' ');
        const decodedToken: any = jwt.decode(tokenArray[1]);
        const partnerScopes = decodedToken.scopes.replace(/\s*,\s*/g, ",").split(',');
        if (partnerScopes.includes('platform_meta_all')) {
            return true;
        }
        if (!partnerScopes.includes(scope)) {
            this.logger.debug(`Method: validate, scopes do not match, application scopes: ${JSON.stringify(scope)}`);
            throw new UnauthorizedException();
        }
        return true;
    }
}