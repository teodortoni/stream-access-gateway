export class AccessTokenDataDto {
    clientId: string;
    applicationId: string;
    credentialsId: string;
    privateKey: string;
    passphrase: string;
    iat: number;
    exp: number;
    scopes: string;
}