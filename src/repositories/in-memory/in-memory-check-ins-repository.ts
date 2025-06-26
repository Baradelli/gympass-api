import { Prisma, type CheckIn } from '@prisma/client'
import type { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsrepository implements CheckInsRepository {
  public checkIns: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const newCheckIn: CheckIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(newCheckIn)

    return newCheckIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkIn = this.checkIns.find(
      (checkIn) =>
        checkIn.user_id === userId &&
        checkIn.created_at.toDateString() === date.toDateString(),
    )

    if (!checkIn) return null

    return checkIn
  }
}
