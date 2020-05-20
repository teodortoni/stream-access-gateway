import { IsNotEmpty, IsString } from "class-validator";

export class ApplicationScopesDto {
    @IsString()
    @IsNotEmpty()
    applicationId: string;
    
    @IsNotEmpty()
    @IsString()
    scopes: string;
};