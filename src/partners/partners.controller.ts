import { Controller, Get, Body, ValidationPipe } from '@nestjs/common';

@Controller('partners')
export class PartnersController {
    @Get('/:id')
    getPartner() {
        return 'Partner here';
    }
}
