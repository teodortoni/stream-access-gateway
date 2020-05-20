import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class PartnerAuthJwt {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    clientId: string;
}