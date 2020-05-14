import { Repository, EntityRepository, EntityManager, getManager } from "typeorm";
import { Scopes } from "src/entities/scopes.entity";
import { Logger } from "@nestjs/common";

@EntityRepository(Scopes)
export class ScopesRepository extends Repository<Scopes> {
    private logger = new Logger('ScopesRepository');

    constructor(public manager: EntityManager = getManager()) {
        super();
    }
}