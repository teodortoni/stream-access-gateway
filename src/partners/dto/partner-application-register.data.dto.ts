import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class PartnerApplicationRegisterData {
    @IsString()
    @MinLength(4)
    @MaxLength(120)
    clientName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(120)
    clientApplicationName: string;

    @IsNotEmpty()
    @IsString()
    scopes: string;
}