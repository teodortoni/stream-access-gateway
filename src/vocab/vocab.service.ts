import { Injectable, Logger } from "@nestjs/common"
import { FreighterService } from "../freighter/freighter.service"

@Injectable()
export class VocabService {
  private logger = new Logger("VocabService")
  constructor(private freighterService: FreighterService) {}

  async getVocab(): Promise<any> {
    try {
      return await this.freighterService.getVocab()
    } catch (error) {
      this.logger.error(`Method: getVocab, ${error.message}, status: ${error.status}`, error.stack)
      throw error
    }
  }

  async getVocabType(type: string): Promise<any> {
    try {
      return await this.freighterService.getVocabTypeDetails(type)
    } catch (error) {
      this.logger.error(
        `Method: getVocabType, ${error.message}, status: ${error.status}`,
        error.stack
      )
      throw error
    }
  }
}
