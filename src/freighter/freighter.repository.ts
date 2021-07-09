import { EntityManager, EntityRepository, getManager, Repository } from "typeorm"
import { SonyDeliveries } from "../entities/freighter/sony-deliveries.entity"

@EntityRepository(SonyDeliveries)
export class FreighterRepository extends Repository<SonyDeliveries> {
  constructor(public manager: EntityManager = getManager()) {
    super()
  }
}
