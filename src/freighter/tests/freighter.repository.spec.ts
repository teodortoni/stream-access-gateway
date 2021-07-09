import { Test } from "@nestjs/testing"
import { EntityManager } from "typeorm"
import { FreighterRepository } from "../freighter.repository"

describe("Freighter Repository", () => {
  let freighterRepo: FreighterRepository, query
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FreighterRepository, EntityManager]
    }).compile()

    freighterRepo = await module.get<FreighterRepository>(FreighterRepository)
    query = jest.fn()
  })

  describe("Test Query", () => {
    it("query", () => {
      freighterRepo.query = jest.fn().mockImplementationOnce(() => Promise.resolve(true))
    })
  })
})
