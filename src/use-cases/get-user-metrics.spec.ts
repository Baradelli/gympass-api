import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryCheckInsrepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsrepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsrepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await Promise.all([
      checkInsRepository.create({
        gym_id: 'gym-01',
        user_id: 'user-01',
      }),
      checkInsRepository.create({
        gym_id: 'gym-02',
        user_id: 'user-01',
      }),
    ])

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
