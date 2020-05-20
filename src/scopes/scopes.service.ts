import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScopesRepository } from './scopes.repository';

@Injectable()
export class ScopesService {
    constructor(
        @InjectRepository(ScopesRepository)
        private scopesRepository: ScopesRepository,
    ) { }
}
