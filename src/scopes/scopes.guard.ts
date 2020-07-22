import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ScopesGuard implements CanActivate {
    private logger = new Logger();
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const scopes = this.reflector.get<string[]>('scopes', context.getHandler());
        if (!scopes) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const tokenArray = request.headers.authorization.split(' ');
        const decodedToken: any = jwt.decode(tokenArray[1]);
        const partnerScopes = decodedToken.scopes.replace(/\s*,\s*/g, ",").split(',');
        if (!partnerScopes.some(scope => scopes.includes(scope))) {
            this.logger.debug(`Method: validate, scopes do not match, application scopes: ${JSON.stringify(scopes)}`);
            throw new UnauthorizedException();
        }
        return decodedToken.scopes;
    }
}