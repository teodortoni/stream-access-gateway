import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PartnerAuthJwt } from "./dto/partner-auth-jwt.dto";
import { JwtSecretRequestType } from "@nestjs/jwt";
import * as jwt from "jsonwebtoken";
import * as config from "config";

export class PartnerAuthJwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: (
                requestType: JwtSecretRequestType,
                tokenOrPayload: object,
                verifyOrSignOrOptions?: jwt.VerifyOptions | jwt.SignOptions
            ) => {
                switch (requestType) {
                case JwtSecretRequestType.SIGN:
                    // retrieve signing key dynamically
                    const key = tokenOrPayload['key'];
                    const passphrase = tokenOrPayload['passphrase'];
                    delete tokenOrPayload['key'];
                    delete tokenOrPayload['passphrase']
                    console.log(`tokenOrPayload: `, tokenOrPayload);
                    console.log(`privateKey: ${key}`);
                    console.log(`passphrase: ${passphrase}`);
                    console.log(`Algorithm: ${config.get('app.jwt.algorithm')}`);
                    // In case of a private key with passphrase an object { key, passphrase } can be used (based on crypto documentation), 
                    // In this case be sure you pass the algorithm option.
                    return { key, passphrase };
                case JwtSecretRequestType.VERIFY:
                    // retrieve public key for verification dynamically
                    console.log(`verifyOrSignOrOptions: `, verifyOrSignOrOptions);
                    console.log(`Algorithm: ${config.get('app.jwt.algorithm')}`);
                    const publicKey = verifyOrSignOrOptions['jwtid'];
                    return publicKey;
                default:
                    // retrieve secret dynamically
                    return null;
                }
            },
        });
    }

    async validate(payload: PartnerAuthJwt): Promise<void> {
        
    }
}